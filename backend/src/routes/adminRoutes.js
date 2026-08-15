const express = require("express");

const {
  getPendingProducers,
  approveProducer,
  rejectProducer,
  getPendingProducts,
  approveProduct,
  rejectProduct,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();

// All admin routes require ADMIN role
router.use(
  protect,
  authorize("ADMIN")
);

// ===============================
// PRODUCER APPROVAL
// ===============================

// Get pending producers
router.get(
  "/producers/pending",
  getPendingProducers
);

// Approve producer
router.put(
  "/producers/:id/approve",
  approveProducer
);

// Reject producer
router.put(
  "/producers/:id/reject",
  rejectProducer
);

// ===============================
// PRODUCT APPROVAL
// ===============================

// Get pending products
router.get(
  "/products/pending",
  getPendingProducts
);

// Approve product
router.put(
  "/products/:id/approve",
  approveProduct
);

// Reject product
router.put(
  "/products/:id/reject",
  rejectProduct
);

module.exports = router;