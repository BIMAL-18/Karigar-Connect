const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2 })
    .withMessage("Name must contain at least 2 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 characters."),

  body("phone")
    .optional()
    .trim(),

  body("role")
    .optional()
    .isIn(["CUSTOMER", "PRODUCER"])
    .withMessage("Invalid role.")
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
];

module.exports = {
  registerValidator,
  loginValidator
};