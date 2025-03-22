const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParentCategory',
        required: false
    },
}, {timestamps: true});

module.exports = mongoose.model('Category', categorySchema);
