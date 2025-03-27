const express = require('express');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {
    createCategory,
    updateCategory,
    deleteCategory,
    allCategories,
    categoryById,
    AllCategory
} = require("../controllers/category");
const {
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    allSubcategories,
    subcategoryById,
    AllSubcategory,
} = require("../controllers/sub-category");
const {
    getAllCategoriesWithSubcategoriesAndTypes,
    createType,
    updateType,
    deleteType,
    allTypes,
    typeById,
    AllType
} = require("../controllers/type");
const {
    createParentCategory,
    updateParentCategory,
    deleteParentCategory,
    allParentCategories,
    parentCategoryById,
} = require("../controllers/parent-category");

const router = express.Router();

// Get all categories with subcategories and types
router.get('/category/all', getAllCategoriesWithSubcategoriesAndTypes);

// Get all category
router.get('/all/parent-category', allParentCategories);
router.get('/all/category', AllCategory);
router.get('/all/sub-category', AllSubcategory);
router.get('/all/type', AllType);

// Routes for Parent Categories
router.post('/parent-category/', auth, isAdmin, createParentCategory);
router.get('/parent-category/', allParentCategories);
router.get('/parent-category/:id', auth, isAdmin, parentCategoryById);
router.put('/parent-category/:id', auth, isAdmin, updateParentCategory);
router.delete('/parent-category/:id', auth, isAdmin, deleteParentCategory);

// Category Routes
router.post('/parent-category/:parentID/category', auth, isAdmin, createCategory);
router.get('/parent-category/:parentID/category', allCategories);
router.get('/parent-category/:parentID/category/:id', auth, isAdmin, categoryById);
router.put('/parent-category/:parentID/category/:id', auth, isAdmin, updateCategory);
router.delete('/parent-category/:parentID/category/:id', auth, isAdmin, deleteCategory);

// subCategory Routes
router.get('/parent-category/:parentID/category/:categoryID/sub-category', allSubcategories);
router.post('/parent-category/:parentID/category/:categoryID/sub-category', auth, isAdmin, createSubcategory);
router.get('/parent-category/:parentID/category/:categoryID/sub-category/:subcategory', auth, isAdmin, subcategoryById);
router.put('/parent-category/:parentID/category/:categoryID/sub-category/:subcategory', auth, isAdmin, updateSubcategory);
router.delete('/parent-category/:parentID/category/:categoryID/sub-category/:subcategory', auth, isAdmin, deleteSubcategory);

// Type Routes
router.post('/parent-category/:parentID/category/:categoryID/sub-category/:subcategoryID/type', auth, isAdmin, createType);
router.get('/parent-category/:parentID/category/:categoryID/sub-category/:subcategoryID/type', allTypes);
router.get('/parent-category/:parentID/category/:categoryID/sub-category/:subcategoryID/type/:id', auth, isAdmin, typeById);
router.put('/parent-category/:parentID/category/:categoryID/sub-category/:subcategoryID/type/:id', auth, isAdmin, updateType);
router.delete('/parent-category/:parentID/category/:categoryID/sub-category/:subcategoryID/type/:id', auth, isAdmin, deleteType);

module.exports = router;
