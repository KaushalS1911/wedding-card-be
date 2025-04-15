const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    email: String,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    plan: String,
    startDate: Date,
    status: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
