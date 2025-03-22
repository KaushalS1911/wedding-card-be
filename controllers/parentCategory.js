const asyncHandler = require('express-async-handler');
const ParentCategory = require('../models/parentCategory');

// Create a new parent category
const createParentCategory = asyncHandler(async (req, res) => {
    const {name, status} = req.body;

    const categoryExist = await ParentCategory.exists({name});
    if (categoryExist) throw new Error('Parent Category with this name already exists');

    const newCategory = await ParentCategory.create({name, status});

    res.status(201).json({data: newCategory, message: 'Parent Category created successfully'});
});

// Read all parent categories
const getAllParentCategories = asyncHandler(async (req, res) => {
    const categories = await ParentCategory.find();
    res.status(200).json({data: categories});
});

// Read a single parent category by ID
const getParentCategoryById = asyncHandler(async (req, res) => {
    const category = await ParentCategory.findById(req.params.id);
    if (!category) throw new Error('Parent Category not found');
    res.status(200).json({data: category});
});

// Update a parent category
const updateParentCategory = asyncHandler(async (req, res) => {
    const {name, status} = req.body;
    const updatedCategory = await ParentCategory.findByIdAndUpdate(
        req.params.id,
        {name, status},
        {new: true, runValidators: true}
    );
    if (!updatedCategory) throw new Error('Parent Category not found');
    res.status(200).json({data: updatedCategory, message: 'Parent Category updated successfully'});
});

// Delete a parent category
const deleteParentCategory = asyncHandler(async (req, res) => {
    const deletedCategory = await ParentCategory.findByIdAndDelete(req.params.id);
    if (!deletedCategory) throw new Error('Parent Category not found');
    res.status(200).json({message: 'Parent Category deleted successfully'});
});

module.exports = {
    createParentCategory,
    getAllParentCategories,
    getParentCategoryById,
    updateParentCategory,
    deleteParentCategory
};
