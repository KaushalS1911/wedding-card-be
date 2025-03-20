const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    images: {
        type: [String],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    blogCategory: {
        type: String,
        required: true,
        trim: true
    },
    desc: {
        type: String,
        required: true,
        trim: true
    },
    extraData: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
});

module.exports = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
