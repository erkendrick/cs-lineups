const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Get all images or filter by map
router.get('/filter', (req, res, next) => {
    const { map } = req.query;
    let query = "SELECT id, map, caption FROM images";
    const params = [];

    if (map) {
        query += " WHERE map = ?";
        params.push(map);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch images' });
        }
        res.json(rows);
    });
});

// Get an image by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT image_blob FROM images WHERE id = ?";
    
    db.get(query, [id], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.setHeader('Content-Type', 'image/jpeg');
        res.send(row.image_blob);
    });
});

module.exports = router;