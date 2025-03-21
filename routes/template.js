const express = require('express');
const multer = require('multer');
const upload = multer();
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {
    createTemplate,
    getAllTemplates,
    getTemplateById,
    updateTemplate,
    deleteTemplate
} = require('../controllers/template');

const router = express.Router();

router.post('/', auth, isAdmin, upload.array('product_images'), createTemplate);
router.get('/', getAllTemplates);
router.get('/:id', auth, isAdmin, getTemplateById);
router.put('/:id', auth, isAdmin, upload.array('product_images'), updateTemplate);
router.delete('/:id', auth, isAdmin, deleteTemplate);

module.exports = router;
