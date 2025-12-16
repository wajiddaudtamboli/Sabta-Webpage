const express = require('express');
const router = express.Router();
const Media = require('../../database/Media');
const authMiddleware = require('../middleware/authMiddleware');

// Get all media
router.get('/', authMiddleware, async (req, res) => {
    try {
        const media = await Media.find().sort({ createdAt: -1 });
        res.json(media);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add media (URL)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newMedia = new Media(req.body);
        const media = await newMedia.save();
        res.json(media);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete media
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Media.findByIdAndDelete(req.params.id);
        res.json({ message: 'Media deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
