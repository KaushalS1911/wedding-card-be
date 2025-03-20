const express = require('express');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {
    createContact,
    getContacts,
    getContactById,
    updateContact,
    deleteContact
} = require('../controllers/contact');

const router = express.Router();

router.post('/', createContact);
router.get('/', auth, isAdmin, getContacts);
router.get('/:id', auth, isAdmin, getContactById);
router.put('/:id', auth, isAdmin, updateContact);
router.delete('/:id', auth, isAdmin, deleteContact);

module.exports = router;
