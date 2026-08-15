const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  title,
  message,
  type = "SYSTEM",
  order = null,
}) => {
  if (!recipient) {
    throw new Error(
      "Notification recipient is required."
    );
  }

  const notification =
    await Notification.create({
      recipient,
      title,
      message,
      type,
      order,
    });

  return notification;
};

const getMyNotifications = async (
  userId
) => {
  return await Notification.find({
    recipient: userId,
  })
    .populate(
      "order",
      "orderNumber orderStatus paymentStatus totalAmount"
    )
    .sort({
      createdAt: -1,
    });
};

const getUnreadCount = async (
  userId
) => {
  return await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });
};

const markAsRead = async (
  userId,
  notificationId
) => {
  const notification =
    await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

  if (!notification) {
    throw new Error(
      "Notification not found."
    );
  }

  notification.isRead = true;

  await notification.save();

  return notification;
};

const markAllAsRead = async (
  userId
) => {
  await Notification.updateMany(
    {
      recipient: userId,
      isRead: false,
    },
    {
      $set: {
        isRead: true,
      },
    }
  );

  return true;
};

const deleteNotification = async (
  userId,
  notificationId
) => {
  const notification =
    await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

  if (!notification) {
    throw new Error(
      "Notification not found."
    );
  }

  await notification.deleteOne();

  return true;
};

const deleteAllNotifications =
  async (userId) => {
    await Notification.deleteMany({
      recipient: userId,
    });

    return true;
  };

module.exports = {
  createNotification,
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};