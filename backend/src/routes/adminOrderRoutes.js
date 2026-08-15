const express = require("express");

const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/adminOrderController");

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

const router = express.Router();

// Get all orders
router.get(
  "/",
  protect,
  authorize("ADMIN"),
  getAllOrders
);

// Get single order
router.get(
  "/:id",
  protect,
  authorize("ADMIN"),
  getOrderById
);

// Update order status
router.put(
  "/:id/status",
  protect,
  authorize("ADMIN"),
  updateOrderStatus
);

module.exports = router;