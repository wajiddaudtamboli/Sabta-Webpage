const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, index: true },
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

// Auto-generate slug from name (before save and update)
CollectionSchema.pre('save', async function() {
    // Always generate/update slug from name
    if (this.name) {
        this.slug = this.name.toLowerCase()
            .replace(/[^a-z0-9\s]+/g, '')
            .replace(/\s+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    this.updatedAt = new Date();
});

// Also handle findOneAndUpdate
CollectionSchema.pre('findOneAndUpdate', function() {
    const update = this.getUpdate();
    if (update.name) {
        update.slug = update.name.toLowerCase()
            .replace(/[^a-z0-9\s]+/g, '')
            .replace(/\s+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    update.updatedAt = new Date();
});

module.exports = mongoose.model('Collection', CollectionSchema);
