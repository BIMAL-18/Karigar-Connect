const { body } = require("express-validator");

const productValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ min: 2, max: 200 })
    .withMessage(
      "Product name must be between 2 and 200 characters."
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage(
      "Product description is required."
    ),

  body("price")
    .notEmpty()
    .withMessage("Product price is required.")
    .isFloat({ min: 0 })
    .withMessage(
      "Price must be a valid positive number."
    ),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage(
      "Stock must be a valid non-negative number."
    ),

  body("category")
    .notEmpty()
    .withMessage("Category is required."),

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

  body("originAddress")
    .optional()
    .trim(),

  body("productionMethod")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage(
      "Production method cannot exceed 1000 characters."
    ),
];

module.exports = {
  productValidator,
};