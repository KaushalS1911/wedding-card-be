const asyncHandler = require('express-async-handler');
const Category = require('../models/category');
const Subcategory = require('../models/subCategory');
const Type = require('../models/type');

// Create a new type
const createType = asyncHandler(async (req, res) => {
    const {name, category, subcategory} = req.body;

    if (!name || !category || !subcategory) {
        return res.status(400).json({message: 'Name, category, and subcategory are required'});
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        return res.status(404).json({message: 'Category not found'});
    }

    const subcategoryExists = await Subcategory.findById(subcategory);
    if (!subcategoryExists) {
        return res.status(404).json({message: 'Subcategory not found'});
    }

    const typeExist = await Type.exists({name, category, subcategory});
    if (typeExist) {
        return res.status(400).json({message: 'Type with this name already exists in this subcategory'});
    }

    const newType = await Type.create(req.body);
    res.status(201).json({data: newType, message: 'Type created successfully'});
});

// Get all types with category and subcategory populated
const getAllTypes = asyncHandler(async (req, res) => {
    const types = await Type.find().populate('category').populate('subcategory');
    res.status(200).json(types);
});

// Get a single type by ID with category and subcategory populated
const getTypeById = asyncHandler(async (req, res) => {
    const type = await Type.findById(req.params.id).populate('category').populate('subcategory');
    if (!type) {
        return res.status(404).json({message: 'Type not found'});
    }
    res.status(200).json(type);
});

// Update type
const updateType = asyncHandler(async (req, res) => {
    const {name, category, subcategory} = req.body;

    if (category) {
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(404).json({message: 'Category not found'});
        }
    }

    if (subcategory) {
        const subcategoryExists = await Subcategory.findById(subcategory);
        if (!subcategoryExists) {
            return res.status(404).json({message: 'Subcategory not found'});
        }
    }

    const type = await Type.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).populate('category').populate('subcategory');

    if (!type) {
        return res.status(404).json({message: 'Type not found'});
    }

    res.status(200).json({data: type, message: 'Type updated successfully'});
});

// Delete type
const deleteType = asyncHandler(async (req, res) => {
    const type = await Type.findByIdAndDelete(req.params.id);
    if (!type) {
        return res.status(404).json({message: 'Type not found'});
    }
    res.status(200).json({message: 'Type deleted successfully'});
});

// Get all categories with their subcategories and types
const getAllCategoriesWithSubcategoriesAndTypes = asyncHandler(async (req, res) => {
    const categories = await Category.aggregate([
        {
            $lookup: {
                from: 'parentcategories',
                localField: 'parentCategory',
                foreignField: '_id',
                as: 'parentCategory'
            }
        },
        {
            $unwind: {
                path: '$parentCategory',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'subcategories',
                localField: '_id',
                foreignField: 'category',
                as: 'subcategories'
            }
        },
        {
            $unwind: {
                path: '$subcategories',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'types',
                localField: 'subcategories._id',
                foreignField: 'subcategory',
                as: 'subcategories.types'
            }
        },
        {
            $group: {
                _id: '$_id',
                name: {$first: '$name'},
                parentCategory: {$first: '$parentCategory'},
                createdAt: {$first: '$createdAt'},
                subcategories: {$push: '$subcategories'}
            }
        }
    ]);

    res.status(200).json(categories);
});


module.exports = {
    createType,
    getAllTypes,
    getTypeById,
    updateType,
    deleteType,
    getAllCategoriesWithSubcategoriesAndTypes
};
