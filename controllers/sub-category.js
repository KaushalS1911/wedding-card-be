const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Subcategory = require('../models/sub-category');
const Category = require('../models/category');
const Type = require('../models/type');
const Template = require('../models/template');

// Create a new subcategory
const createSubcategory = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const {categoryID} = req.params;

    if (!name) {
        return res.status(400).json({error: 'Subcategory name is required'});
    }

    if (!mongoose.Types.ObjectId.isValid(categoryID)) {
        return res.status(400).json({error: 'Invalid Category ID'});
    }

    const categoryExists = await Category.findById(categoryID);
    if (!categoryExists) {
        return res.status(404).json({error: 'Category not found'});
    }

    const subcategoryExist = await Subcategory.exists({name, category: categoryID});
    if (subcategoryExist) {
        return res.status(400).json({error: 'Subcategory with this name already exists in this category'});
    }

    const newSubcategory = await Subcategory.create({name, category: categoryID});
    res.status(201).json({data: newSubcategory, message: 'Subcategory created successfully'});
});

// Get all subcategories with category populated
const allSubcategories = asyncHandler(async (req, res) => {
    const {categoryID} = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryID)) {
        return res.status(400).json({error: 'Invalid Category ID'});
    }

    const subcategories = await Subcategory.find({category: categoryID}).populate('category', 'name');
    res.status(200).json({data: subcategories});
});

// Get a single subcategory by ID with category populated
const subcategoryById = asyncHandler(async (req, res) => {
    const {subcategory} = req.params;

    if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return res.status(400).json({error: 'Invalid Subcategory ID'});
    }

    const subcategoryData = await Subcategory.findById(subcategory).populate('category', 'name');
    if (!subcategoryData) {
        return res.status(404).json({error: 'Subcategory not found'});
    }
    res.status(200).json({data: subcategoryData});
});

// Update subcategory
const updateSubcategory = asyncHandler(async (req, res) => {
    const {subcategory, categoryID} = req.params;
    const {name, newCategory} = req.body;

    if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return res.status(400).json({error: 'Invalid Subcategory ID'});
    }

    if (newCategory && !mongoose.Types.ObjectId.isValid(newCategory)) {
        return res.status(400).json({error: 'Invalid Category ID'});
    }

    if (newCategory) {
        const categoryExists = await Category.findById(newCategory);
        if (!categoryExists) {
            return res.status(404).json({error: 'Category not found'});
        }
    }

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
        subcategory,
        {name, category: newCategory || categoryID},
        {new: true, runValidators: true}
    ).populate('category', 'name');

    if (!updatedSubcategory) {
        return res.status(404).json({error: 'Subcategory not found'});
    }

    res.status(200).json({data: updatedSubcategory, message: 'Subcategory updated successfully'});
});

// Delete subcategory
const deleteSubcategory = asyncHandler(async (req, res) => {
    const {subcategory} = req.params;

    if (!mongoose.Types.ObjectId.isValid(subcategory)) {
        return res.status(400).json({error: 'Invalid Subcategory ID'});
    }

    const types = await Type.find({subCategory: subcategory});
    const typeIds = types.map(type => type._id);

    await Template.deleteMany({type: {$in: typeIds}});

    await Type.deleteMany({_id: {$in: typeIds}});

    const deletedSubcategory = await Subcategory.findByIdAndDelete(subcategory);
    if (!deletedSubcategory) {
        return res.status(404).json({error: 'Subcategory not found'});
    }

    res.status(200).json({message: 'Subcategory and all related data deleted successfully'});
});

// Get all subcategories with category population
const AllSubcategory = asyncHandler(async (req, res) => {
    const subcategories = await Subcategory.find().populate('category', 'name');
    res.status(200).json({data: subcategories});
});

module.exports = {
    createSubcategory,
    allSubcategories,
    subcategoryById,
    updateSubcategory,
    deleteSubcategory,
    AllSubcategory
};
