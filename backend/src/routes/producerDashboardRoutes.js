const express = require("express");

const {
  getDashboardStats,
  getRecentOrders,
  getProducerProducts,
} = require("../controllers/producerDashboardController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();


// Producer dashboard statistics
router.get(
  "/stats",
  protect,
  authorize("PRODUCER"),
  getDashboardStats
);


// Producer recent orders
router.get(
  "/recent-orders",
  protect,
  authorize("PRODUCER"),
  getRecentOrders
);


// Producer products
router.get(
  "/products",
  protect,
  authorize("PRODUCER"),
  getProducerProducts
);


module.exports = router;