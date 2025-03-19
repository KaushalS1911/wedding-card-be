const express = require('express');
const {isAdmin} = require("../middlewares/isAdmin");
const {auth} = require("../middlewares/auth");
const {
    handleGetMe,
    loginUser,
    deleteUser,
    updateUser,
    getUserById,
    handleCreateUser,
    getAllUsers
} = require("../controllers/user");

const router = express.Router();

router.post('/register', handleCreateUser);
router.post('/login', loginUser);
router.get('/me', auth, handleGetMe);

router.get('/', auth, isAdmin, getAllUsers);
router.get('/:id', auth, isAdmin, getUserById);

router.put('/:id', auth, updateUser);
router.delete('/:id', auth, isAdmin, deleteUser);

module.exports = router;
