const express = require('express');
const multer = require('multer');
const upload = multer();
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const checkPremium = require("../middlewares/checkPremium");
const {
    createTemplate,
    allTemplates,
    templateById,
    updateTemplate,
    deleteTemplate,
    handleGetTemplateAttributes
} = require('../controllers/template');

const router = express.Router();

router.post('/', auth, isAdmin, upload.any(), createTemplate);
router.get('/', allTemplates);
router.get('/attributes', handleGetTemplateAttributes);
router.get('/:id', templateById);
router.put('/:id', auth, isAdmin, upload.any(), updateTemplate);
router.delete('/:id', auth, isAdmin, deleteTemplate);

module.exports = router;
