const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");

// @desc    Get all Brand
// @route   GET /api/v1/Brand
// @access  Public

exports.getBrands = factory.getAll(Brand, "Brand");

// @desc    Get single Brand
// @route   GET /api/v1/Brand/:id
// @access  Public

exports.getBrand = factory.getOne(Brand);

// @desc    Create a Brand
// @route   POST /api/v1/Brand
// @access  Private

exports.createBrand = factory.createOne(Brand);

// @desc    Update a Brand
// @route   PUT /api/v1/Brand/:id
// @access  Private

exports.updateBrand = factory.updateOne(Brand);

// @desc    Delete a Brand
// @route   DELETE /api/v1/Brand/:id
// @access  Private

exports.deleteBrand = factory.deleteOne(Brand);
