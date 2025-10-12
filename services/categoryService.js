const sharp = require('sharp');
const { v4 : uuidv4 }= require('uuid') ;
const asyncHandler = require("express-async-handler");


const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");


// Upload single image
exports.uploadCategoryImage = uploadSingleImage('image');

//image processing
exports.resizeImage = asyncHandler( async (req, res, next) => {
    if (!req.file) return next();
    const fileName=`category-${uuidv4()}-${Date.now()}.jpeg`
   await sharp(req.file.buffer).resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${fileName}`);
    req.body.image = fileName;
    // console.log(req.file);
    next();
});


// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public

exports.getCategories = factory.getAll(Category, "Category");

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public

exports.getCategory = factory.getOne(Category);
// @desc    Create a category
// @route   POST /api/v1/categories
// @access  Private

exports.createCategory = factory.createOne(Category);

// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Private

exports.updateCategory = factory.updateOne(Category);

// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Private

exports.deleteCategory = factory.deleteOne(Category);
