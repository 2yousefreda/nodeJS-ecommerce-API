const express = require("express");
const router = express.Router();

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/ProductService");
const authService = require("../services/authService");

router
  .route("/")
  .get(getProducts)
  .post(
  
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
