const asyncHandler = require('express-async-handler');
const User = require('../models/user');

// Get All Users
const allUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json({data: users});
});

// Get Single User
const userById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error('User not found');
    res.status(200).json({data: user});
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!updatedUser) throw new Error('User not found');
    res.status(200).json({data: updatedUser, message: 'User updated successfully'});
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) throw new Error('User not found');
    res.status(200).json({message: 'User deleted successfully'});
});

module.exports = {allUsers, userById, updateUser, deleteUser}

