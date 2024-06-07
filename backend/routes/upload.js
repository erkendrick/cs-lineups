const express = require('express');
const multer = require('multer');
const db = require('../db/database');
const { isAuthenticated } = require('./authMiddleware'); 

const router = express.Router();

// Set up multer for memory storage (buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Endpoint to upload an image
router.post('/upload', isAuthenticated, upload.single('image'), (req, res) => {
    console.log('Request received:', req.body, req.file);
    const { map, caption } = req.body;
    const imageBlob = req.file.buffer;

    const query = "INSERT INTO images (image_blob, map, caption) VALUES (?, ?, ?)";
    db.run(query, [imageBlob, map, caption], function(err) {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).json({ error: 'Failed to add image' });
        }
        const response = {
            id: this.lastID,
            map,
            caption
        };
        console.log('Successfully uploaded image:', response);
        res.status(201).json(response);
    });
});

module.exports = router;
