const express = require("express");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");
const authService = require("../services/authService");

//mergeParams:true -> allows us to access the params of the parent route
// ex: /api/v1/categories/:categoryId/subcategories
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(authService.protect, createFilterObj, getSubCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  );
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authService.protect,
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
