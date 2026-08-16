const express = require("express");

const router = express.Router();

const {
  updateDeliveryLocation,
  getDeliveryLocation,
  stopDeliveryLocation,
} = require("../controllers/deliveryLocationController");

const protect = require("../middleware/authMiddleware");

// ==========================================
// UPDATE LIVE LOCATION
// ==========================================

router.post(
  "/:assignmentId/update",
  protect,
  updateDeliveryLocation
);

// ==========================================
// GET CURRENT LOCATION
// ==========================================

router.get(
  "/:assignmentId",
  protect,
  getDeliveryLocation
);

// ==========================================
// STOP TRACKING
// ==========================================

router.post(
  "/:assignmentId/stop",
  protect,
  stopDeliveryLocation
);

module.exports = router;