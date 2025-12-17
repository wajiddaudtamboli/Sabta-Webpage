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
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        
        if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
            return callback(null, true);
        }
        
        callback(null, true);
    },
    credentials: true
}));
app.use(express.json());

// MongoDB connection
let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }
    
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
    }
    
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        isConnected = true;
        console.log('MongoDB connected to:', mongoose.connection.name);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        isConnected = false;
        throw error;
    }
};

// Ensure DB connection before each request
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

// Routes
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
    res.json({ 
        message: 'Sabta Webpage API is running', 
        status: 'ok',
        dbState: mongoose.connection.readyState,
        dbName: mongoose.connection.name || 'not connected'
    });
});

app.get('/api/debug', async (req, res) => {
    res.json({
        mongoUri: process.env.MONGODB_URI ? 'SET (hidden)' : 'NOT SET',
        jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
        dbState: mongoose.connection.readyState,
        dbName: mongoose.connection.name,
        dbHost: mongoose.connection.host
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'Sabta Webpage API is running', status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = app;
