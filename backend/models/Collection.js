const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String },
    image: { type: String, default: '' },
    tagline1: { type: String, default: 'Where Luxury Meets the Art of Nature' },
    tagline2: { type: String, default: 'The Journey of a Stone That Defines' },
    tagline3: { type: String, default: 'Application, Care & Finish' },
    description: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Auto-generate slug from name
CollectionSchema.pre('save', async function() {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    this.updatedAt = new Date();
});

module.exports = mongoose.model('Collection', CollectionSchema);
