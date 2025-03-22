const express = require('express');
const auth = require("../middlewares/auth");
const {register, login, me} = require("../controllers/auth");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);

module.exports = router;
