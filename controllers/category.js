const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const ParentCategory = require('../models/parent-category');

// Create Category
const createCategory = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const {parentCategory} = req.params;

    if (!name) {
        return res.status(400).json({error: 'Category name is required'});
    }

    const categoryExist = await Category.exists({name});
    if (categoryExist) {
        return res.status(400).json({error: 'Category with this name already exists'});
    }

    let parentCategoryId = null;

    if (parentCategory) {
        if (!mongoose.Types.ObjectId.isValid(parentCategory)) {
            return res.status(400).json({error: 'Invalid Parent Category ID'});
        }

        const parentExist = await ParentCategory.findById(parentCategory);
        if (!parentExist) {
            return res.status(404).json({error: 'Parent Category not found'});
        }
        parentCategoryId = parentCategory;
    }

    const newCategory = await Category.create({name, parentCategory: parentCategoryId});
    res.status(201).json({data: newCategory, message: 'Category created successfully'});
});

// Get all categories
const allCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().populate('parentCategory', 'name');
    res.status(200).json({data: categories});
});

// Get a single category by ID
const categoryById = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({error: 'Invalid Category ID'});
    }

    const category = await Category.findById(req.params.id).populate('parentCategory', 'name');
    if (!category) {
        return res.status(404).json({error: 'Category not found'});
    }
    res.status(200).json({data: category});
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
    const {name, parentCategory} = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({error: 'Invalid Category ID'});
    }

    if (parentCategory && !mongoose.Types.ObjectId.isValid(parentCategory)) {
        return res.status(400).json({error: 'Invalid Parent Category ID'});
    }

    if (parentCategory) {
        const parentExist = await ParentCategory.findById(parentCategory);
        if (!parentExist) {
            return res.status(404).json({error: 'Parent Category not found'});
        }
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).populate('parentCategory', 'name');

    if (!category) {
        return res.status(404).json({error: 'Category not found'});
    }

    res.status(200).json({data: category, message: 'Category updated successfully'});
});

// Delete category
const deleteCategory = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({error: 'Invalid Category ID'});
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
        return res.status(404).json({error: 'Category not found'});
    }
    res.status(200).json({message: 'Category deleted successfully'});
});

module.exports = {
    createCategory,
    allCategories,
    categoryById,
    updateCategory,
    deleteCategory
};
