const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const ParentCategory = require('../models/parent-category');
const Subcategory = require('../models/sub-category');
const Category = require('../models/category');
const Type = require('../models/type');

// Create a new type
const createType = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const {parentCategory, category, subcategory} = req.params;

    if (!name) {
        return res.status(400).json({message: 'Type name is required'});
    }

    if (!mongoose.Types.ObjectId.isValid(category) || !mongoose.Types.ObjectId.isValid(subcategory)) {
        return res.status(400).json({message: 'Invalid category or subcategory ID'});
    }

    const categoryExists = await Category.findById(category);
    const subcategoryExists = await Subcategory.findById(subcategory);

    if (!categoryExists) {
        return res.status(404).json({message: 'Category not found'});
    }
    if (!subcategoryExists) {
        return res.status(404).json({message: 'Subcategory not found'});
    }

    const typeExist = await Type.exists({name, category, subCategory: subcategory});
    if (typeExist) {
        return res.status(400).json({message: 'Type with this name already exists in this subcategory'});
    }

    const newType = await Type.create({name, category, subCategory: subcategory});
    res.status(201).json({data: newType, message: 'Type created successfully'});
});

// Get all types with category and subcategory populated
const allTypes = asyncHandler(async (req, res) => {
    const {category, subcategory} = req.params;

    const types = await Type.find({category, subcategory}).populate('category').populate('subcategory');
    res.status(200).json(types);
});

// Get a single type by ID with category and subcategory populated
const typeById = asyncHandler(async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: 'Invalid type ID'});
    }

    const type = await Type.findById(id).populate('category').populate('subcategory');
    if (!type) {
        return res.status(404).json({message: 'Type not found'});
    }
    res.status(200).json(type);
});

// Update type
const updateType = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {name, category, subcategory} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: 'Invalid type ID'});
    }

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({message: 'Invalid category ID'});
    }

    if (subcategory && !mongoose.Types.ObjectId.isValid(subcategory)) {
        return res.status(400).json({message: 'Invalid subcategory ID'});
    }

    const updatedType = await Type.findByIdAndUpdate(id, {name, category, subcategory}, {
        new: true,
        runValidators: true
    }).populate('category').populate('subcategory');

    if (!updatedType) {
        return res.status(404).json({message: 'Type not found'});
    }

    res.status(200).json({data: updatedType, message: 'Type updated successfully'});
});

// Delete type
const deleteType = asyncHandler(async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({message: 'Invalid type ID'});
    }

    const deletedType = await Type.findByIdAndDelete(id);
    if (!deletedType) {
        return res.status(404).json({message: 'Type not found'});
    }
    res.status(200).json({message: 'Type deleted successfully'});
});

// Get all categories with their subcategories and types
const getAllCategoriesWithSubcategoriesAndTypes = asyncHandler(async (req, res) => {
    try {
        const categories = await ParentCategory.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: 'parentCategory',
                    as: 'categories'
                }
            },
            {
                $unwind: {
                    path: '$categories',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'categories._id',
                    foreignField: 'category',
                    as: 'categories.subcategories'
                }
            },
            {
                $unwind: {
                    path: '$categories.subcategories',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'types',
                    localField: 'categories.subcategories._id',
                    foreignField: 'subCategory',
                    as: 'categories.subcategories.types'
                }
            },
            {
                $group: {
                    _id: '$_id',
                    name: {$first: '$name'},
                    categories: {
                        $push: '$categories'
                    }
                }
            }
        ]);

        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories with subcategories and types:', error);
        res.status(500).json({message: 'Internal server error'});
    }
});

module.exports = {
    createType,
    allTypes,
    typeById,
    updateType,
    deleteType,
    getAllCategoriesWithSubcategoriesAndTypes
};
