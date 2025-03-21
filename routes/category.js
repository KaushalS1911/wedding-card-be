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

const router = express.Router();

router.post('/', auth, isAdmin, createCategory);
router.get('/', getAllCategories);
router.get('/:id', auth, isAdmin, getCategoryById);
router.put('/:id', auth, isAdmin, updateCategory);
router.delete('/:id', auth, isAdmin, deleteCategory);

module.exports = router;
