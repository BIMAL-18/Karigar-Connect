const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getProducerOrders,
  updateProducerOrderStatus,
} = require("../controllers/orderController");

const authorize = require("../middleware/authorize");

const protect = require("../middleware/authMiddleware");

const {
  createOrderValidator,
} = require("../validators/orderValidator");

const validate = require("../middleware/validationMiddleware");

const router = express.Router();

// Create order from cart
router.post(
  "/",
  protect,
  createOrderValidator,
  validate,
  createOrder
);

// Get logged-in user's orders
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// Get single order
router.get(
  "/:id",
  protect,
  getOrderById
);

// Cancel order
router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);
// Producer orders
router.get(
  "/producer",
  protect,
  authorize("PRODUCER"),
  getProducerOrders
);

// Update producer order status
router.put(
  "/producer/:id/status",
  protect,
  authorize("PRODUCER"),
  updateProducerOrderStatus
);

module.exports = router;