const  {check} = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const Category=require('../../models/categoryModel');
exports.getSubCategoryValidator=[
    check('id').isMongoId().withMessage('Invalid Subcategory id format'),
    validatorMiddleware,
]
exports.createSubCategoryValidator=[
    check('name').notEmpty()
        .withMessage('SubCategory name is required')
        .isLength({min:2})
        .withMessage('SubCategory name must be at least 3 characters')
        .isLength({max:32})
        .withMessage('SubCategory name must be at most 32 characters'),
        check('category').notEmpty().withMessage('SubCategory must belong to a category').isMongoId().withMessage('Invalid category id format').custom((CategoryId) => Category.findById(CategoryId).then((category) => {
      if (!category) {
        return Promise.reject(new Error(`No category found with id: ${CategoryId}`));
      }
    })),
    validatorMiddleware,
]
exports.updateSubCategoryValidator=[
     check('id').notEmpty()
        .withMessage('Category ID is required')
        .isMongoId().withMessage('Invalid category id format'),
    check('category').optional().isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
]
exports.deleteSubCategoryValidator=[
     check('id').notEmpty().withMessage('Category ID is required')
     .isMongoId().withMessage('Invalid Subcategory id format'),
    validatorMiddleware,
]