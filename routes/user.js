const express = require('express');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {
    allUsers,
    userById,
    updateUser,
    deleteUser
} = require("../controllers/user");

const router = express.Router();

router.get('/', auth, isAdmin, allUsers);
router.get('/:id', auth, isAdmin, userById);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, isAdmin, deleteUser);

module.exports = router;