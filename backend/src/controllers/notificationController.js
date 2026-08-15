const notificationService = require("../services/notificationService");

const getMyNotifications = async (
  req,
  res,
  next
) => {
  try {
    const notifications =
      await notificationService.getMyNotifications(
        req.user._id
      );

    const unreadCount =
      await notificationService.getUnreadCount(
        req.user._id
      );

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

const getUnreadCount = async (
  req,
  res,
  next
) => {
  try {
    const unreadCount =
      await notificationService.getUnreadCount(
        req.user._id
      );

    res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (
  req,
  res,
  next
) => {
  try {
    const notification =
      await notificationService.markAsRead(
        req.user._id,
        req.params.id
      );

    res.status(200).json({
      success: true,
      message:
        "Notification marked as read.",
      notification,
    });
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (
  req,
  res,
  next
) => {
  try {
    await notificationService.markAllAsRead(
      req.user._id
    );

    res.status(200).json({
      success: true,
      message:
        "All notifications marked as read.",
    });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (
  req,
  res,
  next
) => {
  try {
    await notificationService.deleteNotification(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Notification deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const deleteAllNotifications =
  async (req, res, next) => {
    try {
      await notificationService.deleteAllNotifications(
        req.user._id
      );

      res.status(200).json({
        success: true,
        message:
          "All notifications deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};