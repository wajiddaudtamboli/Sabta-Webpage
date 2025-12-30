const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Global error handlers to prevent silent crashes
process.on('uncaughtException', (err) => {
    console.error('=== UNCAUGHT EXCEPTION ===');
    console.error(err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('=== UNHANDLED REJECTION ===');
    console.error('Reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware (for debugging)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Body:', JSON.stringify(req.body, null, 2).substring(0, 500));
    }
    next();
});

// Database Connection - wait for connection before starting server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected');
        
        // Routes
        app.use('/api/auth', require('./routes/auth'));
        app.use('/api/pages', require('./routes/pages'));
        app.use('/api/products', require('./routes/products'));
        app.use('/api/collections', require('./routes/collections'));
        app.use('/api/blogs', require('./routes/blogs'));
        app.use('/api/enquiries', require('./routes/enquiries'));
        app.use('/api/media', require('./routes/media'));
        app.use('/api/projects', require('./routes/projects'));
        app.use('/api/catalogues', require('./routes/catalogues'));
        app.use('/api', require('./routes/settings'));

        // Global error handler
        app.use((err, req, res, next) => {
            console.error('=== GLOBAL ERROR HANDLER ===');
            console.error('Path:', req.path);
            console.error('Method:', req.method);
            console.error('Error:', err.message);
            console.error('Stack:', err.stack);
            res.status(500).json({ 
                message: 'Internal server error', 
                error: process.env.NODE_ENV === 'development' ? err.message : undefined 
            });
        });

        // 404 handler
        app.use((req, res) => {
            console.log('404 Not Found:', req.method, req.path);
            res.status(404).json({ message: 'Route not found' });
        });

        app.get('/', (req, res) => {
            res.send('Sabta Webpage API is running');
        });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

startServer();

module.exports = app; // For Vercel
