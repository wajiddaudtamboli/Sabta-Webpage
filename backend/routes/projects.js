const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});


const uploadToCloudinary = async (fileBuffer, folder = 'sabta/projects') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(fileBuffer);
    });
};


// Public route - only active projects
router.get('/', async (req, res) => {
    try {
        const { status, category } = req.query;
        let query = { isActive: true }; // Only show active projects publicly
        
        if (status && ['ongoing', 'completed', 'awarded'].includes(status)) {
            query.projectStatus = status;
        }
        
        if (category && ['Residential', 'Commercial', 'Hospitality', 'Healthcare', 'Educational', 'Government', 'Retail', 'Other'].includes(category)) {
            query.category = category;
        }
        
        const projects = await Project.find(query).sort({ displayOrder: 1, year: -1, createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


// Admin route - all projects including inactive
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const { status, category, active } = req.query;
        let query = {};
        
        if (status && ['ongoing', 'completed', 'awarded'].includes(status)) {
            query.projectStatus = status;
        }
        
        if (category && category !== 'all') {
            query.category = category;
        }
        
        if (active === 'true') {
            query.isActive = true;
        } else if (active === 'false') {
            query.isActive = false;
        }
        
        const projects = await Project.find(query).sort({ displayOrder: 1, createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.get('/counts', async (req, res) => {
    try {
        const counts = await Project.aggregate([
            { $group: { _id: '$projectStatus', count: { $sum: 1 } } }
        ]);
        
        const categoryCounts = await Project.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        
        const activeCounts = await Project.aggregate([
            { $group: { _id: '$isActive', count: { $sum: 1 } } }
        ]);
        
        const result = {
            ongoing: 0,
            completed: 0,
            awarded: 0,
            total: 0,
            byCategory: {},
            active: 0,
            inactive: 0
        };
        
        counts.forEach(c => {
            if (c._id) {
                result[c._id] = c.count;
                result.total += c.count;
            }
        });
        
        categoryCounts.forEach(c => {
            if (c._id) {
                result.byCategory[c._id] = c.count;
            }
        });
        
        activeCounts.forEach(c => {
            if (c._id === true) result.active = c.count;
            else if (c._id === false) result.inactive = c.count;
        });
        
        res.json(result);
    } catch (err) {
        console.error('Error fetching counts:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.get('/:identifier', async (req, res) => {
    try {
        let project;
        
        if (req.params.identifier.match(/^[0-9a-fA-F]{24}$/)) {
            project = await Project.findById(req.params.identifier);
        } else {
            project = await Project.findOne({ slug: req.params.identifier });
        }
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.json(project);
    } catch (err) {
        console.error('Error fetching project:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


router.post('/', authMiddleware, async (req, res) => {
    try {
        console.log('=== Creating new project ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        
        const { 
            title, clientName, year, projectStatus, category, location, 
            displayOrder, imageUrl, featuredImage, gallery, description,
            scope, materials, isActive 
        } = req.body;
        
        // Only title and year are required now
        if (!title || !year) {
            console.log('Validation failed - missing required fields');
            return res.status(400).json({ 
                message: 'Title and Year are required',
                received: { title, year }
            });
        }
        
        const parsedYear = parseInt(year, 10);
        if (Number.isNaN(parsedYear)) {
            return res.status(400).json({ message: 'Year must be a valid number' });
        }
        if (parsedYear < 1900 || parsedYear > 2100) {
            return res.status(400).json({ message: 'Year must be between 1900 and 2100' });
        }

        const allowedStatuses = ['ongoing', 'completed', 'awarded'];
        const normalizedStatus = (projectStatus && allowedStatuses.includes(projectStatus)) ? projectStatus : 'ongoing';

        const allowedCategories = ['Residential', 'Commercial', 'Hospitality', 'Healthcare', 'Educational', 'Government', 'Retail', 'Other'];
        const normalizedCategory = (category && allowedCategories.includes(category)) ? category : 'Commercial';

        const projectData = {
            title: String(title).trim(),
            clientName: clientName ? String(clientName).trim() : '',
            year: parsedYear,
            projectStatus: normalizedStatus,
            category: normalizedCategory,
            location: location || '',
            displayOrder: (Number.isNaN(parseInt(displayOrder, 10)) ? 0 : parseInt(displayOrder, 10)),
            imageUrl: imageUrl || '',
            featuredImage: featuredImage || imageUrl || '',
            gallery: Array.isArray(gallery) ? gallery : [],
            description: description || '',
            scope: scope || '',
            materials: Array.isArray(materials) ? materials : [],
            isActive: isActive !== undefined ? Boolean(isActive) : true
        };
        
        // Generate unique slug
        let baseSlug = projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        let slug = baseSlug;
        let counter = 1;
        
        while (await Project.findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        projectData.slug = slug;
        
        console.log('Final project data:', JSON.stringify(projectData, null, 2));
        
        const project = new Project(projectData);
        const savedProject = await project.save();
        
        console.log('✅ Project saved successfully:', savedProject._id);
        res.status(201).json(savedProject);
        
    } catch (err) {
        console.error('=== PROJECT CREATE ERROR ===');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0] || 'field';
            return res.status(400).json({ 
                message: `A project with this ${field} already exists.`,
                error: err.message 
            });
        }
        
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ 
                message: messages.join(', '),
                error: err.message 
            });
        }

        if (err.name === 'CastError') {
            return res.status(400).json({
                message: `Invalid value for ${err.path}: ${err.value}`,
                error: err.message
            });
        }
        
        res.status(500).json({ 
            message: 'Failed to create project: ' + err.message, 
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});


// Upload gallery images endpoint
router.post('/upload-gallery', authMiddleware, upload.array('images', 20), async (req, res) => {
    try {
        console.log('=== Uploading gallery images ===');
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No image files provided' });
        }
        
        console.log(`Received ${req.files.length} files`);
        
        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, 'sabta/projects/gallery'));
        const results = await Promise.all(uploadPromises);
        
        const images = results.map((result, index) => ({
            url: result.secure_url,
            publicId: result.public_id,
            caption: '',
            displayOrder: index
        }));
        
        console.log(`✅ ${images.length} images uploaded to Cloudinary`);
        
        res.json({ images });
        
    } catch (err) {
        console.error('=== GALLERY UPLOAD ERROR ===');
        console.error('Error:', err.message);
        res.status(500).json({ 
            message: 'Failed to upload gallery images: ' + err.message,
            error: err.message 
        });
    }
});

router.post('/upload-image', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        console.log('=== Uploading project image ===');
        
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        
        console.log('File received:', req.file.originalname, req.file.size, 'bytes');
        
        
        const result = await uploadToCloudinary(req.file.buffer, 'sabta/projects');
        
        console.log('✅ Image uploaded to Cloudinary:', result.secure_url);
        
        res.json({ 
            url: result.secure_url,
            publicId: result.public_id
        });
        
    } catch (err) {
        console.error('=== IMAGE UPLOAD ERROR ===');
        console.error('Error:', err.message);
        res.status(500).json({ 
            message: 'Failed to upload image: ' + err.message,
            error: err.message 
        });
    }
});


router.put('/:id', authMiddleware, async (req, res) => {
    try {
        console.log('=== Updating project ===');
        console.log('Project ID:', req.params.id);
        console.log('Update data:', JSON.stringify(req.body, null, 2));
        
        const { 
            title, clientName, year, projectStatus, category, location, 
            displayOrder, imageUrl, featuredImage, gallery, description,
            scope, materials, isActive 
        } = req.body;
        
        const updateData = {
            updatedAt: new Date()
        };
        
        // Handle all fields
        if (title !== undefined) updateData.title = String(title).trim();
        if (clientName !== undefined) updateData.clientName = String(clientName).trim();
        if (year !== undefined) {
            const parsedYear = parseInt(year, 10);
            if (Number.isNaN(parsedYear)) {
                return res.status(400).json({ message: 'Year must be a valid number' });
            }
            if (parsedYear < 1900 || parsedYear > 2100) {
                return res.status(400).json({ message: 'Year must be between 1900 and 2100' });
            }
            updateData.year = parsedYear;
        }
        if (projectStatus !== undefined) {
            const allowedStatuses = ['ongoing', 'completed', 'awarded'];
            if (!allowedStatuses.includes(projectStatus)) {
                return res.status(400).json({ message: 'Status must be one of ongoing, completed, awarded' });
            }
            updateData.projectStatus = projectStatus;
        }
        if (category !== undefined) {
            const allowedCategories = ['Residential', 'Commercial', 'Hospitality', 'Healthcare', 'Educational', 'Government', 'Retail', 'Other'];
            if (!allowedCategories.includes(category)) {
                return res.status(400).json({ message: 'Invalid category' });
            }
            updateData.category = category;
        }
        if (location !== undefined) updateData.location = location;
        if (displayOrder !== undefined) {
            const parsedOrder = parseInt(displayOrder, 10);
            updateData.displayOrder = Number.isNaN(parsedOrder) ? 0 : parsedOrder;
        }
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
        if (gallery !== undefined) updateData.gallery = Array.isArray(gallery) ? gallery : [];
        if (description !== undefined) updateData.description = description;
        if (scope !== undefined) updateData.scope = scope;
        if (materials !== undefined) updateData.materials = Array.isArray(materials) ? materials : [];
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);
        
        // Update slug if title changes
        if (updateData.title) {
            updateData.slug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        console.log('✅ Project updated successfully:', project._id);
        res.json(project);
        
    } catch (err) {
        console.error('=== PROJECT UPDATE ERROR ===');
        console.error('Error:', err.message);
        console.error('Stack:', err.stack);
        
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join(', '), error: err.message });
        }
        if (err.name === 'CastError') {
            return res.status(400).json({
                message: `Invalid value for ${err.path}: ${err.value}`,
                error: err.message
            });
        }
        
        res.status(500).json({ message: 'Failed to update project: ' + err.message, error: err.message });
    }
});


router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        console.log('=== Deleting project ===');
        console.log('Project ID:', req.params.id);
        
        const project = await Project.findByIdAndDelete(req.params.id);
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        console.log('✅ Project deleted successfully');
        res.json({ message: 'Project deleted successfully' });
        
    } catch (err) {
        console.error('=== PROJECT DELETE ERROR ===');
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Failed to delete project: ' + err.message, error: err.message });
    }
});


router.put('/bulk/order', authMiddleware, async (req, res) => {
    try {
        const { orders } = req.body;
        
        for (const item of orders) {
            await Project.findByIdAndUpdate(item.id, { displayOrder: item.displayOrder });
        }
        
        const projects = await Project.find().sort({ displayOrder: 1, createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
