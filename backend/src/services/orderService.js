const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Producer = require("../models/Producer");
const {
  createNotification,
} = require("./notificationService");

const generateOrderNumber = () => {
  const timestamp = Date.now();

  const random = Math.floor(
    1000 + Math.random() * 9000
  );

  return `KB-${timestamp}-${random}`;
};

const calculateSubtotal = (items) => {
  return items.reduce(
    (total, item) => {
      return (
        total +
        item.price * item.quantity
      );
    },
    0
  );
};

// Create order
const createOrder = async (
  userId,
  orderData
) => {
  const cart = await Cart.findOne({
    user: userId,
  }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new Error(
      "Your cart is empty."
    );
  }

  const orderItems = [];

  for (const cartItem of cart.items) {
    const product =
      await Product.findOne({
        _id: cartItem.product._id,
        isActive: true,
        verificationStatus: "APPROVED",
      }).populate("producer");

    if (!product) {
      throw new Error(
        "One of the products in your cart is no longer available."
      );
    }

    if (
      product.stock <
      cartItem.quantity
    ) {
      throw new Error(
        `${product.name} does not have enough stock.`
      );
    }

    orderItems.push({
      product: product._id,
      producer: product.producer._id,
      name: product.name,
      image:
        product.images &&
        product.images.length > 0
          ? product.images[0]
          : "",
      price: product.price,
      quantity: cartItem.quantity,
      subtotal:
        product.price *
        cartItem.quantity,
    });
  }

  const subtotal =
    calculateSubtotal(orderItems);

  // Calculate delivery charge
  const deliveryCharge =
    subtotal >= 2000 ? 0 : 100;

  const totalAmount =
    subtotal + deliveryCharge;

  const order = await Order.create({
    orderNumber:
      generateOrderNumber(),

    customer: userId,

    items: orderItems,

    shippingAddress:
      orderData.shippingAddress,

    subtotal,

    deliveryCharge,

    totalAmount,

    paymentMethod:
      orderData.paymentMethod,

    paymentStatus: "PENDING",

    orderStatus: "PENDING",

    notes: orderData.notes || "",
  });

  // Create customer notification
  await createNotification({
    recipient: userId,
    title: "Order Placed",
    message: `Your order ${order.orderNumber} has been placed successfully.`,
    type: "ORDER",
    order: order._id,
  });

  // Reduce stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(
      item.product,
      {
        $inc: {
          stock: -item.quantity,
        },
      }
    );
  }

  // Clear cart
  cart.items = [];
  cart.totalAmount = 0;

  await cart.save();

  return await Order.findById(
    order._id
  )
    .populate(
      "customer",
      "name email phone"
    )
    .populate(
      "items.product",
      "name images"
    )
    .populate(
      "items.producer",
      "businessName province district"
    );
};

// Get my orders
const getMyOrders = async (
  userId
) => {
  return await Order.find({
    customer: userId,
  })
    .populate(
      "items.product",
      "name images"
    )
    .populate(
      "items.producer",
      "businessName"
    )
    .sort({
      createdAt: -1,
    });
};

// Get order by ID
const getOrderById = async (
  userId,
  orderId
) => {
  const order =
    await Order.findOne({
      _id: orderId,
      customer: userId,
    })
      .populate(
        "customer",
        "name email phone"
      )
      .populate(
        "items.product",
        "name images"
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

// Cancel order
const cancelOrder = async (
  userId,
  orderId,
  reason
) => {
  const order =
    await Order.findOne({
      _id: orderId,
      customer: userId,
    });

  if (!order) {
    throw new Error(
      "Order not found."
    );
  }

  if (
    [
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ].includes(order.orderStatus)
  ) {
    throw new Error(
      "This order cannot be cancelled."
    );
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.product,
      {
        $inc: {
          stock: item.quantity,
        },
      }
    );
  }

  order.orderStatus = "CANCELLED";
  order.cancelledAt = new Date();
  order.cancellationReason =
    reason || "Cancelled by customer.";

  await order.save();

  return order;
};

// Get producer orders
const getProducerOrders = async (
  userId
) => {
  const producer =
    await Producer.findOne({
      user: userId,
    });

  if (!producer) {
    throw new Error(
      "Producer profile not found."
    );
  }

  const orders =
    await Order.find({
      "items.producer": producer._id,
    })
      .populate(
        "customer",
        "name email phone"
      )
      .populate(
        "items.product",
        "name images"
      )
      .populate(
        "items.producer",
        "businessName"
      )
      .sort({
        createdAt: -1,
      });

  return orders;
};

// Update producer order status
const updateProducerOrderStatus =
  async (
    userId,
    orderId,
    status
  ) => {
    const producer =
      await Producer.findOne({
        user: userId,
      });

    if (!producer) {
      throw new Error(
        "Producer profile not found."
      );
    }

    const order =
      await Order.findOne({
        _id: orderId,
        "items.producer":
          producer._id,
      });

    if (!order) {
      throw new Error(
        "Order not found."
      );
    }

    const allowedStatuses = [
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      throw new Error(
        "Invalid order status."
      );
    }

    if (
      order.orderStatus ===
      "CANCELLED"
    ) {
      throw new Error(
        "Cancelled order cannot be updated."
      );
    }

    if (
      order.paymentStatus !==
        "PAID" &&
      order.paymentMethod !==
        "COD"
    ) {
      throw new Error(
        "Payment must be completed before processing this order."
      );
    }

    order.orderStatus = status;

    await order.save();

    // Notify customer
    await createNotification({
      recipient: order.customer,
      title: "Order Status Updated",
      message: `Your order ${order.orderNumber} is now ${status}.`,
      type: "ORDER",
      order: order._id,
    });

    return await Order.findById(
      order._id
    )
      .populate(
        "customer",
        "name email phone"
      )
      .populate(
        "items.product",
        "name images"
      )
      .populate(
        "items.producer",
        "businessName"
      );
  };

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getProducerOrders,
  updateProducerOrderStatus,
};
