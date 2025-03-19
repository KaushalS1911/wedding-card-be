const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Create User
const register = asyncHandler(async (req, res) => {
    const {email, phone_number, role} = req.body;
    const userExist = await User.exists({$or: [{email}, {phone_number}]});
    if (userExist) throw new Error('User already exists');

    const userRole = role && ['customer', 'admin'].includes(role) ? role : 'customer';
    const newUser = await User.create({...req.body, role: userRole});

    res.status(201).json({data: newUser, message: 'Registered successfully'});
});

// Login User
const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (!user || !(await user.isPasswordMatched(password))) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1d'});
    res.status(200).json({token, message: 'Login successful'});
});

// Get Me
const me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw new Error('User not found');
    res.status(200).json({data: user});
});

module.exports = {register, me, login};