const express = require('express');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {
    createFavouriteTemplate,
    getFavouriteTemplates,
    getFavouriteTemplateById,
    updateFavouriteTemplate,
    deleteFavouriteTemplate,
} = require('../controllers/favouriteTemplates');

const router = express.Router();

router.post('/', auth, createFavouriteTemplate);
router.get('/:user', auth, getFavouriteTemplates);
router.get('/single/:id', auth, isAdmin, getFavouriteTemplateById);
router.put('/:id', auth, isAdmin, updateFavouriteTemplate);
router.delete('/:id', auth, deleteFavouriteTemplate);

module.exports = router;
