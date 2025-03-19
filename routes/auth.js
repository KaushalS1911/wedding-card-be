const express = require('express');
const {isAdmin} = require("../middlewares/isAdmin");
const auth = require("../middlewares/auth");
const {
    deleteUser,
    updateUser,
    allUsers,
    userById
} = require("../controllers/user");
const {register, login, me} = require("../controllers/auth");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);

router.get('/', auth, isAdmin, allUsers);
router.get('/:id', auth, isAdmin, userById);

router.put('/:id', auth, updateUser);
router.delete('/:id', auth, isAdmin, deleteUser);

module.exports = router;
