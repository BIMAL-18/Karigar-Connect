const express = require("express");

const {
  createPayment,
  getPaymentByOrder,
  initiateEsewaPayment,
  verifyEsewa,
} = require("../controllers/paymentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  createPayment
);

router.get(
  "/order/:orderId",
  protect,
  getPaymentByOrder
);

router.post(
  "/esewa/initiate",
  protect,
  initiateEsewaPayment
);

router.post(
  "/esewa/verify",
  protect,
  verifyEsewa
);

module.exports = router;