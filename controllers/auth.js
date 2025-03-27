const asyncHandler = require('express-async-handler');
const UserModel = require('../models/user');
const {generateToken} = require('../auth/jwt');
const Config = require('../models/config');
const {ROLES} = require('../constants');

// Create User
const register = asyncHandler(async (req, res) => {
    try {
        const {email, contact, role} = req.body;

        const userExist = await UserModel.exists({$or: [{email}, {contact}]});
        if (userExist) {
            return res.status(400).json({success: false, message: 'User already exists'});
        }

        const newUser = await UserModel.create({...req.body, role});

        if (role === ROLES.ADMIN) {
            const newConfig = new Config({company_details: {userId: newUser._id}});
            await newConfig.save();
        }

        res.status(201).json({success: true, data: newUser, message: 'Registered successfully'});
    } catch (error) {
        res.status(500).json({success: false, message: 'Registration failed', error: error.message});
    }
});

// Login User
const login = asyncHandler(async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await UserModel.findOne({email});

        if (!user || !(await user.isPasswordMatched(password))) {
            return res.status(401).json({success: false, message: 'Invalid email or password'});
        }

        const token = generateToken(user._id);
        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({
            success: true,
            token,
            user: userData,
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({success: false, message: 'Login failed', error: error.message});
    }
});

// Get Me
const me = asyncHandler(async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({success: false, message: 'User not found'});
        }

        res.status(200).json({success: true, data: user});
    } catch (error) {
        res.status(500).json({success: false, message: 'Unable to fetch user details', error: error.message});
    }
});

module.exports = {register, me, login};
