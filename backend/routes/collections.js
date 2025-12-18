const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const authMiddleware = require('../middleware/authMiddleware');

// Default collections to seed if none exist
const defaultCollections = [
    { name: 'Marble Series', displayOrder: 1 },
    { name: 'Marble Bookmatch Series', displayOrder: 2 },
    { name: 'Onyx Series', displayOrder: 3 },
    { name: 'Exotic Colors Series', displayOrder: 4 },
    { name: 'Granite Series', displayOrder: 5 },
    { name: 'Travertine Series', displayOrder: 6 },
    { name: 'Limestone Series', displayOrder: 7 },
    { name: 'Sandstone Series', displayOrder: 8 },
    { name: 'Slate Series', displayOrder: 9 },
    { name: 'Engineered Marble Series', displayOrder: 10 },
    { name: 'Quartz Series', displayOrder: 11 },
    { name: 'Terrazzo Series', displayOrder: 12 }
];

// Get all collections (public)
router.get('/', async (req, res) => {
    try {
        let collections = await Collection.find({ status: 'active' }).sort({ displayOrder: 1 });
        
        // Seed default collections if none exist
        if (collections.length === 0) {
            await Collection.insertMany(defaultCollections);
            collections = await Collection.find({ status: 'active' }).sort({ displayOrder: 1 });
        }
        
        res.json(collections);
    } catch (err) {
        console.error('Error fetching collections:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all collections (admin - includes inactive)
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        let collections = await Collection.find().sort({ displayOrder: 1 });
        
        // Seed default collections if none exist
        if (collections.length === 0) {
            await Collection.insertMany(defaultCollections);
            collections = await Collection.find().sort({ displayOrder: 1 });
        }
        
        res.json(collections);
    } catch (err) {
        console.error('Error fetching collections:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single collection by slug or id
router.get('/:identifier', async (req, res) => {
    try {
        let collection;
        
        // Check if identifier is a valid ObjectId
        if (req.params.identifier.match(/^[0-9a-fA-F]{24}$/)) {
            collection = await Collection.findById(req.params.identifier);
        } else {
            collection = await Collection.findOne({ slug: req.params.identifier });
        }
        
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        
        res.json(collection);
    } catch (err) {
        console.error('Error fetching collection:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create collection
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newCollection = new Collection(req.body);
        const collection = await newCollection.save();
        res.json(collection);
    } catch (err) {
        console.error('Error creating collection:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update collection
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const collection = await Collection.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        res.json(collection);
    } catch (err) {
        console.error('Error updating collection:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete collection
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Collection.findByIdAndDelete(req.params.id);
        res.json({ message: 'Collection deleted' });
    } catch (err) {
        console.error('Error deleting collection:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Bulk update order
router.put('/bulk/order', authMiddleware, async (req, res) => {
    try {
        const { orders } = req.body; // Array of { id, displayOrder }
        
        for (const item of orders) {
            await Collection.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder });
        }
        
        const collections = await Collection.find().sort({ displayOrder: 1 });
        res.json(collections);
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
