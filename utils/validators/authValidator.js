const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.signupValidator = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already in use");
        }
      });
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters").custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
  }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required"),
  validatorMiddleware,
];
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  check("password")
    .notEmpty()
    .withMessage("Password is required"),
  validatorMiddleware,
];