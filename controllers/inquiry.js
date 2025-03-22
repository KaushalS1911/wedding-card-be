const asyncHandler = require('express-async-handler');
const InquiryModel = require('../models/inquiry');

// Create inquiry
const createInquiry = asyncHandler(async (req, res) => {
    const {email} = req.body;

    const inquiryExist = await InquiryModel.exists({email});
    if (inquiryExist) throw new Error('Inquiry with this email already exists');

    const newInquiry = await InquiryModel.create(req.body);

    res.status(201).json({data: newInquiry, message: 'Inquiry created successfully'});
});

// Get all inquirys
const inquirys = asyncHandler(async (req, res) => {
    const inquirys = await InquiryModel.find({});
    res.status(200).json({data: inquirys});
});

// Get a single inquiry by ID
const inquiryById = asyncHandler(async (req, res) => {
    const inquiry = await InquiryModel.findById(req.params.id);
    if (!inquiry) throw new Error('Inquiry not found');

    res.status(200).json({data: inquiry});
});

// Update a inquiry
const updateInquiry = asyncHandler(async (req, res) => {
    const inquiry = await InquiryModel.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    if (!inquiry) throw new Error('Inquiry not found');

    res.status(200).json({data: inquiry, message: 'Inquiry updated successfully'});
});

// Delete a inquiry
const deleteInquiry = asyncHandler(async (req, res) => {
    const inquiry = await InquiryModel.findByIdAndDelete(req.params.id);
    if (!inquiry) throw new Error('Inquiry not found');

    res.status(200).json({message: 'Inquiry deleted successfully'});
});

module.exports = {createInquiry, inquirys, inquiryById, updateInquiry, deleteInquiry};
