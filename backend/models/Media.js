const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
    url: { type: String, required: true },
    filename: String,
    type: String, // e.g., 'image/jpeg'
    size: Number,
    cloudinaryId: String, // For Cloudinary uploads
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Media', MediaSchema);
