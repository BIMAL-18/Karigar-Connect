const express = require("express");

const {
  generateDeliveryQr,
  getDeliveryQr,
  verifyDeliveryQr,
} = require("../controllers/deliveryQrController");

const protect =
  require("../middleware/authMiddleware");

const authorize =
  require("../middleware/authorize");


const router =
  express.Router();


// Generate QR
router.post(
  "/:id/generate",
  protect,
  authorize("DELIVERY"),
  generateDeliveryQr
);


// Get QR
router.get(
  "/:id",
  protect,
  authorize("DELIVERY"),
  getDeliveryQr
);


// Verify QR and complete delivery
router.post(
  "/:id/verify",
  protect,
  authorize("DELIVERY"),
  verifyDeliveryQr
);


module.exports =
  router;