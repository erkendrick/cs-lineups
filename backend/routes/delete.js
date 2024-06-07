const express = require('express');
const router = express.Router();
const db = require('../db/database');
const { isAuthenticated } = require('./authMiddleware'); 

// DELETE endpoint to delete an image entry by ID
router.delete('/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    console.log(`Delete request received for ID: ${id}`);

    const query = "DELETE FROM images WHERE id = ?";
    db.run(query, [id], function(err) {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Image not found' });
        }
        console.log(`Image with ID: ${id} successfully deleted from database`);
        res.json({ message: 'Image deleted successfully', changes: this.changes });
    });
});

module.exports = router;
