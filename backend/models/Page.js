const { mongoose } = require('../db');

const PageSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., 'home', 'about'
    content: { type: mongoose.Schema.Types.Mixed, default: {} }, // Flexible content structure
    sections: [{
        id: String,
        name: String,
        enabled: { type: Boolean, default: true },
        data: mongoose.Schema.Types.Mixed
    }],
    metaTitle: String,
    metaDescription: String,
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Page', PageSchema);
