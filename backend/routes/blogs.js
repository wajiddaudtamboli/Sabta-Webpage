const express = require('express');
const router = express.Router();
const Blog = require('../../database/Blog');
const authMiddleware = require('../middleware/authMiddleware');

// Get all published blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'published' }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all blogs (Admin)
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single blog by slug
router.get('/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create blog
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        const blog = await newBlog.save();
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update blog
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete blog
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
