const asyncHandler = require('express-async-handler');
const UserModel = require('../models/user');

// Get All Users
const allUsers = asyncHandler(async (req, res) => {
    const users = await UserModel.find();
    res.status(200).json({
        success: true,
        count: users.length,
        data: users,
    });
});

// Get Single User
const userById = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
        return res.status(404).json({success: false, message: 'User not found'});
    }
    res.status(200).json({success: true, data: user});
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if (!updatedUser) {
        return res.status(404).json({success: false, message: 'User not found'});
    }
    res.status(200).json({success: true, data: updatedUser, message: 'User updated successfully'});
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
        return res.status(404).json({success: false, message: 'User not found'});
    }
    res.status(200).json({success: true, message: 'User deleted successfully'});
});

module.exports = {allUsers, userById, updateUser, deleteUser};
