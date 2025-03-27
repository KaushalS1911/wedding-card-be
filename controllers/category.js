const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const ParentCategory = require('../models/parent-category');
const Category = require('../models/category');
const Subcategory = require('../models/sub-category');
const Type = require('../models/type');
const Template = require('../models/template');

// Create Category
const createCategory = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const {parentID} = req.params;

    if (!name) {
        return res.status(400).json({success: false, message: 'Category name is required.'});
    }

    if (!mongoose.Types.ObjectId.isValid(parentID)) {
        return res.status(400).json({success: false, message: 'Invalid Parent Category ID.'});
    }

    const parentExist = await ParentCategory.findById(parentID);
    if (!parentExist) {
        return res.status(404).json({success: false, message: 'Parent Category not found.'});
    }

    const categoryExist = await Category.exists({name, parentCategory: parentID});
    if (categoryExist) {
        return res.status(400).json({
            success: false,
            message: 'Category with this name already exists under the same Parent Category.'
        });
    }

    const newCategory = await Category.create({name, parentCategory: parentID});
    res.status(201).json({success: true, data: newCategory, message: 'Category created successfully.'});
});

// Get all categories under specific parent category
const allCategories = asyncHandler(async (req, res) => {
    const {parentID} = req.params;

    if (!mongoose.Types.ObjectId.isValid(parentID)) {
        return res.status(400).json({success: false, message: 'Invalid Parent Category ID.'});
    }

    const categories = await Category.find({parentCategory: parentID}).populate('parentCategory', 'name');
    res.status(200).json({success: true, data: categories});
});

// Get a single category by ID
const categoryById = asyncHandler(async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success: false, message: 'Invalid Category ID.'});
    }

    const category = await Category.findById(id).populate('parentCategory', 'name');
    if (!category) {
        return res.status(404).json({success: false, message: 'Category not found.'});
    }
    res.status(200).json({success: true, data: category});
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
    const {id, parentID} = req.params;
    const {name} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(parentID)) {
        return res.status(400).json({success: false, message: 'Invalid Category ID or Parent Category ID.'});
    }

    const parentExist = await ParentCategory.findById(parentID);
    if (!parentExist) {
        return res.status(404).json({success: false, message: 'Parent Category not found.'});
    }

    const category = await Category.findByIdAndUpdate(id, {name, parentCategory: parentID}, {
        new: true,
        runValidators: true
    }).populate('parentCategory', 'name');
    if (!category) {
        return res.status(404).json({success: false, message: 'Category not found.'});
    }

    res.status(200).json({success: true, data: category, message: 'Category updated successfully.'});
});

// Delete category
const deleteCategory = asyncHandler(async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success: false, message: 'Invalid Category ID.'});
    }

    const subCategories = await Subcategory.find({category: id});
    const subCategoryIds = subCategories.map(sub => sub._id);

    const types = await Type.find({subCategory: {$in: subCategoryIds}});
    const typeIds = types.map(type => type._id);

    await Template.deleteMany({type: {$in: typeIds}});
    await Type.deleteMany({_id: {$in: typeIds}});
    await Subcategory.deleteMany({_id: {$in: subCategoryIds}});

    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
        return res.status(404).json({success: false, message: 'Category not found.'});
    }

    res.status(200).json({success: true, message: 'Category and all related data deleted successfully.'});
});

// Get all categories
const AllCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find().populate('parentCategory', 'name');
    res.status(200).json({success: true, data: categories});
});

module.exports = {
    createCategory,
    allCategories,
    categoryById,
    updateCategory,
    deleteCategory,
    AllCategory
};
