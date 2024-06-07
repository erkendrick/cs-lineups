const fs = require('fs');
const path = require('path');
const db = require('./backend/db/database'); 

const generateStaticAssets = async () => {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM images', [], (err, rows) => {
                if (err) {
                    reject('Error fetching images from the database: ' + err.message);
                } else {
                    resolve(rows);
                }
            });
        });

        const metadata = rows.map(row => {
            if (!row.image_blob) {
                console.error(`No image_blob found for image ID: ${row.id}`);
                return null;
            }

            // Determine the image type and extension based on known signatures
            const buffer = Buffer.from(row.image_blob);
            let extension;
            const bufferString = buffer.toString('hex', 0, 4);

            switch (bufferString) {
                case 'ffd8ffe0':
                case 'ffd8ffe1':
                case 'ffd8ffe2':
                    extension = 'jpg';
                    break;
                case '89504e47':
                    extension = 'png';
                    break;
                case '47494638':
                    extension = 'gif';
                    break;
                default:
                    console.error(`Unsupported image type or corrupt data for image ID: ${row.id}`);
                    return null;
            }

            const imageName = `${row.id}_${Date.now()}.${extension}`;
            const destPath = path.join(__dirname, 'public', 'assets', imageName);

            try {
                fs.writeFileSync(destPath, buffer);
                console.log(`Successfully wrote image file for image ID: ${row.id} with name: ${imageName}`);
            } catch (writeError) {
                console.error(`Error writing image file for image ID: ${row.id}`, writeError);
                return null;
            }

            return {
                id: row.id,
                src: `/assets/${imageName}`, 
                map: row.map, 
                caption: row.caption, 
            };
        }).filter(Boolean); 

        const metadataPath = path.join(__dirname, 'public', 'image-metadata.json');
        fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

        console.log('Static assets and metadata generated successfully.');
    } catch (error) {
        console.error('Error generating static assets:', error);
    }
};

generateStaticAssets();
