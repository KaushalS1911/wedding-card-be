const asyncHandler = require('express-async-handler');
const InquiryModel = require('../models/inquiry');

// Create inquiry
const createInquiry = asyncHandler(async (req, res) => {
    const {email} = req.body;

    const inquiryExist = await InquiryModel.exists({email});
    if (inquiryExist) {
        return res.status(400).json({success: false, message: 'Inquiry with this email already exists'});
    }

    const newInquiry = await InquiryModel.create(req.body);
    res.status(201).json({success: true, data: newInquiry, message: 'Inquiry created successfully'});
});

// Get all inquiries
const inquirys = asyncHandler(async (req, res) => {
    const inquiries = await InquiryModel.find({});
    res.status(200).json({success: true, data: inquiries});
});

// Get a single inquiry by ID
const inquiryById = asyncHandler(async (req, res) => {
    const inquiry = await InquiryModel.findById(req.params.id);
    if (!inquiry) {
        return res.status(404).json({success: false, message: 'Inquiry not found'});
    }
    res.status(200).json({success: true, data: inquiry});
});

// Update an inquiry
const updateInquiry = asyncHandler(async (req, res) => {
    const inquiry = await InquiryModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if (!inquiry) {
        return res.status(404).json({success: false, message: 'Inquiry not found'});
    }
    res.status(200).json({success: true, data: inquiry, message: 'Inquiry updated successfully'});
});

// Delete an inquiry
const deleteInquiry = asyncHandler(async (req, res) => {
    const inquiry = await InquiryModel.findByIdAndDelete(req.params.id);
    if (!inquiry) {
        return res.status(404).json({success: false, message: 'Inquiry not found'});
    }
    res.status(200).json({success: true, message: 'Inquiry deleted successfully'});
});

module.exports = {createInquiry, inquirys, inquiryById, updateInquiry, deleteInquiry};
