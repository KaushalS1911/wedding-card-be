const asyncHandler = require('express-async-handler');
const UserTemplateModel = require('../models/user-template');

// Create
const createUserTemplate = asyncHandler(async (req, res) => {
    const {user_id, template_id, edited_object} = req.body;

    const existing = await UserTemplateModel.findOne({user_id, template_id});
    if (existing) {
        return res.status(400).json({
            success: false,
            message: 'UserTemplate already exists for this user and template',
        });
    }

    const newUserTemplate = await UserTemplateModel.create({
        user_id,
        template_id,
        edited_object,
    });

    res.status(201).json({
        success: true,
        data: newUserTemplate,
        message: 'UserTemplate created successfully',
    });
});

// Get all
const allUserTemplates = asyncHandler(async (req, res) => {
    const templates = await UserTemplateModel.find()
        .populate('user_id')
        .populate('template_id');
    res.status(200).json({success: true, data: templates});
});

// Get one by ID
const userTemplateById = asyncHandler(async (req, res) => {
    const template = await UserTemplateModel.findById(req.params.id)
        .populate('user_id')
        .populate('template_id');

    if (!template) {
        return res
            .status(404)
            .json({success: false, message: 'UserTemplate not found'});
    }

    res.status(200).json({success: true, data: template});
});

// Update
const updateUserTemplate = asyncHandler(async (req, res) => {
    const updatedTemplate = await UserTemplateModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    );

    if (!updatedTemplate) {
        return res
            .status(404)
            .json({success: false, message: 'UserTemplate not found'});
    }

    res.status(200).json({
        success: true,
        data: updatedTemplate,
        message: 'UserTemplate updated successfully',
    });
});

// Delete
const deleteUserTemplate = asyncHandler(async (req, res) => {
    const deleted = await UserTemplateModel.findByIdAndDelete(req.params.id);

    if (!deleted) {
        return res
            .status(404)
            .json({success: false, message: 'UserTemplate not found'});
    }

    res
        .status(200)
        .json({success: true, message: 'UserTemplate deleted successfully'});
});

// Get all by user_id
const userTemplatesByUserId = asyncHandler(async (req, res) => {
    const templates = await UserTemplateModel.find({
        user_id: req.params.userId,
    }).populate('template_id');

    res.status(200).json({success: true, data: templates});
});

module.exports = {
    createUserTemplate,
    allUserTemplates,
    userTemplateById,
    updateUserTemplate,
    deleteUserTemplate,
    userTemplatesByUserId,
};
