const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Type = mongoose.model('Type', typeSchema);
module.exports = Type;
