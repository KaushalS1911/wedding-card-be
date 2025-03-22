const express = require('express');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {
    createCategory,
    updateCategory,
    deleteCategory,
    allCategories,
    categoryById
} = require("../controllers/category");
const {
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    allSubcategories,
    subcategoryById,
} = require("../controllers/sub-category");
const {
    getAllCategoriesWithSubcategoriesAndTypes,
    createType,
    updateType,
    deleteType,
    allTypes,
    typeById
} = require("../controllers/type");
const {
    createParentCategory,
    updateParentCategory,
    deleteParentCategory,
    allParentCategories,
    parentCategoryById
} = require("../controllers/parent-category");

const router = express.Router();

// Get all categories with subcategories and types
router.get('/all', getAllCategoriesWithSubcategoriesAndTypes);

// Routes for Parent Categories
router.post('/', auth, isAdmin, createParentCategory);
router.get('/', allParentCategories);
router.get('/:id', auth, isAdmin, parentCategoryById);
router.put('/:id', auth, isAdmin, updateParentCategory);
router.delete('/:id', auth, isAdmin, deleteParentCategory);

// Category Routes
router.post('/:parentCategory/category', auth, isAdmin, createCategory);
router.get('/:parentCategory/category', allCategories);
router.get('/:parentCategory/category/:id', auth, isAdmin, categoryById);
router.put('/:parentCategory/category/:id', auth, isAdmin, updateCategory);
router.delete('/:parentCategory/category/:id', auth, isAdmin, deleteCategory);

// subCategory Routes
router.get('/:parentCategory/category/:category/sub-category', allSubcategories);
router.post('/:parentCategory/category/:category/sub-category', auth, isAdmin, createSubcategory);
router.get('/:parentCategory/category/:category/sub-category/:subcategory', auth, isAdmin, subcategoryById);
router.put('/:parentCategory/category/:category/sub-category/:subcategory', auth, isAdmin, updateSubcategory);
router.delete('/:parentCategory/category/:category/sub-category/:subcategory', auth, isAdmin, deleteSubcategory);

// Type Routes
router.post('/:parentCategory/category/:category/sub-category/:subcategory/type', auth, isAdmin, createType);
router.get('/:parentCategory/category/:category/sub-category/:subcategory/type', allTypes);
router.get('/:parentCategory/category/:category/sub-category/:subcategory/type/:id', auth, isAdmin, typeById);
router.put('/:parentCategory/category/:category/sub-category/:subcategory/type/:id', auth, isAdmin, updateType);
router.delete('/:parentCategory/category/:category/sub-category/:subcategory/type/:id', auth, isAdmin, deleteType);

module.exports = router;
