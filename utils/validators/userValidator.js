const { check, body } = require('express-validator');

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const slugify = require("slugify");
const bcrypt = require('bcryptjs');
const User = require("../../models/userModel");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),

  validatorMiddleware,
];
exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 2 })
    .withMessage("User name must be at least 2 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email address").custom((val) =>
      // Check if email already exists in the database
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists"));
        }
      })
    ),
    check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters").custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    check("confirmPassword")
    .notEmpty()
    .withMessage("User confirm password is required"),

    check("profileImage")
    .optional(),
    check("phone").optional().isMobilePhone("ar-EG")
    .withMessage("Invalid phone number"),

    check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
  validatorMiddleware,
];
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address").custom((val) =>
      // Check if email already exists in the database
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists"));
        }
      })
    ),
    check("phone").optional().isMobilePhone("ar-EG")
    .withMessage("Invalid phone number"),
    check("profileImage").optional(),
    check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
  validatorMiddleware,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];
exports.activateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];
exports.changeUserPasswordValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('currentPassword')
    .notEmpty()
    .withMessage('You must enter your current password'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('You must enter the password confirm'),
  body('password')
    .notEmpty()
    .withMessage('You must enter new password')
    .custom(async (val, { req }) => {
      // 1) Verify current password
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error('There is no user for this id');
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      console.log(isCorrectPassword);
      if (!isCorrectPassword) {
        throw new Error('Incorrect current password');
      }

      // 2) Verify password confirm
      if (val !== req.body.confirmPassword) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    }),
  validatorMiddleware,
];
exports.updateLoggedUserValidator = [
  
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address").custom((val) =>
      // Check if email already exists in the database
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already exists"));
        }
      })
    ),
    check("phone").optional().isMobilePhone("ar-EG")
    .withMessage("Invalid phone number"),
  
  validatorMiddleware,
];