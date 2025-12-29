const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String },
    clientName: { type: String, required: true },
    year: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['ongoing', 'completed', 'awarded'],
        default: 'ongoing'
    },
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    displayOrder: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


ProjectSchema.pre('save', function() {
    console.log('[ProjectModel] pre-save hook running for title:', this.title);
    this.updatedAt = new Date();
});


ProjectSchema.pre('findOneAndUpdate', function() {
    this.set({ updatedAt: new Date() });
});

module.exports = mongoose.model('Project', ProjectSchema);
