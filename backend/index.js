const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
        app.use('/api', require('./routes/settings'));

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
