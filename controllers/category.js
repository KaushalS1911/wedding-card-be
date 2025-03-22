const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const ParentCategory = require('../models/parentCategory');

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
    const {name, parentCategory} = req.body;

    const categoryExist = await Category.exists({name});
    if (categoryExist) throw new Error('Category with this name already exists');

    if (parentCategory) {
        const parentExist = await ParentCategory.findById(parentCategory);
        if (!parentExist) throw new Error('Parent Category not found');
    }

    const newCategory = await Category.create({name, parentCategory});

    res.status(201).json({data: newCategory, message: 'Category created successfully'});
});

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().populate('parentCategory', 'name');
    res.status(200).json(categories);
});

// Get a single category by ID
const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id).populate('parentCategory', 'name');
    if (!category) throw new Error('Category not found');
    res.status(200).json(category);
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
    const {parentCategory} = req.body;

    if (parentCategory) {
        const parentExist = await ParentCategory.findById(parentCategory);
        if (!parentExist) throw new Error('Parent Category not found');
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).populate('parentCategory', 'name');
    if (!category) throw new Error('Category not found');
    res.status(200).json({data: category, message: 'Category updated successfully'});
});

// Delete category
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new Error('Category not found');
    res.status(200).json({message: 'Category deleted successfully'});
});

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
