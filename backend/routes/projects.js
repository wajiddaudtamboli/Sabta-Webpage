const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');

// Public route - only active projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin route - all projects (requires authentication)
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find().sort({ displayOrder: 1, createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
