const express = require('express');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {
    createContact,
    contacts,
    contactById,
    updateContact,
    deleteContact
} = require('../controllers/contact');

const router = express.Router();

router.post('/', createContact);
router.get('/', auth, isAdmin, contacts);
router.get('/:id', auth, isAdmin, contactById);
router.put('/:id', auth, isAdmin, updateContact);
router.delete('/:id', auth, isAdmin, deleteContact);

module.exports = router;
