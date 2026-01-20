const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const authMiddleware = require('../middleware/authMiddleware');
const cloudinary = require('cloudinary').v2;

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = () => {
    return process.env.CLOUDINARY_CLOUD_NAME && 
           process.env.CLOUDINARY_API_KEY && 
           process.env.CLOUDINARY_API_SECRET;
};

// Helper function to upload base64 image to Cloudinary
const uploadBase64ToCloudinary = async (base64String, folder = 'products') => {
    try {
        if (!base64String) return null;
        
        // If it's already a URL (not base64), return as-is
        if (base64String.startsWith('http://') || base64String.startsWith('https://')) {
            return base64String;
        }
        
        // If it's not a valid base64 data URL, return it as-is
        if (!base64String.startsWith('data:image/')) {
            return base64String;
        }
        
        // If Cloudinary is not configured, return base64 as-is (will be stored in DB)
        if (!isCloudinaryConfigured()) {
            console.log('Cloudinary not configured, storing base64 image directly');
            return base64String;
        }
        
        const result = await cloudinary.uploader.upload(base64String, {
            folder: `sabta-granite/${folder}`,
            resource_type: 'image',
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        });
        
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error.message);
        // Return base64 as fallback if upload fails
        return base64String;
    }
};

// Helper function to process images array (upload base64 to Cloudinary)
const processImagesArray = async (images) => {
    if (!images || !Array.isArray(images)) return [];
    
    const processedImages = await Promise.all(
        images.map(async (img, index) => {
            let url = '';
            let description = `Image ${index + 1}`;
            let isNewArrival = false;
            
            if (typeof img === 'string') {
                url = await uploadBase64ToCloudinary(img) || img;
            } else if (typeof img === 'object' && img.url) {
                url = await uploadBase64ToCloudinary(img.url) || img.url;
                description = img.description || description;
                isNewArrival = img.isNewArrival || false;
            }
            
            if (!url) return null;
            
            return {
                url,
                description,
                isNewArrival,
                displayOrder: index
            };
        })
    );
    
    return processedImages.filter(img => img !== null);
};

// Helper function to generate unique product code
const generateProductCode = async () => {
    const lastProduct = await Product.findOne().sort({ code: -1 });
    if (lastProduct && lastProduct.code) {
        const numPart = parseInt(lastProduct.code.replace('SG', ''), 10);
        return `SG${String(numPart + 1).padStart(5, '0')}`;
    }
    return 'SG00001';
};

// Get all products with optional filters (public)
router.get('/', async (req, res) => {
    try {
        const { category, color, finish, collection, collectionId } = req.query;
        let query = { status: 'active' };
        let collectionFilter = null;
        
        // Build collection/category filter
        if (collectionId) {
            // Convert category slug to search term (e.g., 'marble-series' -> 'marble')
            const searchTerm = category ? category.replace(/-/g, ' ').replace(/\s*series\s*/i, '').trim() : '';
            collectionFilter = {
                $or: [
                    { collectionId: collectionId },
                    { collectionName: { $regex: new RegExp(searchTerm || category || '', 'i') } },
                    { category: { $regex: new RegExp(searchTerm || category || '', 'i') } }
                ]
            };
        } else if (category) {
            // Convert category slug to search term (e.g., 'marble-series' -> 'marble')
            const searchTerm = category.replace(/-/g, ' ').replace(/\s*series\s*/i, '').trim();
            collectionFilter = {
                $or: [
                    { category: { $regex: new RegExp(searchTerm, 'i') } },
                    { collectionName: { $regex: new RegExp(searchTerm, 'i') } }
                ]
            };
        } else if (collection) {
            collectionFilter = {
                $or: [
                    { collectionName: { $regex: new RegExp(collection, 'i') } },
                    { category: { $regex: new RegExp(collection, 'i') } }
                ]
            };
        }
        
        // Combine filters using $and if we have collection filter
        if (collectionFilter) {
            query.$and = [collectionFilter];
        }
        
        // Add color and finish filters
        if (color) {
            if (!query.$and) query.$and = [];
            query.$and.push({ color: { $regex: new RegExp(color, 'i') } });
        }
        if (finish) {
            if (!query.$and) query.$and = [];
            query.$and.push({ finish: { $regex: new RegExp(finish, 'i') } });
        }
        
        console.log('Products query:', JSON.stringify(query, null, 2));
        const products = await Product.find(query).sort({ displayOrder: 1, colorSequence: 1, createdAt: -1 });
        console.log('Found products:', products.length);
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all products (Admin - includes all statuses)
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const { collectionId, collectionName, showAll } = req.query;
        let query = {};
        
        // Only apply filters if NOT showing all
        if (showAll !== 'true' && (collectionId || collectionName)) {
            if (collectionId) {
                // Match by collectionId OR category that contains similar name
                query.$or = [
                    { collectionId: collectionId },
                    { category: { $regex: new RegExp(collectionName?.replace(' Series', '').replace(' Collections', ''), 'i') } }
                ];
            } else if (collectionName) {
                // Match by collectionName OR category
                const searchTerm = collectionName.replace(' Series', '').replace(' Collections', '');
                query.$or = [
                    { collectionName: { $regex: new RegExp(collectionName, 'i') } },
                    { category: { $regex: new RegExp(searchTerm, 'i') } }
                ];
            }
        }
        // If showAll=true or no filters, return ALL products
        
        console.log('Admin products query:', JSON.stringify(query));
        const products = await Product.find(query).sort({ displayOrder: 1, colorSequence: 1, createdAt: -1 });
        console.log('Found products:', products.length);
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get product count (Admin)
router.get('/admin/count', authMiddleware, async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.json({ count });
    } catch (err) {
        console.error('Error counting products:', err);
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
        console.log('Creating product...');
        
        const productData = { ...req.body };
        
        // Auto-generate code if not provided
        if (!productData.code) {
            productData.code = await generateProductCode();
        }
        
        // Ensure name is provided
        if (!productData.name || productData.name.trim() === '') {
            return res.status(400).json({ message: 'Product name is required' });
        }
        
        // Handle primary image upload to Cloudinary
        if (productData.primaryImage) {
            productData.primaryImage = await uploadBase64ToCloudinary(productData.primaryImage, 'products/primary') || productData.primaryImage;
        }
        
        // Handle images array - upload to Cloudinary
        if (productData.images && Array.isArray(productData.images)) {
            const processedImages = await processImagesArray(productData.images);
            productData.productImages = processedImages;
            productData.images = processedImages.map(img => img.url);
        } else {
            productData.images = [];
            productData.productImages = [];
        }
        
        // Set defaults
        productData.status = productData.status || 'active';
        productData.isNatural = productData.isNatural !== false;
        
        // Handle collection reference
        if (productData.collectionId) {
            try {
                const collection = await Collection.findById(productData.collectionId);
                if (collection) {
                    productData.collectionName = collection.name;
                    productData.category = collection.name.replace(' Series', '').replace(' Collections', '');
                }
            } catch (e) {
                console.log('Collection lookup error:', e.message);
            }
        }
        
        const newProduct = new Product(productData);
        const product = await newProduct.save();
        
        console.log('Product created successfully:', product._id);
        res.status(201).json(product);
    } catch (err) {
        console.error('Error creating product:', err);
        
        // Handle validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join(', '), errors: err.errors });
        }
        
        // Handle duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({ message: 'A product with this code or name already exists' });
        }
        
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// Update product
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        console.log('Updating product:', req.params.id);
        console.log('Update data:', JSON.stringify(req.body, null, 2));
        
        const updateData = { ...req.body, updatedAt: Date.now() };
        
        // Handle primary image upload to Cloudinary
        if (updateData.primaryImage) {
            updateData.primaryImage = await uploadBase64ToCloudinary(updateData.primaryImage, 'products/primary') || updateData.primaryImage;
        }
        
        // Handle images array - upload to Cloudinary
        if (updateData.images && Array.isArray(updateData.images)) {
            const processedImages = await processImagesArray(updateData.images);
            updateData.productImages = processedImages;
            updateData.images = processedImages.map(img => img.url);
        }
        
        // Handle collection reference
        if (updateData.collectionId) {
            try {
                const collection = await Collection.findById(updateData.collectionId);
                if (collection) {
                    updateData.collectionName = collection.name;
                    updateData.category = collection.name.replace(' Series', '').replace(' Collections', '');
                }
            } catch (e) {
                console.log('Collection lookup error:', e.message);
            }
        }
        
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        console.log('Product updated successfully:', product._id);
        res.json(product);
    } catch (err) {
        console.error('Error updating product:', err);
        
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join(', '), errors: err.errors });
        }
        
        res.status(500).json({ message: 'Server error: ' + err.message });
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

// Delete product (SOFT DELETE - marks as inactive)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { hardDelete } = req.query;
        
        if (hardDelete === 'true') {
            // Hard delete - permanently remove
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ message: 'Product permanently deleted' });
        } else {
            // Soft delete - mark as inactive
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                { status: 'inactive', updatedAt: Date.now() },
                { new: true }
            );
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ message: 'Product deactivated successfully', product });
        }
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
