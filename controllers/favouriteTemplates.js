const asyncHandler = require('express-async-handler');
const FavouriteTemplate = require('../models/favouriteTemplates');
const Template = require('../models/template');

// Create Favourite Template
const createFavouriteTemplate = asyncHandler(async (req, res) => {
    const {user, template} = req.body;

    const exists = await FavouriteTemplate.exists({user, template});
    if (exists) throw new Error('Template already added to favourites');

    const newFavourite = await FavouriteTemplate.create(req.body);

    await Template.findByIdAndUpdate(template, {isFavorite: true});

    res.status(201).json({data: newFavourite, message: 'Template added to favourites successfully'});
});

// Get All Favourite Templates
const getFavouriteTemplates = asyncHandler(async (req, res) => {
    const {user} = req.params;

    const favourites = await FavouriteTemplate.find({user}).populate('template');
    res.status(200).json({data: favourites});
});

// Get Single Favourite Template
const getFavouriteTemplateById = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const favourite = await FavouriteTemplate.findById(id).populate('template');
    if (!favourite) throw new Error('Favourite template not found');

    res.status(200).json({data: favourite});
});

// Update Favourite Template
const updateFavouriteTemplate = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {user, template} = req.body;

    const favourite = await FavouriteTemplate.findById(id);
    if (!favourite) throw new Error('Favourite template not found');

    favourite.user = user || favourite.user;
    favourite.template = template || favourite.template;

    const updatedFavourite = await favourite.save();

    res.status(200).json({data: updatedFavourite, message: 'Favourite template updated successfully'});
});

// Delete Favourite Template
const deleteFavouriteTemplate = asyncHandler(async (req, res) => {
    const {id} = req.params;

    const favourite = await FavouriteTemplate.findById(id);
    if (!favourite) throw new Error('Favourite not found');

    await Template.findByIdAndUpdate(favourite.template, {isFavorite: false});

    await favourite.deleteOne();
    res.status(200).json({message: 'Favourite template removed successfully'});
});

module.exports = {
    createFavouriteTemplate,
    getFavouriteTemplates,
    getFavouriteTemplateById,
    updateFavouriteTemplate,
    deleteFavouriteTemplate,
};
