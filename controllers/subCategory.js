const asyncHandler = require('express-async-handler');
const Subcategory = require('../models/subCategory');
const Category = require('../models/category');

// Create a new subcategory
const createSubcategory = asyncHandler(async (req, res) => {
    const {name, category} = req.body;

    if (!name || !category) {
        return res.status(400).json({message: 'Name and category are required'});
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        return res.status(404).json({message: 'Category not found'});
    }

    const subcategoryExist = await Subcategory.exists({name, category});
    if (subcategoryExist) {
        return res.status(400).json({message: 'Subcategory with this name already exists in this category'});
    }

    const newSubcategory = await Subcategory.create(req.body);
    res.status(201).json({data: newSubcategory, message: 'Subcategory created successfully'});
});

// Get all subcategories with category populated
const getAllSubcategories = asyncHandler(async (req, res) => {
    const subcategories = await Subcategory.find().populate('category');
    res.status(200).json(subcategories);
});

// Get a single subcategory by ID with category populated
const getSubcategoryById = asyncHandler(async (req, res) => {
    const subcategory = await Subcategory.findById(req.params.id).populate('category');
    if (!subcategory) {
        return res.status(404).json({message: 'Subcategory not found'});
    }
    res.status(200).json(subcategory);
});

// Update subcategory
const updateSubcategory = asyncHandler(async (req, res) => {
    const {name, category} = req.body;

    if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({message: 'Category not found'});
        }
    }

    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).populate('category');

    if (!subcategory) {
        return res.status(404).json({message: 'Subcategory not found'});
    }

    res.status(200).json({data: subcategory, message: 'Subcategory updated successfully'});
});

// Delete subcategory
const deleteSubcategory = asyncHandler(async (req, res) => {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
        return res.status(404).json({message: 'Subcategory not found'});
    }
    res.status(200).json({message: 'Subcategory deleted successfully'});
});

module.exports = {
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory,
};
