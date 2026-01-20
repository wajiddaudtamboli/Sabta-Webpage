const mongoose = require('mongoose');

// Sub-schema for product images with metadata
const ProductImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    description: { type: String, default: '' },
    isNewArrival: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 }
}, { _id: true });

const ProductSchema = new mongoose.Schema({
    code: { type: String }, // e.g., SG01099
    name: { type: String, required: true },
    slug: { type: String },
    category: { type: String, required: true },
    collectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
    collectionName: { type: String, default: 'Natural Stone Collections by SABTA GRANITE' },
    description: String,
    
    // Primary product image (single image from device upload)
    primaryImage: { type: String, default: '' },
    
    // Legacy images array (simple strings) - kept for backward compatibility
    images: [String],
    
    // New detailed images array
    productImages: [ProductImageSchema],
    
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
    
    // Additional content sections
    qualityImage: String,
    qualityText: { type: String, default: 'Exceptional Quality You Can Trust' },
    
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    displayOrder: { type: Number, default: 0 },
    colorSequence: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Index for better query performance
ProductSchema.index({ collectionId: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ slug: 1 });

// Auto-generate slug from name (always update)
ProductSchema.pre('save', async function() {
    if (this.name) {
        this.slug = this.name.toLowerCase()
            .replace(/[^a-z0-9\s]+/g, '')
            .replace(/\s+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    this.updatedAt = new Date();
});

// Handle findOneAndUpdate
ProductSchema.pre('findOneAndUpdate', function() {
    const update = this.getUpdate();
    if (update.name) {
        update.slug = update.name.toLowerCase()
            .replace(/[^a-z0-9\s]+/g, '')
            .replace(/\s+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    update.updatedAt = new Date();
});

// Virtual to get all images (combines legacy and new)
ProductSchema.virtual('allImages').get(function() {
    const legacyImages = this.images || [];
    const newImages = (this.productImages || []).map(img => img.url);
    return [...new Set([...legacyImages, ...newImages])];
});

// Virtual to get primary display image
ProductSchema.virtual('displayImage').get(function() {
    return this.primaryImage || 
           (this.productImages && this.productImages[0]?.url) || 
           (this.images && this.images[0]) || 
           '';
});

// Ensure virtuals are included in JSON output
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);
