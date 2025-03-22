const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const ParentCategory = require('../models/parent-category');

// Create a new parent category
const createParentCategory = asyncHandler(async (req, res) => {
    const {name} = req.body;

    if (!name) {
        return res.status(400).json({error: 'Name is required'});
    }

    const categoryExist = await ParentCategory.exists({name});
    if (categoryExist) {
        return res.status(400).json({error: 'Parent Category with this name already exists'});
    }

    const newCategory = await ParentCategory.create({name});
    res.status(201).json({data: newCategory, message: 'Parent Category created successfully'});
});

// Read all parent categories
const allParentCategories = asyncHandler(async (req, res) => {
    const categories = await ParentCategory.find();
    res.status(200).json({data: categories});
});

// Read a single parent category by ID
const parentCategoryById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({error: 'Invalid category ID'});
    }

    const category = await ParentCategory.findById(req.params.id);
    if (!category) {
        return res.status(404).json({error: 'Parent Category not found'});
    }
    res.status(200).json({data: category});
});

// Update a parent category
const updateParentCategory = asyncHandler(async (req, res) => {
    const {name} = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({error: 'Invalid category ID'});
    }

    const updatedCategory = await ParentCategory.findByIdAndUpdate(
        req.params.id,
        {name},
        {new: true, runValidators: true}
    );

    if (!updatedCategory) {
        return res.status(404).json({error: 'Parent Category not found'});
    }

    res.status(200).json({data: updatedCategory, message: 'Parent Category updated successfully'});
});

// Delete a parent category
const deleteParentCategory = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({error: 'Invalid category ID'});
    }

    const deletedCategory = await ParentCategory.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
        return res.status(404).json({error: 'Parent Category not found'});
    }

    res.status(200).json({message: 'Parent Category deleted successfully'});
});

module.exports = {
    createParentCategory,
    allParentCategories,
    parentCategoryById,
    updateParentCategory,
    deleteParentCategory
};
