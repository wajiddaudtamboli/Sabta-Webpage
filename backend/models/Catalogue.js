const mongoose = require('mongoose');

const CatalogueSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true,
        trim: true
    },
    description: { 
        type: String,
        trim: true
    },
    fileUrl: { 
        type: String, 
        required: true // PDF or Image URL
    },
    fileType: {
        type: String,
        enum: ['url', 'image', 'pdf'],
        default: 'url'
    },
    thumbnailUrl: { 
        type: String // Preview image
    },
    displayOrder: { 
        type: Number, 
        default: 0 
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active' 
    }
}, { 
    timestamps: true 
});

// Index for sorting and filtering
CatalogueSchema.index({ displayOrder: 1 });
CatalogueSchema.index({ status: 1 });

module.exports = mongoose.model('Catalogue', CatalogueSchema);
