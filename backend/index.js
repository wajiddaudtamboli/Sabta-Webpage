const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;

// Load environment variables
dotenv.config();

// Configure Cloudinary (optional - graceful fallback if not configured)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('Cloudinary configured successfully');
} else {
    console.log('Cloudinary not configured - images will be stored as URLs/base64');
}

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

// Track server instance to prevent multiple starts
let server = null;

console.log('Initializing Express app...');

// CORS configuration for development and production
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        
        // Allow Vercel domains
        if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
            return callback(null, true);
        }
        
        // Allow all origins in development
        callback(null, true);
    },
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

console.log('Middleware configured...');

// Request logging middleware (for debugging)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Database Connection - wait for connection before starting server
const startServer = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected successfully');

        // Routes
        console.log('Setting up routes...');
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
            res.status(500).json({
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        });

        // Root health check
        app.get('/', (req, res) => {
            console.log('Root route accessed');
            res.json({ status: "Backend is running", timestamp: new Date().toISOString() });
        });

        // Dedicated health check route
        app.get('/health', (req, res) => {
            res.json({ 
                status: "OK", 
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage()
            });
        });

        // Test route
        app.get('/test', (req, res) => {
            console.log('Test route accessed');
            res.json({ status: "Test route working", timestamp: new Date().toISOString() });
        });

        // 404 handler
        app.use((req, res) => {
            console.log('404 Not Found:', req.method, req.path);
            res.status(404).json({ message: 'Route not found' });
        });

        console.log(`Starting server on port ${PORT}...`);
        
        // Close existing server if running (prevents EADDRINUSE)
        if (server) {
            console.log('Closing existing server...');
            await new Promise((resolve) => server.close(resolve));
        }
        
        server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`✅ Server successfully listening on port ${PORT}`);
            console.log(`✅ Backend is ready at http://localhost:${PORT}`);
        });

        // Handle server errors (including EADDRINUSE)
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use!`);
                console.error('Please kill the process using the port or use a different port.');
                console.error('Run: netstat -ano | findstr :5000 (Windows) or lsof -i :5000 (Mac/Linux)');
            } else {
                console.error('Server error:', err);
            }
            process.exit(1);
        });

        // Handle server close
        server.on('close', () => {
            console.log('Server closed');
        });
        
        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received, shutting down gracefully...');
            server.close(() => {
                mongoose.connection.close(false, () => {
                    console.log('Server and database connections closed.');
                    process.exit(0);
                });
            });
        });
        
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

console.log('Calling startServer...');
startServer();
