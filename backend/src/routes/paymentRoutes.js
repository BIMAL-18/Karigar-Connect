const express = require("express");

const {
  createPayment,
  getPaymentByOrder,
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Initialize payment
router.post(
  "/",
  protect,
  createPayment
);

// Get payment for an order
router.get(
  "/order/:orderId",
  protect,
  getPaymentByOrder
);

module.exports = router;