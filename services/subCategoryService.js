const slugify=require('slugify');
const asyncHandler = require('express-async-handler')
const SubCategory=require('../models/subCategoryModel');
const ApiError=require('../utils/apiError');
const ApiFeatures=require('../utils/apiFeatures');

exports.setCategoryIdToBody=(req,res,next)=>{
    if(!req.body.category)req.body.category=req.params.categoryId
    next()
}

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

// @desc    Create a category
// @route   POST /api/v1/SubCategories
// @access  Private

exports.createSubCategory=asyncHandler( async (req,res)=>{
    //nested route
    // if(!req.body.category)req.body.category=req.params.categoryId
    const {name,category}=req.body;
    const subCategory=  await SubCategory.create({name,slug:slugify(name),category})
    res.status(201).json({subCategory})

})


// @desc    Get all SubCategories
// @route   GET /api/v1/Subcategories
// @access  Public

exports.getSubCategories=asyncHandler( async (req,res)=>{
    const countDocuments=await SubCategory.countDocuments(req.filterObj);
    const apiFeatures = new ApiFeatures(SubCategory.find(req.filterObj), req.query)
      .search('SubCategory')
      .filter()
      .sort()
      .limitFields()
      .paginate(countDocuments);
      const {mongooseQuery,paginationResult}=apiFeatures;
        const subcategories= await mongooseQuery.populate({path:'category',select:'name'});

    res.status(200).json({length:subcategories.length,paginationResult,data:subcategories})

})

// @desc    Get single subCategory
// @route   GET /api/v1/Subcategories/:id
// @access  Public

exports.getSubCategory=asyncHandler( async (req,res,next)=>{
    const {id}=req.params;
    const subCategory= await SubCategory.findById(id).populate({path:'category',select:'name'})
    if(!subCategory){
        const err =new ApiError(`Category not found with id ${id}`,404)
        return next(err)
    }
    res.status(200).json({subCategory})

})


// @desc    Update a subCategory
// @route   PUT /api/v1/categories/:id
// @access  Private 

exports.updateSubCategory=asyncHandler( async (req,res)=>{
    const {id}=req.params;
    const {name,category}=req.body;
    if(!category){
        return res.status(400).json({message:`SubCategory must belong to a category`})
    }
    const subCategory= await SubCategory.findByIdAndUpdate(id,{name,slug:slugify(name),category},{new:true})
    if(!subCategory){
        return res.status(404).json({message:`SubCategory not found with id ${id}`})
    }
    res.status(200).json({subCategory})
})


// @desc    Delete a subCategory
// @route   DELETE /api/v1/categories/:id
// @access  Private

exports.deleteSubCategory=asyncHandler( async (req,res)=>{
    const {id}=req.params;
    const subCategory= await SubCategory.findByIdAndDelete(id)
    if(!subCategory){
        return res.status(404).json({message:`SubCategory not found with id ${id}`})
    }
    res.status(200).json({message:`SubCategory deleted with id ${id}`})
})