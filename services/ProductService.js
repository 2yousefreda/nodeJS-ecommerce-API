const multer  = require('multer')
const ApiError = require("../utils/apiError");
const sharp = require('sharp');
const asyncHandler = require("express-async-handler");
const { v4 : uuidv4 }= require('uuid') ;

const {uploadMixOfImages} = require("../middlewares/uploadImageMiddleware"); 
const Product = require("../models/productModel");
const factory = require("./handlersFactory");





exports.uploadProductImages = uploadMixOfImages([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 5 }
]);

exports.resizeProductImages =asyncHandler( async (req, res, next) => {
  // 1) Image Cover
  if (req.files.imageCover) {
    const fileName = `product-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(600, 600)
      .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/products/${fileName}`);    
    req.body.imageCover = fileName;    
  }

  // 2) Images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file, i) => {
        const fileName=`product-${uuidv4()}-${Date.now()}-${i + 1}.jpeg`
        await sharp(file.buffer).resize(1200, 600)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${fileName}`);
        req.body.images.push(fileName);
      })
    );
  }
  next();
});


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
