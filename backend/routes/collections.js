const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const Product = require('../models/Product');
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

// Helper function to get product counts for collections
const getCollectionsWithProductCounts = async (collections) => {
    const collectionsWithCounts = await Promise.all(
        collections.map(async (collection) => {
            // Extract search term from collection name (remove "Series", "Collections", etc.)
            const searchTerm = collection.name
                .replace(' Series', '')
                .replace(' Collections', '')
                .replace(' Collection', '');
            
            const productCount = await Product.countDocuments({
                $or: [
                    { collectionId: collection._id },
                    { collectionName: { $regex: new RegExp(collection.name, 'i') } },
                    { category: { $regex: new RegExp(searchTerm, 'i') } }
                ]
            });
            return {
                ...collection.toObject(),
                productCount
            };
        })
    );
    return collectionsWithCounts;
};

// Get all collections (public)
router.get('/', async (req, res) => {
    try {
        let collections = await Collection.find({ status: 'active' }).sort({ displayOrder: 1 });
        
        // Seed default collections if none exist
        if (collections.length === 0) {
            await Collection.insertMany(defaultCollections);
            collections = await Collection.find({ status: 'active' }).sort({ displayOrder: 1 });
        }
        
        // Add product counts
        const collectionsWithCounts = await getCollectionsWithProductCounts(collections);
        res.json(collectionsWithCounts);
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
        
        // Add product counts
        const collectionsWithCounts = await getCollectionsWithProductCounts(collections);
        res.json(collectionsWithCounts);
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
            // Try to find by slug first
            collection = await Collection.findOne({ slug: req.params.identifier });
            
            // If not found by slug, try to match by name (convert slug to name format)
            if (!collection) {
                const nameFromSlug = req.params.identifier
                    .split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                // Try to find collection where name starts with the search term (exact match at beginning)
                // This ensures "Marble Series" matches before "Engineered Marble Series"
                collection = await Collection.findOne({
                    name: { $regex: new RegExp(`^${nameFromSlug}`, 'i') }
                });
                
                // If still not found, try partial match
                if (!collection) {
                    collection = await Collection.findOne({
                        name: { $regex: new RegExp(nameFromSlug, 'i') }
                    });
                }
                
                // If found, update the collection with the slug for future lookups
                if (collection && !collection.slug) {
                    collection.slug = req.params.identifier;
                    await collection.save();
                }
            }
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
        console.log('Creating collection:', req.body.name);
        
        // Validate name
        if (!req.body.name || req.body.name.trim() === '') {
            return res.status(400).json({ message: 'Collection name is required' });
        }
        
        const newCollection = new Collection(req.body);
        const collection = await newCollection.save();
        
        console.log('Collection created:', collection._id, 'Slug:', collection.slug);
        res.status(201).json(collection);
    } catch (err) {
        console.error('Error creating collection:', err);
        
        // Handle duplicate name
        if (err.code === 11000) {
            return res.status(400).json({ message: 'A collection with this name already exists' });
        }
        
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update collection
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        console.log('Updating collection:', req.params.id);
        
        const collection = await Collection.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        
        console.log('Collection updated:', collection._id, 'Slug:', collection.slug);
        res.json(collection);
    } catch (err) {
        console.error('Error updating collection:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete collection (SOFT DELETE or restrict if products exist)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { hardDelete } = req.query;
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ message: 'Collection not found' });
        }
        
        // Check if any products belong to this collection
        const searchTerm = collection.name
            .replace(' Series', '')
            .replace(' Collections', '')
            .replace(' Collection', '');
        
        const productCount = await Product.countDocuments({
            $or: [
                { collectionId: collection._id },
                { collectionName: { $regex: new RegExp(collection.name, 'i') } },
                { category: { $regex: new RegExp(searchTerm, 'i') } }
            ]
        });
        
        if (productCount > 0 && hardDelete !== 'true') {
            // Soft delete - deactivate instead of delete
            collection.status = 'inactive';
            await collection.save();
            return res.json({ 
                message: `Collection "${collection.name}" deactivated (has ${productCount} products)`,
                softDeleted: true 
            });
        }
        
        if (hardDelete === 'true') {
            await Collection.findByIdAndDelete(req.params.id);
            res.json({ message: 'Collection permanently deleted' });
        } else {
            // Soft delete by setting status to inactive
            collection.status = 'inactive';
            await collection.save();
            res.json({ message: 'Collection deactivated successfully' });
        }
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
