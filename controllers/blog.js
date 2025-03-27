const asyncHandler = require("express-async-handler");
const BlogModel = require("../models/blog");
const {uploadFile} = require("../services/uploadfile");

// Create Blog
const createBlog = asyncHandler(async (req, res) => {
    const {title, blogCategory, desc, extraData} = req.body;

    if (!title || !blogCategory || !desc) {
        return res.status(400).json({success: false, message: "Title, Blog Category, and Description are required."});
    }

    if (await BlogModel.exists({title})) {
        return res.status(400).json({success: false, message: "Blog with this title already exists."});
    }

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
        uploadedImages = await Promise.all(req.files.map(async (file) => await uploadFile(file.buffer)));
    }

    let parsedExtraData = {};
    if (extraData) {
        try {
            parsedExtraData = JSON.parse(extraData);
        } catch (error) {
            return res.status(400).json({success: false, message: "Invalid JSON format for extraData."});
        }
    }

    const newBlog = await BlogModel.create({
        title,
        blogCategory,
        desc,
        extraData: parsedExtraData,
        images: uploadedImages,
    });

    res.status(201).json({success: true, data: newBlog, message: "Blog created successfully."});
});

// Get All Blogs
const allBlogs = asyncHandler(async (req, res) => {
    const blogs = await BlogModel.find();
    res.status(200).json({success: true, data: blogs});
});

// Get Single Blog
const blogById = asyncHandler(async (req, res) => {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) {
        return res.status(404).json({success: false, message: "Blog not found."});
    }
    res.status(200).json({success: true, data: blog});
});

// Update Blog
const updateBlog = asyncHandler(async (req, res) => {
    const {title, blogCategory, desc, extraData} = req.body;

    const existingBlog = await BlogModel.findById(req.params.id);
    if (!existingBlog) {
        return res.status(404).json({success: false, message: "Blog not found."});
    }

    let finalImages = existingBlog.images || [];

    if (req.body.images && Array.isArray(req.body.images)) {
        finalImages = req.body.images.filter((img) => typeof img === "string");
    }

    if (req.files && req.files.length > 0) {
        const uploadedImages = await Promise.all(req.files.map(async (file) => await uploadFile(file.buffer)));
        finalImages.push(...uploadedImages);
    }

    let parsedExtraData = {};
    if (extraData) {
        try {
            parsedExtraData = JSON.parse(extraData);
        } catch (error) {
            return res.status(400).json({success: false, message: "Invalid JSON format for extraData."});
        }
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(
        req.params.id,
        {title, blogCategory, desc, extraData: parsedExtraData, images: finalImages},
        {new: true, runValidators: true}
    );

    res.status(200).json({success: true, data: updatedBlog, message: "Blog updated successfully."});
});

// Delete Blog
const deleteBlog = asyncHandler(async (req, res) => {
    const deletedBlog = await BlogModel.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
        return res.status(404).json({success: false, message: "Blog not found."});
    }
    res.status(200).json({success: true, message: "Blog deleted successfully."});
});

module.exports = {
    createBlog,
    allBlogs,
    blogById,
    updateBlog,
    deleteBlog,
};
