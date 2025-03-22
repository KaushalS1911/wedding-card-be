const express = require('express');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {
    createFavouriteTemplate,
    favouriteTemplates,
    favouriteTemplateById,
    updateFavouriteTemplate,
    deleteFavouriteTemplate,
} = require('../controllers/favourite-templates');

const router = express.Router();

router.post('/', auth, createFavouriteTemplate);
router.get('/:user', auth, favouriteTemplates);
router.get('/single/:id', auth, isAdmin, favouriteTemplateById);
router.put('/:id', auth, isAdmin, updateFavouriteTemplate);
router.delete('/:id', auth, deleteFavouriteTemplate);

module.exports = router;
