const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const authMiddleware = require('../middleware/authMiddleware');

// Get page by name
router.get('/:name', async (req, res) => {
    try {
        const page = await Page.findOne({ name: req.params.name });
        if (!page) return res.status(404).json({ message: 'Page not found' });
        res.json(page);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update page (Admin)
router.put('/:name', authMiddleware, async (req, res) => {
    try {
        const page = await Page.findOneAndUpdate(
            { name: req.params.name },
            req.body,
            { new: true, upsert: true } // Create if not exists
        );
        res.json(page);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
