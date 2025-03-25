const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const ParentCategory = require('../models/parent-category');
const Category = require('../models/category');
const Subcategory = require('../models/sub-category');
const Type = require('../models/type');

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

    const categories = await Category.find({parentCategory: req.params.id});

    const subCategoryIds = [];
    for (const category of categories) {
        const subCategories = await Subcategory.find({category: category._id});
        subCategoryIds.push(...subCategories.map(sub => sub._id));
    }

    await Type.deleteMany({subCategory: {$in: subCategoryIds}});

    await Subcategory.deleteMany({_id: {$in: subCategoryIds}});

    await Category.deleteMany({parentCategory: req.params.id});

    const deletedCategory = await ParentCategory.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
        return res.status(404).json({error: 'Parent Category not found'});
    }

    res.status(200).json({message: 'Parent Category and all related data deleted successfully'});
});

// Get all categories with optional parent category population
const AllParentCategory = asyncHandler(async (req, res) => {
    const categories = await ParentCategory.find();
    res.status(200).json({data: categories});
});

module.exports = {
    createParentCategory,
    allParentCategories,
    parentCategoryById,
    updateParentCategory,
    deleteParentCategory,
    AllParentCategory
};
