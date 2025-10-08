const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
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
