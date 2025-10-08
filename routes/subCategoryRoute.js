const express =require('express');

const {createSubCategoryValidator,getSubCategoryValidator,updateSubCategoryValidator,deleteSubCategoryValidator}=require('../utils/validators/subCategoryValidator')
const {createSubCategory,getSubCategories,getSubCategory,updateSubCategory,deleteSubCategory,setCategoryIdToBody,createFilterObj}=require('../services/subCategoryService');
//mergeParams:true -> allows us to access the params of the parent route
// ex: /api/v1/categories/:categoryId/subcategories
const router = express.Router({mergeParams:true});

router.route('/').get(createFilterObj,getSubCategories).post(setCategoryIdToBody,createSubCategoryValidator,createSubCategory);
router.route('/:id').get(getSubCategoryValidator,getSubCategory).put(updateSubCategoryValidator,updateSubCategory).delete(deleteSubCategoryValidator,deleteSubCategory);

module.exports=router