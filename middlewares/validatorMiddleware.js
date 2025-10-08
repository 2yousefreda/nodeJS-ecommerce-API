
// @desc    Find the validation errors in the request and forward to the error handler
const  {validationResult,} = require('express-validator');
const validatorMiddleware =(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports=validatorMiddleware