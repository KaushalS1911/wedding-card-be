const express = require('express');
const subcategoryController = require('../controllers/subCategory');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {
    getAllCategoriesWithSubcategories,
    createSubcategory,
    getAllSubcategories,
    getSubcategoryById,
    updateSubcategory,
    deleteSubcategory
} = require("../controllers/subCategory");

const router = express.Router();

router.post('subcategory/', auth, isAdmin, createSubcategory);
router.get('subcategory/', getAllSubcategories);
router.get('subcategory/:id', auth, isAdmin, getSubcategoryById);
router.put('subcategory/:id', auth, isAdmin, updateSubcategory);
router.delete('subcategory/:id', auth, isAdmin, deleteSubcategory);

router.get('/categories-with-subcategories', getAllCategoriesWithSubcategories);

module.exports = router;
