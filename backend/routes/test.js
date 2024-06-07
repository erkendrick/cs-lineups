// routes/test.js
const express = require('express');
const router = express.Router();

router.delete('/test/:id', (req, res) => {
    const id = req.params.id;
    console.log(`Test delete request received for ID: ${id}`);
    res.json({ message: `Test delete request received for ID: ${id}` });
});

module.exports = router;
