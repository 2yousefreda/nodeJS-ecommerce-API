const express =require('express');
const router = express.Router();

const {getProductValidator,createProductValidator,updateProductValidator,deleteProductValidator}=require('../utils/validators/productValidator')
const {getProducts,createProduct,getProduct,updateProduct,deleteProduct}=require('../services/ProductService');



router.route('/').get(getProducts).post(createProductValidator,createProduct)
router.route('/:id').get(getProductValidator,getProduct)
.put(updateProductValidator,updateProduct)
.delete(deleteProductValidator,deleteProduct)


module.exports=router