const { body } = require("express-validator");

const createOrderValidator = [
  body("shippingAddress.fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required."),

  body("shippingAddress.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required."),

  body("shippingAddress.province")
    .trim()
    .notEmpty()
    .withMessage("Province is required."),

  body("shippingAddress.district")
    .trim()
    .notEmpty()
    .withMessage("District is required."),

  body("shippingAddress.municipality")
    .trim()
    .notEmpty()
    .withMessage(
      "Municipality is required."
    ),

  body("shippingAddress.ward")
    .trim()
    .notEmpty()
    .withMessage("Ward is required."),

  body("shippingAddress.address")
    .trim()
    .notEmpty()
    .withMessage("Address is required."),

  body("paymentMethod")
    .notEmpty()
    .withMessage(
      "Payment method is required."
    )
    .isIn([
      "COD",
      "ESEWA",
      "KHALTI",
    ])
    .withMessage(
      "Invalid payment method."
    ),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage(
      "Notes cannot exceed 1000 characters."
    ),
];

module.exports = {
  createOrderValidator,
};