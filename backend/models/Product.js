const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    code: { type: String }, // e.g., SG01099
    name: { type: String, required: true },
    slug: { type: String },
    category: { type: String, required: true },
    collectionName: { type: String, default: 'Natural Stone Collections by SABTA GRANITE' },
    description: String,
    images: [String],
    price: Number,
    
    // Product attributes
    color: String,
    finish: String,
    origin: String,
    thickness: String,
    size: String,
    
    // Boolean flags
    isBookmatch: { type: Boolean, default: false },
    isTranslucent: { type: Boolean, default: false },
    isNatural: { type: Boolean, default: true },
    isNewArrival: { type: Boolean, default: false },
    
    // Stone Properties
    grade: String, // e.g., "Premium / Export Grade"
    compressionStrength: String, // e.g., "153 MPa"
    impactTest: String, // e.g., "Not Published"
    bulkDensity: String, // e.g., "2,635 kg/m³"
    waterAbsorption: String, // e.g., "0.2-0.25%"
    thermalExpansion: String, // e.g., "Very Low / High Stability"
    flexuralStrength: String, // e.g., "11.40 MPa"
    
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    displayOrder: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Auto-generate slug from name
ProductSchema.pre('save', function(next) {
    if (this.name && !this.slug) {
        this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
