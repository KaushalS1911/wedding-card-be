const asyncHandler = require('express-async-handler');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');
const {generateToken} = require("../auth/jwt");

// Create User
const register = asyncHandler(async (req, res) => {
    const {email, contact, role} = req.body;
    const userExist = await UserModel.exists({$or: [{email}, {contact}]});
    if (userExist) throw new Error('User already exists');

    const newUser = await UserModel.create({...req.body, role});

    res.status(201).json({data: newUser, message: 'Registered successfully'});
});

// Login User
const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});

    if (!user || !(await user.isPasswordMatched(password))) {
        throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id);
    res.status(200).json({token, message: 'Login successful'});
});

// Get Me
const me = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id).select('-password');
    if (!user) throw new Error('User not found');
    res.status(200).json({data: user});
});

module.exports = {register, me, login};