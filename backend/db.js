// Shared database connection module
const mongoose = require('mongoose');

let isConnected = false;
let connectionPromise = null;

const connectToDatabase = async () => {
    if (isConnected && mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }
    
    if (mongoose.connection.readyState === 2) {
        // Currently connecting, wait for it
        if (connectionPromise) {
            await connectionPromise;
            return mongoose.connection;
        }
    }
    
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not set');
    }
    
    console.log('Creating new MongoDB connection...');
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 60000,
    });
    
    try {
        await connectionPromise;
        isConnected = true;
        console.log('MongoDB connected to:', mongoose.connection.name);
        return mongoose.connection;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        connectionPromise = null;
        isConnected = false;
        throw error;
    }
};

module.exports = { mongoose, connectToDatabase };
