const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {ROLES} = require("../constants");

const userSchema = new mongoose.Schema({
    firstName: {type: String, trim: true},
    lastName: {type: String, trim: true},
    contact: {type: String, trim: true},
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {type: String, required: true},
    role: {
        type: String,
        enum: [ROLES.ADMIN, ROLES.USER],
        default: ROLES.USER,
    },
    isPremium: {type: Boolean, default: false},
    stripeCustomerId: {type: String, default: null},
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
