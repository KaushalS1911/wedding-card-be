const express = require('express');
const subcategoryController = require('../controllers/subCategory');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");

const router = express.Router();

router.post('/', auth, isAdmin, subcategoryController.createSubcategory);
router.get('/', subcategoryController.getAllSubcategories);
router.get('/:id', auth, isAdmin, subcategoryController.getSubcategoryById);
router.put('/:id', auth, isAdmin, subcategoryController.updateSubcategory);
router.delete('/:id', auth, isAdmin, subcategoryController.deleteSubcategory);

module.exports = router;
