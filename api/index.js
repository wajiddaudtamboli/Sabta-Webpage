const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', process.env.FRONTEND_URL, /\.vercel\.app$/],
    credentials: true
}));
app.use(express.json());

// MongoDB connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    });
    
    cachedDb = connection;
    return cachedDb;
}

// Initialize database connection
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ message: 'Database connection failed' });
    }
});

// Routes
app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/pages', require('../backend/routes/pages'));
app.use('/api/products', require('../backend/routes/products'));
app.use('/api/blogs', require('../backend/routes/blogs'));
app.use('/api/enquiries', require('../backend/routes/enquiries'));
app.use('/api/media', require('../backend/routes/media'));

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
