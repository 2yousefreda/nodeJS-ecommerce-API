const express =require('express');
const router = express.Router();


const {getCategoryValidator,createCategoryValidator,updateCategoryValidator,deleteCategoryValidator}=require('../utils/validators/categoryValidator')
const {getCategories,createCategory,getCategory,updateCategory,deleteCategory,uploadCategoryImage,resizeImage}=require('../services/categoryService');
const subcategoriesRoute=require('./subCategoryRoute')


router.use('/:categoryId/subcategories',subcategoriesRoute)
router.route('/').get(getCategories).post(uploadCategoryImage,resizeImage,createCategoryValidator,createCategory)
router.route('/:id').get(getCategoryValidator,getCategory)
.put(uploadCategoryImage,resizeImage,updateCategoryValidator,updateCategory)
.delete(deleteCategoryValidator,deleteCategory)


module.exports=router