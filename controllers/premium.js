const asyncHandler = require("express-async-handler");
const PremiumModel = require("../models/premium");

// Create a new premium subscription
const createPremium = asyncHandler(async (req, res) => {
    const {userId, startDate, endDate, isActive} = req.body;

    const premiumExist = await PremiumModel.exists({userId});
    if (premiumExist) throw new Error("User already has a premium subscription");

    if (new Date(endDate) <= new Date(startDate)) {
        throw new Error("End date must be greater than start date");
    }

    const newPremium = await PremiumModel.create({userId, startDate, endDate, isActive});

    res.status(201).json({data: newPremium, message: "Premium subscription created successfully"});
});

// Get all premium subscriptions
const allPremiums = asyncHandler(async (req, res) => {
    const premiums = await PremiumModel.find().populate('userId', 'firstName lastName email');
    res.status(200).json({data: premiums});
});

// Get a single premium subscription by ID
const premiumById = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const premium = await PremiumModel.findById(id).populate('userId', 'firstName lastName email');

    if (!premium) throw new Error("Premium subscription not found");

    res.status(200).json({data: premium});
});

// Update premium subscription
const updatePremium = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const updatedPremium = await PremiumModel.findByIdAndUpdate(id, req.body, {new: true});

    if (!updatedPremium) throw new Error("Failed to update premium subscription");

    res.status(200).json({data: updatedPremium, message: "Premium subscription updated successfully"});
});

// Delete premium subscription
const deletePremium = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const deletedPremium = await PremiumModel.findByIdAndDelete(id);

    if (!deletedPremium) throw new Error("Failed to delete premium subscription");

    res.status(200).json({message: "Premium subscription deleted successfully"});
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

    if (expiringPremiums.length === 0) {
        return res.status(200).json({message: "No subscriptions expiring within 7 days."});
    }

    expiringPremiums.forEach((subscription) => {
        console.log(`Reminder sent to ${subscription.userId.email} for subscription expiring on ${subscription.endDate}`);
    });

    res.status(200).json({message: "Reminders sent successfully", data: expiringPremiums});
});

module.exports = {
    createPremium,
    allPremiums,
    premiumById,
    updatePremium,
    deletePremium,
    sendReminder,
};
