const express = require('express');
const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require('../controllers/blog');
const {isAdmin} = require("../middlewares/isAdmin");
const auth = require("../middlewares/auth");
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const router = express.Router();

router.post('/', upload.array('images', 10), auth, isAdmin, createBlog);
router.get('/', getAllBlogs);
router.get('/:id', auth, isAdmin, getBlogById);
router.put('/:id', auth, isAdmin, upload.array('images', 10), updateBlog);
router.delete('/:id', auth, isAdmin, deleteBlog);

module.exports = router;
