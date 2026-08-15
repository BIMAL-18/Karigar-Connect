const Order = require("../models/Order");

const getAllOrders = async ({
  status,
  paymentStatus,
  search,
}) => {
  const filter = {};

  if (status) {
    filter.orderStatus = status;
  }

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  if (search) {
    filter.$or = [
      {
        orderNumber: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const orders = await Order.find(filter)
    .populate(
      "customer",
      "name email phone"
    )
    .populate(
      "items.product",
      "name images price"
    )
    .populate(
      "items.producer",
      "businessName province district"
    )
    .sort({
      createdAt: -1,
    });

  return orders;
};

const getOrderById = async (
  orderId
) => {
  const order =
    await Order.findById(orderId)
      .populate(
        "customer",
        "name email phone"
      )
      .populate(
        "items.product",
        "name images price"
      )
      .populate(
        "items.producer",
        "businessName province district"
      );

  if (!order) {
    throw new Error(
      "Order not found."
    );
  }

  return order;
};

const updateOrderStatus = async (
  orderId,
  status
) => {
  const order =
    await Order.findById(orderId);

  if (!order) {
    throw new Error(
      "Order not found."
    );
  }

  const allowedStatuses = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  if (
    !allowedStatuses.includes(status)
  ) {
    throw new Error(
      "Invalid order status."
    );
  }

  if (
    order.orderStatus ===
      "DELIVERED" &&
    status !== "DELIVERED"
  ) {
    throw new Error(
      "Delivered order cannot be changed."
    );
  }

  order.orderStatus = status;

  if (status === "CANCELLED") {
    if (
      order.orderStatus ===
      "CANCELLED"
    ) {
      throw new Error(
        "Order is already cancelled."
      );
    }
  }

  await order.save();

  return await Order.findById(
    order._id
  )
    .populate(
      "customer",
      "name email phone"
    )
    .populate(
      "items.product",
      "name images price"
    )
    .populate(
      "items.producer",
      "businessName province district"
    );
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};