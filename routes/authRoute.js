const express =require('express');
const router = express.Router();

const {signupValidator,loginValidator}=require('../utils/validators/authValidator')
const {signup,login,forgetPassword,verifyResetCode,resetPassword}=require('../services/authService');


router.post('/signup',signupValidator,signup)
router.post('/login',loginValidator,login)
router.post('/forgetPassword',forgetPassword)
router.post('/verifyResetCode',verifyResetCode)
router.put('/resetPassword',resetPassword)


module.exports=router