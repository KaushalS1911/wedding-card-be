const Template = require('../models/template');
const {uploadFile} = require('../services/uploadfile');
const asyncHandler = require('express-async-handler');

// Helper function to upload images
const uploadImagesForColor = async (color, files) => {
    if (!files || !files[color.color]) return color.product_images;

    try {
        const uploadedImages = await Promise.all(
            files[color.color].map(async (file) => await uploadFile(file.buffer))
        );
        return [...color.product_images, ...uploadedImages];
    } catch (error) {
        throw new Error(`Error uploading images for color ${color.color}`);
    }
};

// Create Template
const createTemplate = asyncHandler(async (req, res) => {
    const {
        name,
        category,
        subcategory,
        type,
        desc,
        tags = [],
        colors,
        size,
        templateType,
        template_theme,
        orientation,
        count,
        template_photo,
        isFavorite,
        isPremium
    } = req.body;

    if (!name || !category || !subcategory || !type || !desc || !colors || !size || !templateType || !template_theme || !orientation) {
        return res.status(400).json({error: 'All fields are required.'});
    }

    let parsedColors;
    try {
        parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
        if (!Array.isArray(parsedColors)) throw new Error();
    } catch (error) {
        return res.status(400).json({error: 'Invalid color data format.'});
    }

    try {
        const updatedColors = await Promise.all(
            parsedColors.map(async (color) => {
                if (!color.color || !color.hex || !Array.isArray(color.product_images)) {
                    throw new Error('Invalid color data.');
                }
                color.product_images = await uploadImagesForColor(color, req.files);
                return color;
            })
        );

        const template = new Template({
            name,
            category,
            subcategory,
            type,
            desc,
            tags,
            colors: updatedColors,
            size,
            templateType,
            template_theme,
            orientation,
            count: count || 0,
            template_photo: template_photo || false,
            isFavorite: isFavorite || false,
            isPremium: isPremium || false
        });

        await template.save();
        res.status(201).json({data: template, message: 'Template created successfully'});
    } catch (error) {
        console.error('Error creating template:', error.message);
        res.status(500).json({error: error.message || 'Failed to create template'});
    }
});

// Update Template
const updateTemplate = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {
        name,
        category,
        subcategory,
        type,
        desc,
        tags,
        colors,
        size,
        templateType,
        template_theme,
        orientation,
        count,
        template_photo,
        isFavorite,
        isPremium
    } = req.body;

    const template = await Template.findById(id);
    if (!template) {
        return res.status(404).json({error: 'Template not found'});
    }

    if (name) template.name = name;
    if (category) template.category = category;
    if (subcategory) template.subcategory = subcategory;
    if (type) template.type = type;
    if (desc) template.desc = desc;
    if (tags) template.tags = tags;
    if (size) template.size = size;
    if (templateType) template.templateType = templateType;
    if (template_theme) template.template_theme = template_theme;
    if (orientation) template.orientation = orientation;
    if (count !== undefined) template.count = count;
    if (template_photo !== undefined) template.template_photo = template_photo;
    if (isFavorite !== undefined) template.isFavorite = isFavorite;
    if (isPremium !== undefined) template.isPremium = isPremium;

    if (colors) {
        let parsedColors;
        try {
            parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
            if (!Array.isArray(parsedColors)) throw new Error();
        } catch (error) {
            return res.status(400).json({error: 'Invalid color data format.'});
        }

        try {
            const updatedColors = await Promise.all(
                parsedColors.map(async (color) => {
                    if (!color.color || !color.hex || !Array.isArray(color.product_images)) {
                        throw new Error('Invalid color data.');
                    }
                    color.product_images = await uploadImagesForColor(color, req.files);
                    return color;
                })
            );

            template.colors = updatedColors;
        } catch (error) {
            console.error('Error updating color images:', error.message);
            return res.status(500).json({error: error.message});
        }
    }

    await template.save();
    res.status(200).json({data: template, message: 'Template updated successfully'});
});

// Get All Templates
const getAllTemplates = asyncHandler(async (req, res) => {
    try {
        const {template_theme, isPremium, color, template_photo, orientation, isFavorite, sortBy} = req.query;

        let filter = {};

        if (template_theme) {
            filter.template_theme = template_theme;
        }

        if (isPremium !== undefined) {
            filter.isPremium = isPremium === 'true';
        }

        if (color) {
            filter['colors.color'] = color;
        }

        if (template_photo !== undefined) {
            filter.template_photo = template_photo === 'true';
        }

        if (orientation) {
            filter.orientation = orientation;
        }

        if (isFavorite !== undefined) {
            filter.isFavorite = isFavorite === 'true';
        }

        let sortOptions = {};
        if (sortBy === 'most_popular') {
            sortOptions.count = -1;
        }

        const templates = await Template.find(filter)
            .populate('category', 'name')
            .populate('subcategory', 'name')
            .populate('type', 'name')
            .sort(sortOptions);

        res.status(200).json({data: templates});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Get Template By ID
const getTemplateById = asyncHandler(async (req, res) => {
    const template = await Template.findById(req.params.id)
        .populate('category', 'name')
        .populate('subcategory', 'name')
        .populate('type', 'name');

    if (!template) return res.status(404).json({error: 'Template not found'});
    res.status(200).json({data: template});
});

// Delete Template
const deleteTemplate = asyncHandler(async (req, res) => {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) return res.status(404).json({error: 'Template not found'});
    res.status(200).json({message: 'Template deleted successfully'});
});

module.exports = {createTemplate, updateTemplate, getAllTemplates, getTemplateById, deleteTemplate};
