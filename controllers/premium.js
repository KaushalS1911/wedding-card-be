const asyncHandler = require("express-async-handler");
const PremiumModel = require("../models/premium");

// Create a new premium subscription
const createPremium = asyncHandler(async (req, res) => {
    const {userId, startDate, endDate, isActive} = req.body;

    if (await PremiumModel.exists({userId})) {
        return res.status(400).json({success: false, message: "User already has a premium subscription"});
    }

    if (new Date(endDate) <= new Date(startDate)) {
        return res.status(400).json({success: false, message: "End date must be greater than start date"});
    }

    const newPremium = await PremiumModel.create({userId, startDate, endDate, isActive});
    res.status(201).json({success: true, data: newPremium, message: "Premium subscription created successfully"});
});

// Get all premium subscriptions
const allPremiums = asyncHandler(async (req, res) => {
    const premiums = await PremiumModel.find().populate('userId', 'firstName lastName email');
    res.status(200).json({success: true, data: premiums});
});

// Get a single premium subscription by ID
const premiumById = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const premium = await PremiumModel.findById(id).populate('userId', 'firstName lastName email');

    if (!premium) {
        return res.status(404).json({success: false, message: "Premium subscription not found"});
    }

    res.status(200).json({success: true, data: premium});
});

// Update premium subscription
const updatePremium = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const updatedPremium = await PremiumModel.findByIdAndUpdate(id, req.body, {new: true});

    if (!updatedPremium) {
        return res.status(400).json({success: false, message: "Failed to update premium subscription"});
    }

    res.status(200).json({success: true, data: updatedPremium, message: "Premium subscription updated successfully"});
});

// Delete premium subscription
const deletePremium = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const deletedPremium = await PremiumModel.findByIdAndDelete(id);

    if (!deletedPremium) {
        return res.status(400).json({success: false, message: "Failed to delete premium subscription"});
    }

    res.status(200).json({success: true, message: "Premium subscription deleted successfully"});
});

// Send reminder for expiring subscriptions
const sendReminder = asyncHandler(async (req, res) => {
    const currentDate = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(currentDate.getDate() + 7);

    const expiringPremiums = await PremiumModel.find({
        endDate: {$lte: sevenDaysLater, $gte: currentDate},
        isActive: true,
    }).populate('userId', 'email firstName lastName');

    if (!expiringPremiums.length) {
        return res.status(200).json({success: true, message: "No subscriptions expiring within 7 days."});
    }

    expiringPremiums.forEach((subscription) => {
        console.log(`Reminder sent to ${subscription.userId.email} for subscription expiring on ${subscription.endDate}`);
    });

    res.status(200).json({success: true, message: "Reminders sent successfully", data: expiringPremiums});
});

module.exports = {
    createPremium,
    allPremiums,
    premiumById,
    updatePremium,
    deletePremium,
    sendReminder,
};
