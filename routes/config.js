const express = require('express');
const auth = require("../middlewares/auth");
const {isAdmin} = require("../middlewares/isAdmin");
const {getConfig, updateConfig} = require('../controllers/config');

const router = express.Router();

// Routes for config
router.get('/', getConfig);
router.put('/:id', auth, isAdmin, updateConfig);

module.exports = router;
