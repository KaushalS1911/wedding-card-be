const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true,
    },
    hex: {
        type: String,
        required: true,
    },
    product_images: {
        type: [String],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: 'At least one product image is required for each color.',
        },
    },
});

const templateSchema = new mongoose.Schema(
    {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        subcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subcategory',
            required: true,
        },
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        colors: {
            type: [colorSchema],
            required: true,
        },
        size: {
            type: String,
            required: true,
        },
        templateType: {
            type: String,
            required: true,
        },
        template_theme: {
            type: String,
            required: true,
        },
        isSubscription: {
            type: Boolean,
            default: false,
        },
        orientation: {
            type: String,
            enum: ['portrait', 'landscape', 'square'],
            required: true,
        },
        count: {
            type: Number,
            default: 0,
        },
        template_photo: {
            type: Boolean,
            default: false,
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
);

const Template = mongoose.models.Template || mongoose.model('Template', templateSchema);
module.exports = Template;
