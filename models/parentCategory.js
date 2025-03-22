const mongoose = require('mongoose');

const parentCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {timestamps: true});

module.exports = mongoose.model('ParentCategory', parentCategorySchema);
