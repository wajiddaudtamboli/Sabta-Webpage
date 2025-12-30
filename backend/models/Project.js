const mongoose = require('mongoose');

// Sub-schema for project gallery images
const ProjectImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 }
}, { _id: true });

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String },
    clientName: { type: String, default: '' },
    year: { type: Number, default: new Date().getFullYear() },
    
    // Project category
    category: { 
        type: String, 
        enum: ['Residential', 'Commercial', 'Hospitality', 'Healthcare', 'Educational', 'Government', 'Retail', 'Other'],
        default: 'Commercial'
    },
    
    // Status for admin workflow
    projectStatus: { 
        type: String, 
        enum: ['ongoing', 'completed', 'awarded'],
        default: 'ongoing'
    },
    
    // Active/Inactive for website visibility
    isActive: { type: Boolean, default: true },
    
    // Featured image (main image)
    featuredImage: { type: String, default: '' },
    
    // Legacy single image field (kept for backward compatibility)
    imageUrl: { type: String, default: '' },
    
    // Gallery images
    gallery: [ProjectImageSchema],
    
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    
    // Additional details
    scope: { type: String, default: '' },
    materials: [{ type: String }],
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Auto-generate slug from title
ProjectSchema.pre('save', async function() {
    if (this.title && !this.slug) {
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    // Sync featuredImage with imageUrl for backward compatibility
    if (this.featuredImage && !this.imageUrl) {
        this.imageUrl = this.featuredImage;
    } else if (this.imageUrl && !this.featuredImage) {
        this.featuredImage = this.imageUrl;
    }
    this.updatedAt = new Date();
});

ProjectSchema.pre('findOneAndUpdate', function() {
    this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('Project', ProjectSchema);
