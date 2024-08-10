const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const hashword = process.env.HASHED_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (username === 'admin') {
    try {
      const match = await bcrypt.compare(password, hashword);

      if (match) {
        const token = jwt.sign({ username }, jwtSecret, { expiresIn: '30m' });
        return res.json({ token });
      } else {
        return res.status(401).json({ message: 'Unauthorized: Incorrect Password' });
      }
    } catch (error) {
      console.error('Error during password comparison:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(401).json({ message: 'Unauthorized: Incorrect Username' });
  }
});

// Get entries for AdminDashboard
app.get('/api/entries', authenticateToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT id, caption, map FROM images');
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ message: 'Internal Server Error at entries endpoint'});
  }
});

// POST Image Route
app.post('/api/entries', authenticateToken, upload.single('image'), async (req, res) => {
  const { caption, map } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).json({ message: 'Image file is required' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO images (caption, map, data) VALUES (?, ?, ?)',
      [caption, map, fs.readFileSync(image.path)]
    );
    await connection.end();

    fs.unlinkSync(image.path);

    res.json({ message: 'Entry added successfully' });
  } catch (error) {
    console.error('Error adding entry:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE Route
app.delete('/api/entries/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('DELETE FROM images WHERE id = ?', [id]);
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ message: 'Internal Server Error in deleting entry'});
  }
});

// Get map options
app.get('/api/maps', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT DISTINCT map FROM images');
    await connection.end();
    res.json(rows.map(row => ({ map: row.map })));
  } catch (error) {
    console.error('Error fetching maps:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get images from map selection
app.get('/api/images/:map', async (req, res) => {
  const map = req.params.map;
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT id, caption, data FROM images WHERE map = ?', [map]);
    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No images found for this map.' });
    }

    const images = rows.map(row => ({
      id: row.id,
      caption: row.caption,
      data: row.data.toString('base64')
    }));
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
