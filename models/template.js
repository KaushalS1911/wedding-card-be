const mongoose = require('mongoose');
const {LAYOUTS} = require("../constants");

const colorSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true,
    },
    hex: {
        type: String,
        required: true,
    },
    templateImages: {
        type: String,
        required: true,
    },
    initialDetail: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
});

const templateSchema = new mongoose.Schema(
    {
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
        templateTheme: {
            type: String,
            required: true,
        },
        orientation: {
            type: String,
            enum: [LAYOUTS.PORTRAIT, LAYOUTS.LANDSCAPE, LAYOUTS.SQUARE],
            required: true,
        },
        count: {
            type: Number,
            default: 0,
        },
        templatePhoto: {
            type: Boolean,
            default: false,
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
        isPremium: {
            type: Boolean,
            default: false,
        },
    },
    {timestamps: true}
);

const Template = mongoose.models.Template || mongoose.model('Template', templateSchema);
module.exports = Template;
