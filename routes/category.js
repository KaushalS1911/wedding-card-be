const express = require('express');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controllers/category");
const {
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory,
} = require("../controllers/subCategory");
const {
    getAllCategoriesWithSubcategoriesAndTypes,
    createType,
    getTypeById,
    updateType,
    deleteType,
    getAllTypes
} = require("../controllers/type");
const {
    createParentCategory,
    getAllParentCategories,
    getParentCategoryById,
    updateParentCategory,
    deleteParentCategory
} = require("../controllers/parentCategory");

const router = express.Router();

// Routes for Parent Categories
router.post('parent-category/', auth, isAdmin, createParentCategory);
router.get('parent-category/', getAllParentCategories);
router.get('parent-category/:id', auth, isAdmin, getParentCategoryById);
router.put('parent-category/:id', auth, isAdmin, updateParentCategory);
router.delete('parent-category/:id', auth, isAdmin, deleteParentCategory);

// Category Routes
router.post('/category', auth, isAdmin, createCategory);
router.get('/category', getAllCategories);
router.get('/category/:id', auth, isAdmin, getCategoryById);
router.put('/category/:id', auth, isAdmin, updateCategory);
router.delete('/category/:id', auth, isAdmin, deleteCategory);

// subCategory Routes
router.get('/subcategory', getAllSubcategories);
router.post('/subcategory', auth, isAdmin, createSubcategory);
router.get('/subcategory/:id', auth, isAdmin, getSubcategoryById);
router.put('/subcategory/:id', auth, isAdmin, updateSubcategory);
router.delete('/subcategory/:id', auth, isAdmin, deleteSubcategory);

// Type Routes
router.post('/types', auth, isAdmin, createType);
router.get('/types', getAllTypes);
router.get('/types/:id', auth, isAdmin, getTypeById);
router.put('/types/:id', auth, isAdmin, updateType);
router.delete('/types/:id', auth, isAdmin, deleteType);

// Get all categories with subcategories and types
router.get('/categories-with-subcategories-and-types', getAllCategoriesWithSubcategoriesAndTypes);

module.exports = router;
