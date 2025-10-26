const sharp = require('sharp');
const asyncHandler = require("express-async-handler");
const { v4 : uuidv4 }= require('uuid') ;

const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");


// Upload single image
exports.uploadBrandImage = uploadSingleImage('image');

//image processing
exports.resizeImage = asyncHandler( async (req, res, next) => {
    if (!req.file) return next();
    const fileName=`brand-${uuidv4()}-${Date.now()}.jpeg`
   await sharp(req.file.buffer).resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);
    req.body.image = fileName;
    // console.log(req.file);
    next();
});


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
