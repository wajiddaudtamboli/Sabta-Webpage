const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    featuredImage: String,
    content: { type: String, required: true }, // Rich text content
    metaTitle: String,
    metaDescription: String,
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    author: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', BlogSchema);
