const asyncHandler = require("express-async-handler");
const BlogModel = require("../models/blog");
const {uploadFile} = require("../services/uploadfile");

// Create Blog
const createBlog = asyncHandler(async (req, res) => {
    const {title, blogCategory, desc, extraData} = req.body;

    if (!title || !blogCategory || !desc) {
        throw new Error("Title, Blog Category, and Description are required.");
    }

    if (await BlogModel.exists({title})) {
        throw new Error("Blog with this title already exists");
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
            throw new Error("Invalid JSON format for extraData");
        }
    }

    const newBlog = await BlogModel.create({
        title,
        blogCategory,
        desc,
        extraData: parsedExtraData,
        images: uploadedImages,
    });

    res.status(201).json({data: newBlog, message: "Blog created successfully"});
});

// Get All Blogs
const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await BlogModel.find();
    res.status(200).json({data: blogs});
});

// Get Single Blog
const getBlogById = asyncHandler(async (req, res) => {
    const blog = await BlogModel.findById(req.params.id);
    if (!blog) {
        throw new Error("Blog not found");
    }
    res.status(200).json({data: blog});
});

// Update Blog
const updateBlog = asyncHandler(async (req, res) => {
    const {images = [], title, blogCategory, desc, extraData} = req.body;

    const existingBlog = await BlogModel.findById(req.params.id);
    if (!existingBlog) {
        throw new Error("Blog not found");
    }

    const newImages = images.filter(img => typeof img !== "string");
    const existingImages = images.filter(img => typeof img === "string");

    const uploadedImages = newImages.length > 0
        ? await Promise.all(newImages.map(async (file) => await uploadFile(file.buffer)))
        : [];

    const finalImages = [...existingImages, ...uploadedImages];

    const updatedBlog = await BlogModel.findByIdAndUpdate(
        req.params.id,
        {title, blogCategory, desc, extraData, images: finalImages},
        {new: true, runValidators: true}
    );

    res.status(200).json({data: updatedBlog, message: "Blog updated successfully"});
});

// Delete Blog
const deleteBlog = asyncHandler(async (req, res) => {
    const deletedBlog = await BlogModel.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
        throw new Error("Blog not found");
    }
    res.status(200).json({message: "Blog deleted successfully"});
});

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};
