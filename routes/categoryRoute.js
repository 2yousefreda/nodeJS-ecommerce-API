const express = require("express");
const router = express.Router();

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");
const subcategoriesRoute = require("./subCategoryRoute");
const authService = require("../services/authService");

router.use("/:categoryId/subcategories", subcategoriesRoute);
router
  .route("/")
  .get(getCategories)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
