const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const authMiddleware = require('../middleware/authMiddleware');
const axios = require('axios');
const Papa = require('papaparse');
const XLSX = require('xlsx');

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
        console.log('Creating product with data:', JSON.stringify(req.body, null, 2));
        
        const productData = { ...req.body };
        
        // Auto-generate code if not provided
        if (!productData.code) {
            productData.code = await generateProductCode();
        }
        
        // Ensure name is provided
        if (!productData.name || productData.name.trim() === '') {
            return res.status(400).json({ message: 'Product name is required' });
        }
        
        // Handle images - ensure it's an array
        if (productData.images) {
            if (typeof productData.images === 'string') {
                productData.images = [productData.images];
            } else if (!Array.isArray(productData.images)) {
                productData.images = [];
            }
        } else {
            productData.images = [];
        }
        
        // Handle productImages array for detailed image tracking
        if (productData.images.length > 0 && (!productData.productImages || productData.productImages.length === 0)) {
            productData.productImages = productData.images.map((url, index) => ({
                url,
                description: `Image ${index + 1}`,
                isNewArrival: productData.isNewArrival || false,
                displayOrder: index
            }));
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
        
        // Handle images array
        if (updateData.images) {
            if (typeof updateData.images === 'string') {
                updateData.images = [updateData.images];
            } else if (!Array.isArray(updateData.images)) {
                updateData.images = [];
            }
        }
        
        // Sync productImages if images changed
        if (updateData.images && updateData.images.length > 0) {
            const existingProduct = await Product.findById(req.params.id);
            const existingUrls = (existingProduct?.productImages || []).map(pi => pi.url);
            
            // Add new images to productImages
            updateData.images.forEach((url, index) => {
                if (!existingUrls.includes(url)) {
                    if (!updateData.productImages) {
                        updateData.productImages = existingProduct?.productImages || [];
                    }
                    updateData.productImages.push({
                        url,
                        description: `Image ${index + 1}`,
                        isNewArrival: updateData.isNewArrival || false,
                        displayOrder: updateData.productImages.length
                    });
                }
            });
        }
        
        // Handle collection reference
        if (updateData.collectionId) {
            try {
                const collection = await Collection.findById(updateData.collectionId);
                if (collection) {
                    updateData.collectionName = collection.name;
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

// Import products from CSV/Excel URL
router.post('/import-from-url', authMiddleware, async (req, res) => {
    try {
        const { fileUrl, collectionId, collectionName } = req.body;
        
        if (!fileUrl) {
            return res.status(400).json({ message: 'File URL is required' });
        }
        
        console.log('Importing from URL:', fileUrl);
        console.log('Collection:', collectionId, collectionName);
        
        // Fetch the file from URL
        const response = await axios.get(fileUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });
        
        let rows = [];
        const fileExtension = fileUrl.split('.').pop().toLowerCase().split('?')[0];
        
        if (fileExtension === 'csv') {
            // Parse CSV
            const csvText = Buffer.from(response.data).toString('utf-8');
            const parsed = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (header) => header.trim().toLowerCase()
            });
            rows = parsed.data;
        } else if (['xlsx', 'xls'].includes(fileExtension)) {
            // Parse Excel
            const workbook = XLSX.read(response.data, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            rows = XLSX.utils.sheet_to_json(worksheet, { 
                defval: '',
                raw: false 
            });
            // Normalize headers to lowercase
            rows = rows.map(row => {
                const normalized = {};
                Object.keys(row).forEach(key => {
                    normalized[key.toLowerCase().trim()] = row[key];
                });
                return normalized;
            });
        } else {
            return res.status(400).json({ message: 'Unsupported file format. Use CSV or XLSX.' });
        }
        
        console.log('Parsed rows:', rows.length);
        
        // Map column names to product fields
        const columnMapping = {
            'code': ['code', 'product code', 'sku', 'productcode'],
            'name': ['name', 'product name', 'title', 'productname'],
            'color': ['color', 'colour'],
            'origin': ['origin', 'country', 'source'],
            'isBookmatch': ['is bookmatch', 'bookmatch', 'isbookmatch', 'is_bookmatch'],
            'isTranslucent': ['is translucent', 'translucent', 'istranslucent', 'is_translucent'],
            'isNatural': ['is natural', 'natural', 'isnatural', 'is_natural'],
            'description': ['description', 'desc'],
            'grade': ['grade'],
        };
        
        const getFieldValue = (row, field) => {
            const possibleKeys = columnMapping[field] || [field.toLowerCase()];
            for (const key of possibleKeys) {
                if (row[key] !== undefined && row[key] !== '') {
                    return row[key];
                }
            }
            return '';
        };
        
        const parseBoolean = (value) => {
            if (!value) return false;
            const str = String(value).toLowerCase().trim();
            return ['yes', 'true', '1', 'y'].includes(str);
        };
        
        // Process and insert products
        let successCount = 0;
        let errorCount = 0;
        let skippedCount = 0;
        const errors = [];
        
        for (const row of rows) {
            try {
                const name = getFieldValue(row, 'name');
                if (!name || name.trim() === '') {
                    skippedCount++;
                    continue;
                }
                
                let code = getFieldValue(row, 'code');
                
                // Check for duplicate code
                if (code) {
                    const existingProduct = await Product.findOne({ code: code });
                    if (existingProduct) {
                        errors.push(`Duplicate code: ${code} (${name})`);
                        errorCount++;
                        continue;
                    }
                } else {
                    // Auto-generate code
                    code = await generateProductCode();
                }
                
                const productData = {
                    code,
                    name: name.trim(),
                    color: getFieldValue(row, 'color'),
                    origin: getFieldValue(row, 'origin'),
                    isBookmatch: parseBoolean(getFieldValue(row, 'isBookmatch')),
                    isTranslucent: parseBoolean(getFieldValue(row, 'isTranslucent')),
                    isNatural: getFieldValue(row, 'isNatural') === '' ? true : parseBoolean(getFieldValue(row, 'isNatural')),
                    description: getFieldValue(row, 'description'),
                    grade: getFieldValue(row, 'grade'),
                    collectionId: collectionId || null,
                    collectionName: collectionName || 'Natural Stone Collections by SABTA GRANITE',
                    category: collectionName || 'General',
                    status: 'active',
                    images: [],
                    productImages: []
                };
                
                const newProduct = new Product(productData);
                await newProduct.save();
                successCount++;
            } catch (err) {
                console.error('Error importing row:', err.message);
                errors.push(err.message);
                errorCount++;
            }
        }
        
        res.json({
            message: 'Import completed',
            success: successCount,
            failed: errorCount,
            skipped: skippedCount,
            total: rows.length,
            errors: errors.slice(0, 10) // Return first 10 errors
        });
        
    } catch (err) {
        console.error('Error importing from URL:', err);
        
        if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
            return res.status(400).json({ message: 'Could not fetch file from URL. Please check the URL.' });
        }
        if (err.response && err.response.status === 404) {
            return res.status(400).json({ message: 'File not found at the provided URL.' });
        }
        
        res.status(500).json({ message: 'Error importing file: ' + err.message });
    }
});

// Get import preview from URL (validates file before import)
router.post('/import-preview', authMiddleware, async (req, res) => {
    try {
        const { fileUrl } = req.body;
        
        if (!fileUrl) {
            return res.status(400).json({ message: 'File URL is required' });
        }
        
        // Fetch the file from URL
        const response = await axios.get(fileUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });
        
        let rows = [];
        const fileExtension = fileUrl.split('.').pop().toLowerCase().split('?')[0];
        
        if (fileExtension === 'csv') {
            const csvText = Buffer.from(response.data).toString('utf-8');
            const parsed = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
                transformHeader: (header) => header.trim().toLowerCase()
            });
            rows = parsed.data;
        } else if (['xlsx', 'xls'].includes(fileExtension)) {
            const workbook = XLSX.read(response.data, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            rows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false });
            rows = rows.map(row => {
                const normalized = {};
                Object.keys(row).forEach(key => {
                    normalized[key.toLowerCase().trim()] = row[key];
                });
                return normalized;
            });
        } else {
            return res.status(400).json({ message: 'Unsupported file format. Use CSV or XLSX.' });
        }
        
        // Return preview of first 20 rows
        const preview = rows.slice(0, 20).map((row, index) => ({
            rowNum: index + 1,
            code: row.code || row['product code'] || row.sku || '',
            name: row.name || row['product name'] || row.title || '',
            color: row.color || row.colour || '',
            origin: row.origin || row.country || '',
            isBookmatch: row['is bookmatch'] || row.bookmatch || row.isbookmatch || 'No',
            isTranslucent: row['is translucent'] || row.translucent || row.istranslucent || 'No',
            isNatural: row['is natural'] || row.natural || row.isnatural || 'Yes',
        }));
        
        res.json({
            totalRows: rows.length,
            headers: rows.length > 0 ? Object.keys(rows[0]) : [],
            preview
        });
        
    } catch (err) {
        console.error('Error previewing import:', err);
        
        if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
            return res.status(400).json({ message: 'Could not fetch file from URL. Please check the URL.' });
        }
        if (err.response && err.response.status === 404) {
            return res.status(400).json({ message: 'File not found at the provided URL.' });
        }
        
        res.status(500).json({ message: 'Error reading file: ' + err.message });
    }
});

module.exports = router;
