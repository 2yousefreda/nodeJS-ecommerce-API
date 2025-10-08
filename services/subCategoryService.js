const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

/**
 * Creates a filter object based on the category id provided in the request params.
 * If a category id is provided, it will be used to filter the subcategories.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Object} - The filter object.
 */
exports.createFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.params.categoryId) filterObj = { category: req.params.categoryId };
  req.filterObj = filterObj;
  next();
};

// @desc    Get all SubCategories
// @route   GET /api/v1/Subcategories
// @access  Public

exports.getSubCategories = factory.getAll(SubCategory, "subCategory");

// @desc    Get single subCategory
// @route   GET /api/v1/Subcategories/:id
// @access  Public

exports.getSubCategory = factory.getOne(SubCategory);
// @desc    Create a category
// @route   POST /api/v1/SubCategories
// @access  Private

exports.createSubCategory = factory.createOne(SubCategory);

// @desc    Update a subCategory
// @route   PUT /api/v1/categories/:id
// @access  Private

exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc    Delete a subCategory
// @route   DELETE /api/v1/categories/:id
// @access  Private

exports.deleteSubCategory = factory.deleteOne(SubCategory);
