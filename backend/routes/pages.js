const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const authMiddleware = require('../middleware/authMiddleware');

// Get page by name (public)
router.get('/:name', async (req, res) => {
    try {
        let page = await Page.findOne({ name: req.params.name });
        
        // If page doesn't exist, create default structure
        if (!page) {
            const defaults = {
                home: {
                    heroSlides: [
                        { heading: "Where Nature's Beauty Meets Expert Craftsmanship", subtext: "Premium stone solutions", image: "", button: "Get Started" },
                        { heading: "Premium Marble and Stone Designed to Elevate Your Interiors", subtext: "Solutions tailored for your brand", image: "", button: "View Services" },
                        { heading: "Classic Design and Enduring Strength for Modern Spaces", subtext: "Delivering quality, speed & results", image: "", button: "Contact Us" }
                    ],
                    introTitle: "Why Sabta Granite Is the UAE's Trusted Choice for Premium Marble and Natural Stone",
                    introText: "Marble brings a sense of luxury, elegance and lasting beauty to any space."
                },
                about: {
                    title: "About Us",
                    whoWeAre: "Founded in 2003, SABTA is one of the UAE's most trusted suppliers of natural stone."
                },
                contact: {
                    title: "Contact Us",
                    address: "Dubai, UAE",
                    phone: "+971 XXXXXXXXX",
                    email: "info@sabtagranite.com"
                }
            };
            
            // Return default content without creating in DB
            return res.json({ 
                name: req.params.name, 
                content: defaults[req.params.name] || {} 
            });
        }
        
        res.json(page);
    } catch (err) {
        console.error('Error fetching page:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update page (Admin)
router.put('/:name', authMiddleware, async (req, res) => {
    try {
        const page = await Page.findOneAndUpdate(
            { name: req.params.name },
            { 
                ...req.body, 
                name: req.params.name,
                updatedAt: Date.now() 
            },
            { new: true, upsert: true }
        );
        res.json(page);
    } catch (err) {
        console.error('Error updating page:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all pages (Admin)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const pages = await Page.find({});
        res.json(pages);
    } catch (err) {
        console.error('Error fetching pages:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
