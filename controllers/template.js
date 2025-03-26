const Template = require('../models/template');
const {uploadFile} = require('../services/uploadfile');
const asyncHandler = require('express-async-handler');

// Helper function to upload images
const uploadImageForColor = async (color, file) => {
    if (!file) return color.templateImages || '';

    try {
        const uploadedImage = await uploadFile(file.buffer);
        return uploadedImage || color.templateImages || '';
    } catch (error) {
        throw new Error(`Error uploading image for color ${color.color}: ${error.message}`);
    }
};

// Create Template
const createTemplate = asyncHandler(async (req, res) => {
    const {
        name,
        type,
        desc,
        tags = [],
        colors,
        size,
        templateType,
        templateTheme,
        orientation,
        count,
        templatePhoto,
        isFavorite,
        isPremium
    } = req.body;

    if (!name || !type || !desc || !colors || !size || !templateType || !templateTheme || !orientation) {
        return res.status(400).json({error: 'All fields are required.'});
    }

    let parsedColors;
    try {
        parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
        if (!Array.isArray(parsedColors)) throw new Error('Invalid color data format.');
    } catch (error) {
        return res.status(400).json({error: error.message});
    }

    try {
        const files = req.files || [];
        const updatedColors = await Promise.all(parsedColors.map(async (color, index) => {
            if (!color.color || !color.hex) {
                throw new Error('Invalid color data.');
            }

            const colorFile = files.find(file => file.fieldname === `templateImages[${index}]`);
            const uploadedImage = await uploadImageForColor(color, colorFile);

            return {...color, templateImages: uploadedImage};
        }));

        const template = new Template({
            name,
            type,
            desc,
            tags,
            colors: updatedColors,
            size,
            templateType,
            templateTheme,
            orientation,
            count: count || 0,
            templatePhoto: templatePhoto || false,
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
        type,
        desc,
        tags,
        size,
        templateType,
        templateTheme,
        orientation,
        count,
        templatePhoto,
        isFavorite,
        isPremium
    } = req.body;

    const template = await Template.findById(id);
    if (!template) {
        return res.status(404).json({error: 'Template not found'});
    }

    Object.assign(template, {
        name,
        type,
        desc,
        tags,
        size,
        templateType,
        templateTheme,
        orientation,
        count,
        templatePhoto,
        isFavorite,
        isPremium
    });

    try {
        const files = req.files || [];
        if (files.length > 0) {
            const updatedColors = await Promise.all(template.colors.map(async (color, index) => {
                const colorFile = files.find(file => file.fieldname === `templateImages[${index}]`);

                const uploadedImage = colorFile ? await uploadImageForColor(color, colorFile) : color.templateImages;

                return {...color, templateImages: uploadedImage};
            }));

            template.colors = updatedColors;
        }
    } catch (error) {
        console.error('Error updating color images:', error.message);
        return res.status(500).json({error: error.message});
    }

    await template.save();
    res.status(200).json({data: template, message: 'Template updated successfully'});
});

// Get All Templates
const allTemplates = asyncHandler(async (req, res) => {
    try {
        const {templateTheme, isPremium, color, templatePhoto, orientation, isFavorite, sortBy} = req.query;

        let filter = {};

        if (templateTheme) {
            filter.templateTheme = templateTheme;
        }

        if (isPremium !== undefined) {
            filter.isPremium = isPremium === 'true';
        }

        if (color) {
            filter['colors.color'] = color;
        }

        if (templatePhoto !== undefined) {
            filter.templatePhoto = templatePhoto === 'true';
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
            .populate('type', 'name')
            .sort(sortOptions);

        res.status(200).json({data: templates});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Get Template By ID
const templateById = asyncHandler(async (req, res) => {
    const template = await Template.findById(req.params.id)
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

module.exports = {createTemplate, updateTemplate, allTemplates, templateById, deleteTemplate};
