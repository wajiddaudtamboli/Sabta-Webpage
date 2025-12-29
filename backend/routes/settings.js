const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const Newsletter = require('../models/Newsletter');
const authMiddleware = require('../middleware/authMiddleware');




router.get('/settings/:key', async (req, res) => {
    try {
        const publicKeys = ['logo', 'footer', 'social', 'contact'];
        const setting = await Settings.findOne({ key: req.params.key });
        
        if (!setting) {
            
            const defaults = {
                logo: { url: '/Sabta_Logo.png' },
                footer: {
                    description: 'Drawing inspiration from timeless design to offer large-format slabs that transform interiors and exteriors alike.',
                    qrCode: '/LocationQR.jpeg'
                },
                social: {
                    facebook: 'https://www.facebook.com/SGMT2003',
                    instagram: 'https://www.instagram.com/sabta_granite/',
                    twitter: 'https://x.com/sgmt2003',
                    pinterest: 'https://www.pinterest.com/sabta_granite/',
                    linkedin: 'https://www.linkedin.com/in/sabta-granite-and-marbles-trading-10b325251/'
                },
                contact: {
                    address: 'P.O. Box : 34390 Industrial Area # 11 Sharjah - UAE',
                    phone1: '+971 50 205 0707',
                    phone2: '+971 6 535 4704',
                    email: 'sale@sabtagranite.com',
                    mapUrl: 'https://maps.app.goo.gl/kskRgHSwUrQmXKtX9'
                }
            };
            return res.json({ key: req.params.key, value: defaults[req.params.key] || {} });
        }
        
        res.json(setting);
    } catch (err) {
        console.error('Error fetching setting:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/settings', authMiddleware, async (req, res) => {
    try {
        const settings = await Settings.find();
        res.json(settings);
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.put('/settings/:key', authMiddleware, async (req, res) => {
    try {
        const setting = await Settings.findOneAndUpdate(
            { key: req.params.key },
            { key: req.params.key, value: req.body.value, updatedAt: Date.now() },
            { new: true, upsert: true }
        );
        res.json(setting);
    } catch (err) {
        console.error('Error updating setting:', err);
        res.status(500).json({ message: 'Server error' });
    }
});




router.post('/newsletter/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        
        
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            if (existing.status === 'unsubscribed') {
                existing.status = 'active';
                await existing.save();
                return res.json({ message: 'Successfully re-subscribed!' });
            }
            return res.status(400).json({ message: 'Email already subscribed' });
        }
        
        const newSubscriber = new Newsletter({ email });
        await newSubscriber.save();
        res.json({ message: 'Successfully subscribed!' });
    } catch (err) {
        console.error('Error subscribing:', err);
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/newsletter', authMiddleware, async (req, res) => {
    try {
        const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
        res.json(subscribers);
    } catch (err) {
        console.error('Error fetching subscribers:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.post('/newsletter/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;
        
        const subscriber = await Newsletter.findOneAndUpdate(
            { email },
            { status: 'unsubscribed' },
            { new: true }
        );
        
        if (!subscriber) {
            return res.status(404).json({ message: 'Email not found' });
        }
        
        res.json({ message: 'Successfully unsubscribed' });
    } catch (err) {
        console.error('Error unsubscribing:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/newsletter/:id', authMiddleware, async (req, res) => {
    try {
        await Newsletter.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subscriber deleted' });
    } catch (err) {
        console.error('Error deleting subscriber:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
