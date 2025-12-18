const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// Get all products with optional filters (public)
router.get('/', async (req, res) => {
    try {
        const { category, color, finish, collection } = req.query;
        let query = { status: 'active' };
        
        if (category) {
            // Match category case-insensitively
            query.category = { $regex: new RegExp(category.replace(/-/g, ' '), 'i') };
        }
        if (collection) {
            query.$or = [
                { collectionName: { $regex: new RegExp(collection, 'i') } },
                { category: { $regex: new RegExp(collection, 'i') } }
            ];
        }
        if (color) {
            query.color = { $regex: new RegExp(color, 'i') };
        }
        if (finish) {
            query.finish = { $regex: new RegExp(finish, 'i') };
        }
        
        const products = await Product.find(query).sort({ displayOrder: 1, colorSequence: 1, createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all products (Admin - includes all statuses)
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const products = await Product.find().sort({ displayOrder: 1, colorSequence: 1, createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get products by category (public)
router.get('/category/:category', async (req, res) => {
    try {
        const category = req.params.category.replace(/-/g, ' ');
        const products = await Product.find({ 
            category: { $regex: new RegExp(category, 'i') },
            status: 'active'
        }).sort({ displayOrder: 1 });
        res.json(products);
    } catch (err) {
        console.error('Error fetching products by category:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get new arrivals
router.get('/new-arrivals', async (req, res) => {
    try {
        const products = await Product.find({ 
            isNewArrival: true,
            status: 'active'
        }).sort({ createdAt: -1 }).limit(20);
        res.json(products);
    } catch (err) {
        console.error('Error fetching new arrivals:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single product by ID or slug
router.get('/:identifier', async (req, res) => {
    try {
        let product;
        
        // Check if identifier is a valid ObjectId
        if (req.params.identifier.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(req.params.identifier);
        } else {
            product = await Product.findOne({ slug: req.params.identifier });
        }
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create product
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error('Error creating product:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update product
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add image to product
router.post('/:id/images', authMiddleware, async (req, res) => {
    try {
        const { url, description, isNewArrival } = req.body;
        
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Add to productImages array
        if (!product.productImages) {
            product.productImages = [];
        }
        
        product.productImages.push({
            url,
            description: description || '',
            isNewArrival: isNewArrival || false,
            displayOrder: product.productImages.length
        });
        
        // Also add to legacy images array for backward compatibility
        if (!product.images) {
            product.images = [];
        }
        if (!product.images.includes(url)) {
            product.images.push(url);
        }
        
        await product.save();
        res.json(product);
    } catch (err) {
        console.error('Error adding image:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update product image
router.put('/:id/images/:imageId', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        const image = product.productImages.id(req.params.imageId);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        
        Object.assign(image, req.body);
        await product.save();
        res.json(product);
    } catch (err) {
        console.error('Error updating image:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product image
router.delete('/:id/images/:imageId', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        const image = product.productImages.id(req.params.imageId);
        if (image) {
            // Remove from legacy images array too
            const urlIndex = product.images.indexOf(image.url);
            if (urlIndex > -1) {
                product.images.splice(urlIndex, 1);
            }
            
            image.deleteOne();
            await product.save();
        }
        
        res.json(product);
    } catch (err) {
        console.error('Error deleting image:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Bulk update display order
router.put('/bulk/order', authMiddleware, async (req, res) => {
    try {
        const { orders } = req.body; // Array of { id, displayOrder, colorSequence }
        
        for (const item of orders) {
            await Product.findByIdAndUpdate(item.id, { 
                displayOrder: item.displayOrder,
                colorSequence: item.colorSequence 
            });
        }
        
        const products = await Product.find().sort({ displayOrder: 1 });
        res.json(products);
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
