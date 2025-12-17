const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const authMiddleware = require('../middleware/authMiddleware');

// Create enquiry (Public)
router.post('/', async (req, res) => {
    try {
        const newEnquiry = new Enquiry(req.body);
        const enquiry = await newEnquiry.save();
        res.json(enquiry);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all enquiries (Admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update enquiry status (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(enquiry);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete enquiry (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Enquiry.findByIdAndDelete(req.params.id);
        res.json({ message: 'Enquiry deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
