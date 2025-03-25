const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const ParentCategory = require('../models/parent-category');
const Type = require('../models/type');

// Create a new type
const createType = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const {categoryID, subcategoryID} = req.params;

    if (!name) {
        return res.status(400).json({error: 'Type name is required'});
    }

    if (!mongoose.Types.ObjectId.isValid(categoryID) || !mongoose.Types.ObjectId.isValid(subcategoryID)) {
        return res.status(400).json({error: 'Invalid Category or Subcategory ID'});
    }

    const typeExist = await Type.exists({name, category: categoryID, subCategory: subcategoryID});
    if (typeExist) {
        return res.status(400).json({error: 'Type with this name already exists'});
    }

    const newType = await Type.create({name, category: categoryID, subCategory: subcategoryID});
    res.status(201).json({data: newType, message: 'Type created successfully'});
});

// Get all types with category and subcategory populated
const allTypes = asyncHandler(async (req, res) => {
    const {subcategoryID} = req.params;

    const types = await Type.find({subCategory: subcategoryID})
        .populate('subCategory', 'name');
    res.status(200).json({data: types});
});

// Get a single type by ID
const typeById = asyncHandler(async (req, res) => {
    const {typeID} = req.params;

    if (!mongoose.Types.ObjectId.isValid(typeID)) {
        return res.status(400).json({error: 'Invalid Type ID'});
    }

    const typeData = await Type.findById(typeID)
        .populate('category', 'name')
        .populate('subCategory', 'name');

    if (!typeData) {
        return res.status(404).json({error: 'Type not found'});
    }

    res.status(200).json({data: typeData});
});

// Update type
const updateType = asyncHandler(async (req, res) => {
    const {typeID} = req.params;
    const {name, subcategoryID} = req.body;

    if (!mongoose.Types.ObjectId.isValid(typeID)) {
        return res.status(400).json({error: 'Invalid Type ID'});
    }

    if (subcategoryID && !mongoose.Types.ObjectId.isValid(subcategoryID)) {
        return res.status(400).json({error: 'Invalid Category or Subcategory ID'});
    }

    const updatedType = await Type.findByIdAndUpdate(
        typeID,
        {name, subCategory: subcategoryID},
        {new: true, runValidators: true}
    ).populate('subCategory', 'name');

    if (!updatedType) {
        return res.status(404).json({error: 'Type not found'});
    }

    res.status(200).json({data: updatedType, message: 'Type updated successfully'});
});

// Delete type
const deleteType = asyncHandler(async (req, res) => {
    const {typeID} = req.params;

    if (!mongoose.Types.ObjectId.isValid(typeID)) {
        return res.status(400).json({error: 'Invalid Type ID'});
    }

    const deletedType = await Type.findByIdAndDelete(typeID);
    if (!deletedType) {
        return res.status(404).json({error: 'Type not found'});
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

// Get all types with subcategory populated
const AllType = asyncHandler(async (req, res) => {
    const types = await Type.find().populate('subCategory', 'name');
    res.status(200).json({data: types});
});

module.exports = {
    createType,
    allTypes,
    typeById,
    updateType,
    deleteType,
    getAllCategoriesWithSubcategoriesAndTypes,
    AllType
};
