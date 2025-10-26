const sharp = require('sharp');
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/apiError");
const { v4 : uuidv4 }= require('uuid') ;
const bcrypt = require('bcryptjs');
const createToken = require("../utils/createToken");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");


// Upload single image
exports.uploadUserImage = uploadSingleImage('profileImage');

//image processing
exports.resizeImage = asyncHandler( async (req, res, next) => {
    if (!req.file) return next();
    console.log(req.file);
    const fileName=`user-${uuidv4()}-${Date.now()}.jpeg`
   await sharp(req.file.buffer).resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${fileName}`);
    req.body.profileImage = fileName;
    next();
});


// @desc    Get all User
// @route   GET /api/v1/User
// @access  Public

exports.getUsers = factory.getAll(User, "User");

// @desc    Get single User
// @route   GET /api/v1/User/:id
// @access  Public

exports.getUser = factory.getOne(User);

// @desc    Create a User
// @route   POST /api/v1/User
// @access  Private

exports.createUser = factory.createOne(User);

// @desc    Update a User
// @route   PUT /api/v1/User/:id
// @access  Private

exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        slug: req.body.slug,
        email: req.body.email,
        phone: req.body.phone,
        profileImage: req.body.profileImage,
        role: req.body.role,
    }, {
        new: true,
    });
    if (!document) {    
        return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            user: document,
        },
    });
});
// @desc    Delete a User
// @route   DELETE /api/v1/User/:id/change-password
// @access  Private
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.params.id, {
        password: await bcrypt.hash(req.body.password, 10),
        passwordChangedAt: Date.now()
    }, {
        new: true,
    });
    if (!document) {
        return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
        status: "success",
        message: "Password changed successfully",
        data:document
    });
});

// @desc    Delete a User
// @route   DELETE /api/v1/User/:id
// @access  Private

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const doc = await User.findByIdAndUpdate(req.params.id, { blocked: true   }, {
      new: true,
    });
    if (!doc) {
      return next(new ApiError(`No item found with id ${req.params.id}`, 404));
    } 
    res.status(200).json({ data: doc });
});

// @desc    Activate a User
// @route   PUT /api/v1/users/:id/activate
// @access  Private

exports.activateUser = asyncHandler(async (req, res, next) => {
    const doc = await User.findByIdAndUpdate(req.params.id, { blocked: false }, {
      new: true,
    });
    if (!doc) {
      return next(new ApiError(`No item found with id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: doc });
})

// @desc    Get logged user data
// @route   GET /api/v1/users/me
// @access  protected
exports.getLoggedUserData = (req, res, next) => {
    req.params.id = req.user._id;
    next();
}
// @desc    Update logged user password
// @route   PUT /api/v1/users/changeMyPassword
// @access  protected
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        password: req.body.password
    }, { new: true });

    const token = createToken(user._id);

    res.status(200).json({
        status: "success",
        data: user ,
        token
    });
});

// @desc    Update logged user data
// @route   PUT /api/v1/users/updateMe
// @access  protected
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        name: req.body.name,    
        email: req.body.email,
        phone: req.body.phone,
    }, { new: true });

    res.status(200).json({
        status: "success",
        data: user
    });
});
// @desc    Delete logged user account
// @route   DELETE /api/v1/users/deleteMe
// @access  protected
exports.deleteLoggedUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { blocked: true }, {
      new: true,
    });
    res.status(204).json({ data: null });
});