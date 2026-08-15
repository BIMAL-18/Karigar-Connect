const express = require("express");

const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getMyNotifications
);

router.get(
  "/unread-count",
  protect,
  getUnreadCount
);

router.put(
  "/read-all",
  protect,
  markAllAsRead
);

router.put(
  "/:id/read",
  protect,
  markAsRead
);

router.delete(
  "/:id",
  protect,
  deleteNotification
);

router.delete(
  "/",
  protect,
  deleteAllNotifications
);

module.exports = router;