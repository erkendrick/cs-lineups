const express = require('express');
const router = express.Router();
const db = require('../db/database');

router.get('/maps', (req, res, next) => {
  const sql = "SELECT DISTINCT map FROM images ORDER BY map";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch maps' });
    }
    res.json(rows.map(row => row.map));
  });
});

module.exports = router;
