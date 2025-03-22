const express = require('express');
const {
    createBlog,
    updateBlog,
    deleteBlog,
    allBlogs,
    blogById
} = require('../controllers/blog');
const {isAdmin} = require("../middlewares/isAdmin");
const auth = require("../middlewares/auth");
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const router = express.Router();

router.post('/', upload.array('images', 10), auth, isAdmin, createBlog);
router.get('/', allBlogs);
router.get('/:id', auth, isAdmin, blogById);
router.put('/:id', auth, isAdmin, upload.array('images', 10), updateBlog);
router.delete('/:id', auth, isAdmin, deleteBlog);

module.exports = router;
