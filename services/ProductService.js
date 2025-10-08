const Product = require("../models/productModel");
const factory = require("./handlersFactory");

// @desc    Get all Products
// @route   GET /api/v1/Products
// @access  Public

exports.getProducts = factory.getAll(Product, "Product");

// @desc    Get single product
// @route   GET /api/v1/Products/:id
// @access  Public

exports.getProduct = factory.getOne(Product);

// @desc    Create a product
// @route   POST /api/v1/Products
// @access  Private

exports.createProduct = factory.createOne(Product);

// @desc    Update a product
// @route   PUT /api/v1/Products/:id
// @access  Private

exports.updateProduct = factory.updateOne(Product);

// @desc    Delete a product
// @route   DELETE /api/v1/Products/:id
// @access  Private

exports.deleteProduct = factory.deleteOne(Product);
