const slugify=require('slugify');
const asyncHandler = require('express-async-handler')
const Product=require('../models/productModel');
const ApiError=require('../utils/apiError');
const qs=require('qs');
const ApiFeatures=require('../utils/apiFeatures');
// @desc    Get all Products
// @route   GET /api/v1/Products
// @access  Public

exports.getProducts = asyncHandler(async (req, res) => {
    //filtering
    // const queryStringObj = qs.parse(req.query);
    // const excludeFields = ['page', 'sort', 'limit', 'fields'];
    // excludeFields.forEach((el) => delete queryStringObj[el]);
    // let queryStr = JSON.stringify(queryStringObj);
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    // console.log("Query String Obj:", queryStringObj);
    // console.log("Query String:", JSON.parse(queryStr));
    // console.log("Query :", req.query);
  
    // //pagination
    // const page=req.query.page *1 || 1;
    // const limit=req.query.limit *1 || 10;
    // const skip=(page-1)*limit
    const countDocuments=await Product.countDocuments();
const apiFeatures = new ApiFeatures(Product.find(), req.query)
.search()
  .filter()
  .sort()
  .limitFields()
  .paginate(countDocuments);

apiFeatures.mongooseQuery = apiFeatures.mongooseQuery.populate({
  path: 'category',
  select: 'name',
});

const {mongooseQuery,paginationResult}=apiFeatures;

const products = await mongooseQuery;
res.status(200).json({
  length: products.length,
  paginationResult,
  data: products,
});
    // let mongoQuery=  Product.find(JSON.parse(queryStr)).skip(skip).limit(limit).populate({path:'category',select:'name'});
    // if(req.query.sort)
    // {
    //     const sortBy=req.query.sort.split(',').join(' ')
    //     mongoQuery=mongoQuery.sort(sortBy)
    // }else{
    //     mongoQuery=mongoQuery.sort('-createdAt')
    // }
    //fields limiting
    // if(req.query.fields)
    // {
    //     const fields=req.query.fields.split(',').join(' ')
    //     mongoQuery=mongoQuery.select(fields)
    // }else{
    //     mongoQuery=mongoQuery.select('-__v')
    // }
    // search
    // if(req.query.keyword)
    // {
    //     const query={};
    //     query.$or=[{title:{$regex:req.query.keyword,$options:'i'}},{description:{$regex:req.query.keyword,$options:'i'}}]
    //     console.log(query.$regex);
    //     mongoQuery=mongoQuery.find(query)
    // }



})

// @desc    Get single product
// @route   GET /api/v1/Products/:id
// @access  Public

exports.getProduct=asyncHandler( async (req,res,next)=>{
    const {id}=req.params;
    const product= await Product.findById(id).populate({path:'category',select:'name'})
    if(!product){
        const err =new ApiError(`product not found with id ${id}`,404)
        return next(err)
    }
    res.status(200).json({product})

})

// @desc    Create a product
// @route   POST /api/v1/Products
// @access  Private

exports.createProduct=asyncHandler( async (req,res)=>{
   req.body.slug=slugify(req.body.title);
    const product=  await Product.create(req.body)
    res.status(201).json({product})

})

// @desc    Update a product
// @route   PUT /api/v1/Products/:id
// @access  Private 

exports.updateProduct=asyncHandler( async (req,res)=>{
    const {id}=req.params;
    if(req.body.title)req.body.slug=slugify(req.body.title);
    const product= await Product.findByIdAndUpdate(id,req.body,{new:true})
    if(!product){
        return res.status(404).json({message:`product not found with id ${id}`})
    }
    res.status(200).json({product})
})


// @desc    Delete a product
// @route   DELETE /api/v1/Products/:id
// @access  Private

exports.deleteProduct=asyncHandler( async (req,res)=>{
    const {id}=req.params;
    const product= await Product.findByIdAndDelete(id)
    if(!product){
        return res.status(404).json({message:`product not found with id ${id}`})
    }
    res.status(200).json({message:`product deleted with id ${id}`})
})