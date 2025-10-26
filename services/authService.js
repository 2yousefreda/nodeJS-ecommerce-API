const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");

const User = require("../models/userModel");







// @desc    Signup
// @route   POST /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
    const user = await User.create({
      ...req.body
    });
    const token = createToken(user);
    res.status(201).json({
        status: "success",
        
        data: {
            user,
            token
        },
    });
});
// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    //2) Check if user exists && password is correct
    const user = await User.findOne ({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new ApiError("Incorrect email or password", 401));
    };
    //3) If everything is ok, send token to client
    const token = createToken(user);
    res.status(200).json({
        status: "success",
        data: {
            user,
            token
        },
    });
});

// @desc    Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    //1) Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(new ApiError("You are not logged in! Please log in to get access.", 401));
    }
    //2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
        return next(new ApiError("Invalid token! Please log in again.", 401));
    }
    //3) Check if user still exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(new ApiError("The user belonging to this token does no longer exist.", 401));
    }
    //4) Check if user changed password after the token was issued
    if(currentUser.passwordChangedAt){
        const passwordChangedTimestamp =parseInt(currentUser.passwordChangedAt.getTime()/1000,10);
        if(passwordChangedTimestamp > decoded.iat){
            return next(new ApiError("User recently changed password! Please log in again.", 401));
        }
    }
    req.user = currentUser;
    next();
});

exports.allowedTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ApiError("You are not allowed to perform this action", 403));
        }
        next();
    };
};

// @desc    Forget Password
// @route   POST /api/v1/auth/forgetPassword
// @access  Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    //1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError("There is no user with that email", 404));
    }
    //2) Generate the random 6 digit reset token  and save it to database
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetToken = crypto.createHash("sha256").update(resetCode).digest("hex");

    user.passwordResetCode = hashedResetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes
    user.passwordResetVerified = false;
    await user.save();

    //3) Send it to user's email
    const message = `Your password reset code is: ${resetCode}`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Password Reset Code",
            message
        });
    } catch (error) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
        return next(new ApiError("There was an error sending the email", 500));
    }
    res.status(200).json({
        status: "success",
        message: "Reset code sent to email!"
    });
});


// @desc    Verify Reset Code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  // 1) Ensure resetCode exists in request body
console.log(req.body);
  // 2) Hash the reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  // 3) Check if reset code matches and not expired
  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid or expired reset code", 400));
  }

  // 4) Mark as verified
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Reset code verified successfully",
  });
});
exports.resetPassword = asyncHandler(async (req, res, next) => {
    //1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ApiError("There is no user with that email", 404));
    }
    //2) Check if reset code is verified
    if (!user.passwordResetVerified) {
        return next(new ApiError("Reset code not verified", 400));
    }
    //3) Update password
    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    //4) generate token
    const token = createToken(user._id);
    //5) Send response to client
    res.status(200).json({
        status: "success",
        message: "Password reset successfully",
        token
    });
});