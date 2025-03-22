const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Subcategory = require('../models/sub-category');
const Category = require('../models/category');

// Create a new subcategory
const createSubcategory = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const {parentCategory, category} = req.params;

    if (!name) {
        return res.status(400).json({message: 'Subcategory name is required'});
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({message: 'Invalid category ID'});
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        return res.status(404).json({message: 'Category not found'});
    }

    const subcategoryExist = await Subcategory.exists({name, category});
    if (subcategoryExist) {
        return res.status(400).json({message: 'Subcategory with this name already exists in this category'});
    }

    const newSubcategory = await Subcategory.create({name, category});
    res.status(201).json({data: newSubcategory, message: 'Subcategory created successfully'});
});

// Get all subcategories with category populated
const allSubcategories = asyncHandler(async (req, res) => {
    const {category} = req.params;

    if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({message: 'Invalid category ID'});
    }

    const subcategories = await Subcategory.find({category}).populate('category');
    res.status(200).json(subcategories);
});

// Get a single subcategory by ID with category populated
const subcategoryById = asyncHandler(async (req, res) => {
    const {subcategory} = req.params;

    if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return res.status(400).json({message: 'Invalid subcategory ID'});
    }

    const subcategoryData = await Subcategory.findById(subcategory).populate('category');
    if (!subcategoryData) {
        return res.status(404).json({message: 'Subcategory not found'});
    }
    res.status(200).json(subcategoryData);
});

// Update subcategory
const updateSubcategory = asyncHandler(async (req, res) => {
    const {subcategory, category} = req.params;
    const {name, newCategory} = req.body;

    if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return res.status(400).json({message: 'Invalid subcategory ID'});
    }

    if (newCategory && !mongoose.Types.ObjectId.isValid(newCategory)) {
        return res.status(400).json({message: 'Invalid category ID'});
    }

    if (newCategory) {
        const categoryExists = await Category.findById(newCategory);
        if (!categoryExists) {
            return res.status(404).json({message: 'Category not found'});
        }
    }

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(subcategory, {
        name,
        category: newCategory || category
    }, {
        new: true,
        runValidators: true
    }).populate('category');

    if (!updatedSubcategory) {
        return res.status(404).json({message: 'Subcategory not found'});
    }

    res.status(200).json({data: updatedSubcategory, message: 'Subcategory updated successfully'});
});

// Delete subcategory
const deleteSubcategory = asyncHandler(async (req, res) => {
    const {subcategory} = req.params;

    if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return res.status(400).json({message: 'Invalid subcategory ID'});
    }

    const subcategoryData = await Subcategory.findByIdAndDelete(subcategory);
    if (!subcategoryData) {
        return res.status(404).json({message: 'Subcategory not found'});
    }
    res.status(200).json({message: 'Subcategory deleted successfully'});
});

module.exports = {
    createSubcategory,
    allSubcategories,
    subcategoryById,
    updateSubcategory,
    deleteSubcategory,
};
