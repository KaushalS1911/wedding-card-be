const express = require('express');
const router = express.Router();
const {
    createUserTemplate,
    updateUserTemplate,
    deleteUserTemplate,
    userTemplatesByUserId,
    userTemplateById,
    allUserTemplates,
} = require('../controllers/user-template');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");

router.post('/', auth, createUserTemplate);
router.get('/', auth, isAdmin, allUserTemplates);
router.get('/:id', auth, userTemplateById);
router.put('/:id', auth, updateUserTemplate);
router.delete('/:id', auth, deleteUserTemplate);
router.get('/user/:userId', auth, userTemplatesByUserId);

module.exports = router;
