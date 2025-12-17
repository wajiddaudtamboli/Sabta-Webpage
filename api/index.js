const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Log environment info for debugging
console.log('API Starting...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI set:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET set:', !!process.env.JWT_SECRET);

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        
        // Check if origin is allowed or matches vercel.app pattern
        if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
            return callback(null, true);
        }
        
        callback(null, true); // Allow all origins for now to debug
    },
    credentials: true
}));
app.use(express.json());

// MongoDB connection with caching for serverless
let cachedDb = null;
let isConnecting = false;

async function connectToDatabase() {
    // If already connected, return cached connection
    if (cachedDb && mongoose.connection.readyState === 1) {
        console.log('Using cached database connection');
        return cachedDb;
    }
    
    // Prevent multiple simultaneous connection attempts
    if (isConnecting) {
        // Wait for existing connection attempt
        await new Promise(resolve => setTimeout(resolve, 100));
        return connectToDatabase();
    }
    
    isConnecting = true;
    
    try {
        // Disconnect if in a bad state
        if (mongoose.connection.readyState !== 0 && mongoose.connection.readyState !== 1) {
            await mongoose.disconnect();
        }
        
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not set');
        }
        
        console.log('Connecting to MongoDB...');
        
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 1,
        });
        
        console.log('MongoDB connected successfully to:', mongoose.connection.name);
        cachedDb = connection;
        return cachedDb;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        throw error;
    } finally {
        isConnecting = false;
    }
}

// Initialize database connection middleware
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error('Database connection error:', error.message);
        res.status(500).json({ 
            message: 'Database connection failed', 
            error: error.message
        });
    }
});

// Routes - use path.join for proper path resolution in serverless
const routesPath = path.join(__dirname, '..', 'backend', 'routes');

try {
    app.use('/api/auth', require(path.join(routesPath, 'auth')));
    app.use('/api/pages', require(path.join(routesPath, 'pages')));
    app.use('/api/products', require(path.join(routesPath, 'products')));
    app.use('/api/blogs', require(path.join(routesPath, 'blogs')));
    app.use('/api/enquiries', require(path.join(routesPath, 'enquiries')));
    app.use('/api/media', require(path.join(routesPath, 'media')));
    console.log('All routes loaded successfully');
} catch (routeError) {
    console.error('Error loading routes:', routeError.message);
}

app.get('/api', (req, res) => {
    res.json({ message: 'Sabta Webpage API is running', status: 'ok' });
});

app.get('/', (req, res) => {
    res.json({ message: 'Sabta Webpage API is running', status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
