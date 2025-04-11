const asyncHandler = require('express-async-handler');
const FavouriteTemplate = require('../models/favourite-templates');
const Template = require('../models/template');

// Create Favourite Template
const createFavouriteTemplate = asyncHandler(async (req, res) => {
    const {user, template} = req.body;

    const exists = await FavouriteTemplate.exists({user, template});
    if (exists) {
        return res.status(400).json({success: false, message: 'Template already added to favourites'});
    }

    const newFavourite = await FavouriteTemplate.create(req.body);

    await Template.findByIdAndUpdate(template, {
        $addToSet: {templateLiked: user},
    });

    res.status(201).json({
        success: true,
        data: newFavourite,
        message: 'Template added to favourites successfully',
    });
});

// Get All Favourite Templates
const favouriteTemplates = asyncHandler(async (req, res) => {
    const {user} = req.params;

    const favourites = await FavouriteTemplate.find({user}).populate('template');

    res.status(200).json({success: true, data: favourites});
});

// Get Single Favourite Template
const favouriteTemplateById = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const favourite = await FavouriteTemplate.findById(id).populate('template');
    if (!favourite) {
        return res.status(404).json({success: false, message: 'Favourite template not found'});
    }

    res.status(200).json({success: true, data: favourite});
});

// Update Favourite Template
const updateFavouriteTemplate = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {user, template} = req.body;

    const favourite = await FavouriteTemplate.findById(id);
    if (!favourite) {
        return res.status(404).json({success: false, message: 'Favourite template not found'});
    }

    if (user) favourite.user = user;
    if (template) favourite.template = template;

    const updatedFavourite = await favourite.save();

    res.status(200).json({success: true, data: updatedFavourite, message: 'Favourite template updated successfully'});
});

// Delete Favourite Template
const deleteFavouriteTemplate = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const favourite = await FavouriteTemplate.findById(id);
    if (!favourite) {
        return res.status(404).json({success: false, message: 'Favourite not found'});
    }

    await Template.findByIdAndUpdate(favourite.template, {
        $pull: {templateLiked: favourite.user},
    });

    const stillLiked = await FavouriteTemplate.exists({template: favourite.template});
    if (!stillLiked) {
        await Template.findByIdAndUpdate(favourite.template, {isFavorite: false});
    }

    await favourite.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Favourite template removed successfully',
    });
});

module.exports = {
    createFavouriteTemplate,
    favouriteTemplateById,
    favouriteTemplates,
    updateFavouriteTemplate,
    deleteFavouriteTemplate,
};
