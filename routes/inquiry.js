const express = require('express');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {
    createInquiry,
    inquirys,
    inquiryById,
    updateInquiry,
    deleteInquiry
} = require('../controllers/inquiry');

const router = express.Router();

router.post('/', createInquiry);
router.get('/', auth, isAdmin, inquirys);
router.get('/:id', auth, isAdmin, inquiryById);
router.put('/:id', auth, isAdmin, updateInquiry);
router.delete('/:id', auth, isAdmin, deleteInquiry);

module.exports = router;
