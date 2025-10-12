const express =require('express');
const router = express.Router();

const {getProductValidator,createProductValidator,updateProductValidator,deleteProductValidator}=require('../utils/validators/productValidator')
const {getProducts,createProduct,getProduct,updateProduct,deleteProduct,uploadProductImages,resizeProductImages}=require('../services/ProductService');



router.route('/').get(getProducts).post(uploadProductImages,resizeProductImages,createProductValidator,createProduct)
router.route('/:id').get(getProductValidator,getProduct)
.put(uploadProductImages,resizeProductImages,updateProductValidator,updateProduct)
.delete(deleteProductValidator,deleteProduct)


module.exports=router