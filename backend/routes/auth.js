const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mongoose } = require('../db');
const AdminUser = require('../models/AdminUser');
const authMiddleware = require('../middleware/authMiddleware');

// Helper to ensure connection is ready
const ensureConnection = async () => {
    if (mongoose.connection.readyState !== 1) {
        console.log('Waiting for MongoDB connection...');
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Connection timeout')), 15000);
            mongoose.connection.once('connected', () => {
                clearTimeout(timeout);
                resolve();
            });
            if (mongoose.connection.readyState === 1) {
                clearTimeout(timeout);
                resolve();
            }
        });
    }
};

// Register (Initial setup only, should be protected or removed later)
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await AdminUser.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new AdminUser({ email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Login attempt for:', email);
        console.log('MongoDB connection state:', mongoose.connection.readyState);
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }
        
        // Check connection state
        if (mongoose.connection.readyState !== 1) {
            console.error('MongoDB not connected, state:', mongoose.connection.readyState);
            return res.status(500).json({ message: 'Database not ready', state: mongoose.connection.readyState });
        }
        
        console.log('Starting user query...');
        const user = await AdminUser.findOne({ email }).maxTimeMS(10000);
        console.log('User found:', !!user);
        
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET not set!');
            return res.status(500).json({ message: 'Server configuration error' });
        }
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        console.log('Token generated successfully');
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err.message, err.stack);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get User
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await AdminUser.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot Password - Send reset token
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await AdminUser.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not for security
            return res.json({ message: 'If this email exists, a reset link has been sent.' });
        }

        // Generate reset token (valid for 1 hour)
        const resetToken = jwt.sign(
            { id: user._id, purpose: 'password-reset' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Store reset token in user document
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        // In production, send email here. For now, return token for testing
        console.log('Password reset token generated for:', email);
        
        res.json({ 
            message: 'If this email exists, a reset link has been sent.',
            // For development/testing only - remove in production
            resetToken: resetToken 
        });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Reset Password with token
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        if (decoded.purpose !== 'password-reset') {
            return res.status(400).json({ message: 'Invalid token type' });
        }

        const user = await AdminUser.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if token matches and not expired
        if (user.resetToken !== token || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ message: 'Reset token has expired' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        console.log('Password reset successful for user:', user.email);
        res.json({ message: 'Password reset successful. You can now login.' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
