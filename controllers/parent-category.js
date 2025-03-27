const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const ParentCategory = require('../models/parent-category');
const Category = require('../models/category');
const Subcategory = require('../models/sub-category');
const Type = require('../models/type');
const Template = require('../models/template');

// Create a new parent category
const createParentCategory = asyncHandler(async (req, res) => {
    const {name} = req.body;

    if (!name) {
        return res.status(400).json({success: false, error: 'Name is required'});
    }

    const categoryExist = await ParentCategory.exists({name});
    if (categoryExist) {
        return res.status(400).json({success: false, error: 'Parent Category with this name already exists'});
    }

    const newCategory = await ParentCategory.create({name});
    res.status(201).json({success: true, data: newCategory, message: 'Parent Category created successfully'});
});

// Read all parent categories
const allParentCategories = asyncHandler(async (req, res) => {
    const categories = await ParentCategory.find();
    res.status(200).json({success: true, data: categories});
});

// Read a single parent category by ID
const parentCategoryById = asyncHandler(async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success: false, error: 'Invalid category ID'});
    }

    const category = await ParentCategory.findById(id);
    if (!category) {
        return res.status(404).json({success: false, error: 'Parent Category not found'});
    }

    res.status(200).json({success: true, data: category});
});

// Update a parent category
const updateParentCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success: false, error: 'Invalid category ID'});
    }

    const updatedCategory = await ParentCategory.findByIdAndUpdate(
        id,
        {name},
        {new: true, runValidators: true}
    );

    if (!updatedCategory) {
        return res.status(404).json({success: false, error: 'Parent Category not found'});
    }

    res.status(200).json({success: true, data: updatedCategory, message: 'Parent Category updated successfully'});
});

// Delete a parent category and all related data
const deleteParentCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success: false, error: 'Invalid category ID'});
    }

    const categories = await Category.find({parentCategory: id});

    const subCategoryIds = [];
    const typeIds = [];

    for (const category of categories) {
        const subCategories = await Subcategory.find({category: category._id});
        subCategoryIds.push(...subCategories.map(sub => sub._id));

        const types = await Type.find({subCategory: {$in: subCategoryIds}});
        typeIds.push(...types.map(type => type._id));
    }

    await Template.deleteMany({type: {$in: typeIds}});
    await Type.deleteMany({_id: {$in: typeIds}});
    await Subcategory.deleteMany({_id: {$in: subCategoryIds}});
    await Category.deleteMany({parentCategory: id});

    const deletedCategory = await ParentCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
        return res.status(404).json({success: false, error: 'Parent Category not found'});
    }

    res.status(200).json({message: 'Parent Category and all related data deleted successfully'});
});

// Get all categories with optional parent category population
const AllParentCategory = asyncHandler(async (req, res) => {
    const categories = await ParentCategory.find().populate('parentCategory');
    res.status(200).json({success: true, data: categories});
});

module.exports = {
    createParentCategory,
    allParentCategories,
    parentCategoryById,
    updateParentCategory,
    deleteParentCategory,
    AllParentCategory
};
