const { body } = require("express-validator");

const createProducerValidator = [
  body("businessName")
    .trim()
    .notEmpty()
    .withMessage("Business name is required.")
    .isLength({ min: 2 })
    .withMessage(
      "Business name must contain at least 2 characters."
    ),

  body("businessType")
    .trim()
    .notEmpty()
    .withMessage("Business type is required."),

  body("province")
    .trim()
    .notEmpty()
    .withMessage("Province is required."),

  body("district")
    .trim()
    .notEmpty()
    .withMessage("District is required."),

  body("municipality")
    .optional()
    .trim(),

  body("ward")
    .optional()
    .trim(),

  body("address")
    .optional()
    .trim(),

  body("phone")
    .optional()
    .trim(),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage(
      "Description cannot exceed 1000 characters."
    ),

  body("story")
    .optional()
    .trim()
    .isLength({ max: 3000 })
    .withMessage(
      "Story cannot exceed 3000 characters."
    ),
];

module.exports = {
  createProducerValidator,
};