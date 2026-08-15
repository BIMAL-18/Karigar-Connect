const express = require("express");

const {
  getDashboardStats,
  getRecentOrders,
  getRecentUsers,
  getRecentProducts,
} = require("../controllers/adminDashboardController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router = express.Router();


// Dashboard statistics
router.get(
  "/stats",
  protect,
  authorize("ADMIN"),
  getDashboardStats
);


// Recent orders
router.get(
  "/recent-orders",
  protect,
  authorize("ADMIN"),
  getRecentOrders
);


// Recent users
router.get(
  "/recent-users",
  protect,
  authorize("ADMIN"),
  getRecentUsers
);


// Recent products
router.get(
  "/recent-products",
  protect,
  authorize("ADMIN"),
  getRecentProducts
);


module.exports = router;