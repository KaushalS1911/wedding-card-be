const express = require('express');
const categoryController = require('../controllers/category');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");

const router = express.Router();

router.post('/', auth, isAdmin, categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', auth, isAdmin, categoryController.getCategoryById);
router.put('/:id', auth, isAdmin, categoryController.updateCategory);
router.delete('/:id', auth, isAdmin, categoryController.deleteCategory);

module.exports = router;
