const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        match: [
            /\S+@\S+\.\S+/,
            "Please use a valid email address",
        ],
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);
