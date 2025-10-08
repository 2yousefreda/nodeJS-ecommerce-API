const slugify=require('slugify');
const asyncHandler = require('express-async-handler')
const Category=require('../models/categoryModel');
const ApiError=require('../utils/apiError');
const ApiFeatures=require('../utils/apiFeatures');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public

exports. getCategories=asyncHandler( async (req,res)=>{
const countDocuments=await Category.countDocuments();
const apiFeatures = new ApiFeatures(Category.find(), req.query)
  .search('Category')
  .filter()
  .sort()
  .limitFields()
  .paginate(countDocuments);

  const {mongooseQuery,paginationResult}=apiFeatures;

  const categories= await mongooseQuery;
  res.status(200).json({length:categories.length,paginationResult,data:categories})
res.send()
})

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public

exports.getCategory=asyncHandler( async (req,res,next)=>{
    const {id}=req.params;
    const category= await Category.findById(id)
    if(!category){
        const err =new ApiError(`Category not found with id ${id}`,404)
        return next(err)
    }
    res.status(200).json({category})

})

// @desc    Create a category
// @route   POST /api/v1/categories
// @access  Private

exports.createCategory=asyncHandler( async (req,res)=>{
    const {name}=req.body;
    const category=  await Category.create({name,slug:slugify(name)})
    res.status(201).json({category})

})

// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Private 

exports.updateCategory=asyncHandler( async (req,res)=>{
    const {id}=req.params;
    const {name}=req.body;
    const category= await Category.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
    if(!category){
        return res.status(404).json({message:`Category not found with id ${id}`})
    }
    res.status(200).json({category})
})


// @desc    Delete a category
// @route   DELETE /api/v1/categories/:id
// @access  Private

exports.deleteCategory=asyncHandler( async (req,res)=>{
    const {id}=req.params;
    const category= await Category.findByIdAndDelete(id)
    if(!category){
        return res.status(404).json({message:`Category not found with id ${id}`})
    }
    res.status(200).json({message:`Category deleted with id ${id}`})
})