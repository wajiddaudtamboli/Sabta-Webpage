const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Image-only upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed'));
    }
});

// PDF and image upload (for catalogues)
const uploadCatalogue = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for PDFs
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
        const isPdf = file.mimetype === 'application/pdf';
        const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedImageTypes.test(file.mimetype);
        if ((extname && mimetype) || isPdf) {
            return cb(null, true);
        }
        cb(new Error('Only image or PDF files are allowed'));
    }
});

// Get all media
router.get('/', authMiddleware, async (req, res) => {
    try {
        const media = await Media.find().sort({ createdAt: -1 });
        res.json(media);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload image to Cloudinary
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
            // If no Cloudinary config, return error with suggestion
            return res.status(400).json({ 
                message: 'Image upload not configured. Please add Cloudinary credentials to .env file.',
                hint: 'Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to your .env file'
            });
        }

        // Upload to Cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'sabta-granite',
                    resource_type: 'image',
                    transformation: [
                        { quality: 'auto:good' },
                        { fetch_format: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const result = await uploadPromise;

        // Save to database
        const newMedia = new Media({
            url: result.secure_url,
            filename: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size,
            cloudinaryId: result.public_id
        });
        await newMedia.save();

        res.json({ 
            url: result.secure_url, 
            id: newMedia._id,
            message: 'Image uploaded successfully'
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ message: 'Upload failed: ' + err.message });
    }
});

// Add media (URL) - for manual URL entry
router.post('/', authMiddleware, async (req, res) => {
    try {
        const newMedia = new Media(req.body);
        const media = await newMedia.save();
        res.json(media);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload catalogue file (PDF or Image) to Cloudinary
router.post('/upload-catalogue', authMiddleware, uploadCatalogue.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
            return res.status(400).json({ 
                message: 'File upload not configured. Please add Cloudinary credentials to .env file.',
                hint: 'Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to your .env file'
            });
        }

        const isPdf = req.file.mimetype === 'application/pdf';
        
        // Upload to Cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'sabta-granite/catalogues',
                    resource_type: isPdf ? 'raw' : 'image',
                    ...(isPdf ? {} : {
                        transformation: [
                            { quality: 'auto:good' },
                            { fetch_format: 'auto' }
                        ]
                    })
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const result = await uploadPromise;

        res.json({ 
            url: result.secure_url, 
            publicId: result.public_id,
            fileType: isPdf ? 'pdf' : 'image',
            message: 'File uploaded successfully'
        });
    } catch (err) {
        console.error('Catalogue upload error:', err);
        res.status(500).json({ message: 'Upload failed: ' + err.message });
    }
});

// Delete media
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const media = await Media.findById(req.params.id);
        
        // Delete from Cloudinary if it has a cloudinaryId
        if (media?.cloudinaryId) {
            try {
                await cloudinary.uploader.destroy(media.cloudinaryId);
            } catch (cloudErr) {
                console.error('Cloudinary delete error:', cloudErr);
            }
        }
        
        await Media.findByIdAndDelete(req.params.id);
        res.json({ message: 'Media deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
