const mongoose = require("mongoose");

const premiumSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    startDate: {
        type: Date,
        default: Date.now,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

premiumSchema.methods.checkStatus = function () {
    if (this.endDate < Date.now()) {
        this.isActive = false;
        this.save();
    }
    return this.isActive;
};

module.exports = mongoose.model("Premium", premiumSchema);
