const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const ParentCategory = require('../models/parent-category');
const Type = require('../models/type');
const Template = require('../models/template');

// Create a new type
const createType = asyncHandler(async (req, res) => {
    const {name} = req.body;
    const {categoryID, subcategoryID} = req.params;

    if (!name) {
        return res.status(400).json({success: false, error: 'Type name is required'});
    }

    if (!mongoose.isValidObjectId(categoryID) || !mongoose.isValidObjectId(subcategoryID)) {
        return res.status(400).json({success: false, error: 'Invalid Category or Subcategory ID'});
    }

    const typeExist = await Type.exists({name, category: categoryID, subCategory: subcategoryID});
    if (typeExist) {
        return res.status(400).json({success: false, error: 'Type with this name already exists'});
    }

    const newType = await Type.create({name, category: categoryID, subCategory: subcategoryID});
    res.status(201).json({success: true, data: newType, message: 'Type created successfully'});
});

// Get all types with category and subcategory populated
const allTypes = asyncHandler(async (req, res) => {
    const {subcategoryID} = req.params;

    if (!mongoose.isValidObjectId(subcategoryID)) {
        return res.status(400).json({success: false, error: 'Invalid Subcategory ID'});
    }

    const types = await Type.find({subCategory: subcategoryID}).populate('subCategory', 'name');
    res.status(200).json({success: true, data: types});
});

// Get a single type by ID
const typeById = asyncHandler(async (req, res) => {
    const {id} = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({success: false, error: 'Invalid Type ID'});
    }

    const typeData = await Type.findById(id)
        .populate('category', 'name')
        .populate('subCategory', 'name');

    if (!typeData) {
        return res.status(404).json({success: false, error: 'Type not found'});
    }

    res.status(200).json({success: true, data: typeData});
});

// Update type
const updateType = asyncHandler(async (req, res) => {
    const {id} = req.params;
    const {name, subcategoryID} = req.body;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({success: false, error: 'Invalid Type ID'});
    }

    if (subcategoryID && !mongoose.isValidObjectId(subcategoryID)) {
        return res.status(400).json({success: false, error: 'Invalid Subcategory ID'});
    }

    const updatedType = await Type.findByIdAndUpdate(
        id,
        {name, subCategory: subcategoryID},
        {new: true, runValidators: true}
    ).populate('subCategory', 'name');

    if (!updatedType) {
        return res.status(404).json({success: false, error: 'Type not found'});
    }

    res.status(200).json({success: true, data: updatedType, message: 'Type updated successfully'});
});

// Delete type
const deleteType = asyncHandler(async (req, res) => {
    const {id} = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({success: false, error: 'Invalid Type ID'});
    }

    await Template.deleteMany({type: id});

    const deletedType = await Type.findByIdAndDelete(id);
    if (!deletedType) {
        return res.status(404).json({success: false, error: 'Type not found'});
    }

    res.status(200).json({success: true, message: 'Type and all related templates deleted successfully'});
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
                $lookup: {
                    from: 'subcategories',
                    localField: 'categories._id',
                    foreignField: 'category',
                    as: 'subcategories'
                }
            },
            {
                $lookup: {
                    from: 'types',
                    localField: 'subcategories._id',
                    foreignField: 'subCategory',
                    as: 'types'
                }
            },
            {
                $addFields: {
                    subcategories: {
                        $map: {
                            input: "$subcategories",
                            as: "subcat",
                            in: {
                                $mergeObjects: [
                                    "$$subcat",
                                    {
                                        types: {
                                            $filter: {
                                                input: "$types",
                                                as: "type",
                                                cond: {$eq: ["$$type.subCategory", "$$subcat._id"]}
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    categories: {
                        $map: {
                            input: "$categories",
                            as: "cat",
                            in: {
                                $mergeObjects: [
                                    "$$cat",
                                    {
                                        subcategories: {
                                            $filter: {
                                                input: "$subcategories",
                                                as: "sub",
                                                cond: {$eq: ["$$sub.category", "$$cat._id"]}
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    subcategories: 0,
                    types: 0
                }
            }
        ]);

        res.status(200).json({success: true, data: categories});
    } catch (error) {
        console.error('Error fetching categories with subcategories and types:', error);
        res.status(500).json({success: false, error: 'Internal server error'});
    }
});

// Get all types with subcategory populated
const AllType = asyncHandler(async (req, res) => {
    const types = await Type.find().populate('subCategory', 'name');
    res.status(200).json({success: true, data: types});
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
