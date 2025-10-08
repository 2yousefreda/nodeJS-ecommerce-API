const slugify=require('slugify');
const asyncHandler = require('express-async-handler')
const Brand=require('../models/brandModel');
const ApiError=require('../utils/apiError');
const ApiFeatures=require('../utils/apiFeatures');

// @desc    Get all Brand
// @route   GET /api/v1/Brand
// @access  Public

exports. getBrands=asyncHandler( async (req,res)=>{
const countDocuments=await Brand.countDocuments();
const apiFeatures = new ApiFeatures(Brand.find(), req.query)
  .search('Brand')
  .filter()
  .sort()
  .limitFields()
  .paginate(countDocuments);
  const {mongooseQuery,paginationResult}=apiFeatures;
  const brands= await mongooseQuery;
  res.status(200).json({length:brands.length,paginationResult,data:brands})
})

// @desc    Get single Brand
// @route   GET /api/v1/Brand/:id
// @access  Public

exports.getBrand=asyncHandler( async (req,res,next)=>{
    const {id}=req.params;
    const brand= await Brand.findById(id)
    if(!brand){
        const err =new ApiError(`Brand not found with id ${id}`,404)
        return next(err)
    }
    res.status(200).json({brand})

})

// @desc    Create a Brand
// @route   POST /api/v1/Brand
// @access  Private

exports.createBrand=asyncHandler( async (req,res)=>{
    const {name}=req.body;
    const brand=  await Brand.create({name,slug:slugify(name)})
    res.status(201).json({brand})

})

// @desc    Update a Brand
// @route   PUT /api/v1/Brand/:id
// @access  Private 

exports.updateBrand=asyncHandler( async (req,res)=>{
    const {id}=req.params;
    const {name}=req.body;
    const brand= await Brand.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
    if(!brand){
        return res.status(404).json({message:`Brand not found with id ${id}`})
    }
    res.status(200).json({brand})
})


// @desc    Delete a Brand
// @route   DELETE /api/v1/Brand/:id
// @access  Private

exports.deleteBrand=asyncHandler( async (req,res)=>{
    const {id}=req.params;
    const brand= await Brand.findByIdAndDelete(id)
    if(!brand){
        return res.status(404).json({message:`Brand not found with id ${id}`})
    }
    res.status(200).json({message:`Brand deleted with id ${id}`})
})