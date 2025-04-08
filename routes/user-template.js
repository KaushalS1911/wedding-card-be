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

router.post('/', createUserTemplate);
router.get('/', allUserTemplates);
router.get('/:id', userTemplateById);
router.put('/:id', updateUserTemplate);
router.delete('/:id', deleteUserTemplate);
router.get('/user/:userId', userTemplatesByUserId);

module.exports = router;
