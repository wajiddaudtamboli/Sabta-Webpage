const express = require('express');
const cors = require('cors');
const path = require('path');

// Use shared database module
const { mongoose, connectToDatabase } = require('../backend/db');

// Set mongoose to buffer commands until connection is ready
mongoose.set('bufferCommands', true);
mongoose.set('bufferTimeoutMS', 30000); // 30 seconds

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

// Health check endpoint (no DB required)
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: {
            MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
            JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
            NODE_ENV: process.env.NODE_ENV || 'not set'
        }
    });
});

// Debug endpoint (no DB required)
app.get('/api/debug', (req, res) => {
    res.json({
        mongoUri: process.env.MONGODB_URI ? 'SET (value hidden)' : 'NOT SET - Please add MONGODB_URI in Vercel Environment Variables',
        jwtSecret: process.env.JWT_SECRET ? 'SET' : 'NOT SET - Please add JWT_SECRET in Vercel Environment Variables',
        nodeEnv: process.env.NODE_ENV,
        dbState: mongoose.connection.readyState,
        dbStateName: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
        message: !process.env.MONGODB_URI 
            ? 'MONGODB_URI is not set! Go to Vercel Dashboard > Project Settings > Environment Variables and add MONGODB_URI'
            : 'Environment variables are configured'
    });
});

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI) {
            return res.json({ 
                success: false, 
                error: 'MONGODB_URI not set',
                uri: 'NOT SET'
            });
        }
        
        // Try to connect
        await connectToDatabase();
        
        res.json({ 
            success: true, 
            message: 'Database connected successfully',
            dbState: mongoose.connection.readyState,
            dbName: mongoose.connection.name,
            dbHost: mongoose.connection.host
        });
    } catch (error) {
        res.json({ 
            success: false, 
            error: error.message,
            dbState: mongoose.connection.readyState,
            hint: 'Check: 1) MongoDB URI format, 2) IP whitelist in Atlas (add 0.0.0.0/0), 3) Username/password'
        });
    }
});

// Root endpoint (no DB required)
app.get('/', (req, res) => {
    res.json({ 
        message: 'Sabta Webpage API is running', 
        status: 'ok',
        envCheck: {
            mongodb: process.env.MONGODB_URI ? 'configured' : 'MISSING',
            jwt: process.env.JWT_SECRET ? 'configured' : 'MISSING'
        }
    });
});

app.get('/api', (req, res) => {
    res.json({ 
        message: 'Sabta Webpage API is running', 
        status: 'ok',
        dbState: mongoose.connection.readyState,
        envCheck: {
            mongodb: process.env.MONGODB_URI ? 'configured' : 'MISSING - Add in Vercel Dashboard',
            jwt: process.env.JWT_SECRET ? 'configured' : 'MISSING - Add in Vercel Dashboard'
        }
    });
});

// Database connection middleware - only for routes that need it
const requireDB = async (req, res, next) => {
    try {
        if (!process.env.MONGODB_URI) {
            return res.status(500).json({ 
                message: 'Database not configured', 
                error: 'MONGODB_URI environment variable is not set. Please add it in Vercel Dashboard > Project Settings > Environment Variables'
            });
        }
        await connectToDatabase();
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Connection not ready after connect');
        }
        next();
    } catch (error) {
        console.error('Database connection error:', error.message);
        res.status(500).json({ 
            message: 'Database connection failed', 
            error: error.message,
            hint: 'Check MongoDB Atlas: 1) IP whitelist (add 0.0.0.0/0), 2) Username/password, 3) Database name'
        });
    }
};

// Routes - all require database connection
const routesPath = path.join(__dirname, '..', 'backend', 'routes');

try {
    app.use('/api/auth', requireDB, require(path.join(routesPath, 'auth')));
    app.use('/api/pages', requireDB, require(path.join(routesPath, 'pages')));
    app.use('/api/products', requireDB, require(path.join(routesPath, 'products')));
    app.use('/api/collections', requireDB, require(path.join(routesPath, 'collections')));
    app.use('/api/catalogues', requireDB, require(path.join(routesPath, 'catalogues')));
    app.use('/api/blogs', requireDB, require(path.join(routesPath, 'blogs')));
    app.use('/api/enquiries', requireDB, require(path.join(routesPath, 'enquiries')));
    app.use('/api/media', requireDB, require(path.join(routesPath, 'media')));
    app.use('/api/projects', requireDB, require(path.join(routesPath, 'projects')));
    app.use('/api', requireDB, require(path.join(routesPath, 'settings')));
    console.log('All routes loaded successfully');
} catch (routeError) {
    console.error('Error loading routes:', routeError.message);
}

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = app;
