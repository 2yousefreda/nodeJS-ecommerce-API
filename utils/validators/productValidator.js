const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Category=require('../../models/categoryModel');
const SubCategory=require('../../models/subCategoryModel');

// @desc Get Product by ID
exports.getProductValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid product id format'),
  validatorMiddleware,
];

// @desc Create Product
exports.createProductValidator = [
  check('title')
    .notEmpty().withMessage('Product title is required')
    .isLength({ min: 2 }).withMessage('Product name must be at least 2 characters')
    .isLength({ max: 100 }).withMessage('Product name must be at most 32 characters'),

  check('description')
    .notEmpty().withMessage('Product description is required')
    .isLength({ min: 2 }).withMessage('Product description must be at least 2 characters')
    .isLength({ max: 2000 }).withMessage('Product description must be at most 2000 characters'),

  check('price')
    .notEmpty().withMessage('Product price is required')
    .isNumeric({ min: 0 }).withMessage('Product price must be at least 0'),

  check('priceAfterDiscount')
    .optional()
    .isNumeric({ min: 0 }).withMessage('Discount price must be positive')
    .toFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new Error('Discount price should be lower than original price');
      }
      return true;
    }),
  check('colors')
    .optional()
    .isArray().withMessage('Colors must be an array of strings'),
  

  check('quantity')
    .notEmpty().withMessage('Product quantity is required')
    .isNumeric({ min: 0 }).withMessage('Product quantity must be at least 0'),

  check('imageCover')
    .notEmpty().withMessage('Product cover image is required'),

  check('category')
    .notEmpty().withMessage('Product must belong to a category')
    .isMongoId().withMessage('Invalid category id format').custom((CategoryId) => Category.findById(CategoryId).then((category) => {
      if (!category) {
        return Promise.reject(new Error(`No category found with id: ${CategoryId}`));
      }
    })),

  check('subcategories')
    .optional()
    .isMongoId().withMessage('Invalid subcategory id format')
    .isArray().withMessage('Subcategories must be an array of IDs')
    .custom((subcategoryIds) =>  SubCategory.find({ _id: { $exists: true,$in: subcategoryIds } }).then((result) => {
        if (result.length<1 || result.length !== subcategoryIds.length) {
         return Promise.reject(new Error(`No subcategories found with id: ${subcategoryIds}`));
        }
      })
    ).custom((val, { req }) => 
      SubCategory.find({category: req.body.category }).then((subcategory) => {
       const subcategoryIdsInDB =[];
       subcategory.forEach((subcat) => {
        
        subcategoryIdsInDB.push(subcat._id.toString())

       });
       const checker=subcategoryIds.every((subcatId) => subcategoryIdsInDB.includes(subcatId));
       if (!checker) {
        return Promise.reject(new Error(`Subcategory with id: ${req.body.subcategories} does not belong to category with id: ${req.body.category}`));
       }
      })
      
    ),
    
    

  check('brand')
    .optional()
    .isMongoId().withMessage('Invalid brand id format'),

  check('ratingsAverage')
    .optional()
    .isNumeric({ min: 1, max: 5 }).withMessage('Ratings average must be between 1 and 5'),

  check('ratingsQuantity')
    .optional()
    .isNumeric({ min: 0 }).withMessage('Ratings quantity must be at least 0'),

  validatorMiddleware,
];

// @desc Update Product
exports.updateProductValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid product id format'),
    check('category').optional().isMongoId().withMessage('Invalid category id format').custom((CategoryId) => Category.findById(CategoryId).then((category) => {
      if (!category) {
        return Promise.reject(new Error(`No category found with id: ${CategoryId}`));
      }
    })),
  validatorMiddleware,
];

// @desc Delete Product
exports.deleteProductValidator = [
  check('id')
    .isMongoId()
    .withMessage('Invalid product id format'),
  validatorMiddleware,
];
