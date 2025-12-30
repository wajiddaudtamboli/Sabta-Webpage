const express = require('express');
const router = express.Router();
const Catalogue = require('../models/Catalogue');
const authMiddleware = require('../middleware/authMiddleware');

// ===================== PUBLIC ROUTES =====================

// Get all active catalogues (Public)
router.get('/', async (req, res) => {
    try {
        const catalogues = await Catalogue.find({ status: 'active' })
            .sort({ displayOrder: 1, createdAt: -1 });
        res.json(catalogues);
    } catch (err) {
        console.error('Error fetching catalogues:', err);
        res.status(500).json({ message: 'Server error fetching catalogues' });
    }
});

// Get single catalogue by ID (Public)
router.get('/view/:id', async (req, res) => {
    try {
        const catalogue = await Catalogue.findOne({ 
            _id: req.params.id, 
            status: 'active' 
        });
        if (!catalogue) {
            return res.status(404).json({ message: 'Catalogue not found' });
        }
        res.json(catalogue);
    } catch (err) {
        console.error('Error fetching catalogue:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ===================== ADMIN ROUTES =====================

// Get all catalogues (Admin - includes inactive)
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        
        if (status && status !== 'all') {
            filter.status = status;
        }
        
        const catalogues = await Catalogue.find(filter)
            .sort({ displayOrder: 1, createdAt: -1 });
        res.json(catalogues);
    } catch (err) {
        console.error('Error fetching admin catalogues:', err);
        res.status(500).json({ message: 'Server error fetching catalogues' });
    }
});

// Get catalogue counts (Admin)
router.get('/counts', authMiddleware, async (req, res) => {
    try {
        const total = await Catalogue.countDocuments();
        const active = await Catalogue.countDocuments({ status: 'active' });
        const inactive = await Catalogue.countDocuments({ status: 'inactive' });
        
        res.json({ total, active, inactive });
    } catch (err) {
        console.error('Error fetching catalogue counts:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single catalogue by ID (Admin)
router.get('/admin/:id', authMiddleware, async (req, res) => {
    try {
        const catalogue = await Catalogue.findById(req.params.id);
        if (!catalogue) {
            return res.status(404).json({ message: 'Catalogue not found' });
        }
        res.json(catalogue);
    } catch (err) {
        console.error('Error fetching catalogue:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new catalogue (Admin)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, fileUrl, fileType, thumbnailUrl, displayOrder, status } = req.body;
        
        // Validate required fields
        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }
        if (!fileUrl || !fileUrl.trim()) {
            return res.status(400).json({ message: 'File URL is required' });
        }
        
        // Check for duplicate title
        const existingCatalogue = await Catalogue.findOne({ 
            title: { $regex: new RegExp(`^${title.trim()}$`, 'i') }
        });
        if (existingCatalogue) {
            return res.status(400).json({ message: 'A catalogue with this title already exists' });
        }
        
        // Create new catalogue
        const newCatalogue = new Catalogue({
            title: title.trim(),
            description: description?.trim() || '',
            fileUrl: fileUrl.trim(),
            fileType: fileType || 'pdf',
            thumbnailUrl: thumbnailUrl?.trim() || '',
            displayOrder: displayOrder || 0,
            status: status || 'active'
        });
        
        const catalogue = await newCatalogue.save();
        res.status(201).json(catalogue);
    } catch (err) {
        console.error('Error creating catalogue:', err);
        res.status(500).json({ message: 'Server error creating catalogue' });
    }
});

// Update catalogue (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, fileUrl, fileType, thumbnailUrl, displayOrder, status } = req.body;
        
        // Check if catalogue exists
        const existingCatalogue = await Catalogue.findById(req.params.id);
        if (!existingCatalogue) {
            return res.status(404).json({ message: 'Catalogue not found' });
        }
        
        // Check for duplicate title (excluding current)
        if (title) {
            const duplicateTitle = await Catalogue.findOne({
                _id: { $ne: req.params.id },
                title: { $regex: new RegExp(`^${title.trim()}$`, 'i') }
            });
            if (duplicateTitle) {
                return res.status(400).json({ message: 'A catalogue with this title already exists' });
            }
        }
        
        // Update fields
        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (description !== undefined) updateData.description = description?.trim() || '';
        if (fileUrl !== undefined) updateData.fileUrl = fileUrl.trim();
        if (fileType !== undefined) updateData.fileType = fileType;
        if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl?.trim() || '';
        if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
        if (status !== undefined) updateData.status = status;
        
        const catalogue = await Catalogue.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        
        res.json(catalogue);
    } catch (err) {
        console.error('Error updating catalogue:', err);
        res.status(500).json({ message: 'Server error updating catalogue' });
    }
});

// Toggle catalogue status (Admin)
router.patch('/:id/toggle-status', authMiddleware, async (req, res) => {
    try {
        const catalogue = await Catalogue.findById(req.params.id);
        if (!catalogue) {
            return res.status(404).json({ message: 'Catalogue not found' });
        }
        
        catalogue.status = catalogue.status === 'active' ? 'inactive' : 'active';
        await catalogue.save();
        
        res.json(catalogue);
    } catch (err) {
        console.error('Error toggling catalogue status:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete catalogue (Admin) - Hard delete
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const catalogue = await Catalogue.findById(req.params.id);
        if (!catalogue) {
            return res.status(404).json({ message: 'Catalogue not found' });
        }
        
        await Catalogue.findByIdAndDelete(req.params.id);
        res.json({ message: 'Catalogue deleted successfully' });
    } catch (err) {
        console.error('Error deleting catalogue:', err);
        res.status(500).json({ message: 'Server error deleting catalogue' });
    }
});

// Soft delete catalogue (Admin) - Set status to inactive
router.patch('/:id/soft-delete', authMiddleware, async (req, res) => {
    try {
        const catalogue = await Catalogue.findByIdAndUpdate(
            req.params.id,
            { status: 'inactive' },
            { new: true }
        );
        
        if (!catalogue) {
            return res.status(404).json({ message: 'Catalogue not found' });
        }
        
        res.json({ message: 'Catalogue deactivated successfully', catalogue });
    } catch (err) {
        console.error('Error soft-deleting catalogue:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Seed default catalogues (Admin) - For initial setup
router.post('/seed', authMiddleware, async (req, res) => {
    try {
        const existingCount = await Catalogue.countDocuments();
        if (existingCount > 0) {
            return res.json({ message: 'Catalogues already exist', count: existingCount });
        }
        
        const defaultCatalogues = [
            {
                title: 'Engineered Stone',
                description: 'Premium engineered stone collection catalogue',
                fileUrl: '/catalogues/Engineered_Stone.pdf',
                fileType: 'pdf',
                thumbnailUrl: '/catalogues/New_Engineered_Marble.jpeg',
                displayOrder: 1,
                status: 'active'
            },
            {
                title: 'Natural Stone',
                description: 'Natural stone collection catalogue',
                fileUrl: '/catalogues/Engineered_Stone.pdf',
                fileType: 'pdf',
                thumbnailUrl: '/catalogues/New_Natural_Stone.jpeg',
                displayOrder: 2,
                status: 'active'
            }
        ];
        
        const catalogues = await Catalogue.insertMany(defaultCatalogues);
        res.status(201).json({ message: 'Default catalogues seeded', catalogues });
    } catch (err) {
        console.error('Error seeding catalogues:', err);
        res.status(500).json({ message: 'Server error seeding catalogues' });
    }
});

module.exports = router;
