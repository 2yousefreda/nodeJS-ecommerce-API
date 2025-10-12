const express =require('express');
const router = express.Router();

const {getBrandValidator,createBrandValidator,updateBrandValidator,deleteBrandValidator}=require('../utils/validators/brandValidator')
const {getBrands,createBrand,getBrand,updateBrand,deleteBrand,uploadCategoryImage,resizeImage}=require('../services/brandService');
// const subcategoriesRoute=require('./subBrandRoute')

// router.use('/:BrandId/subcategories',subcategoriesRoute)
router.route('/').get(getBrands).post(uploadCategoryImage,resizeImage,createBrandValidator,createBrand)
router.route('/:id').get(getBrandValidator,getBrand)
.put(uploadCategoryImage,resizeImage,updateBrandValidator,updateBrand)
.delete(deleteBrandValidator,deleteBrand)


module.exports=router