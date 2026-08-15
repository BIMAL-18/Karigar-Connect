const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

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

  // You can change this later
  // according to your delivery system.
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

    paymentStatus:
      orderData.paymentMethod === "COD"
        ? "PENDING"
        : "PENDING",

    orderStatus: "PENDING",

    notes: orderData.notes || "",
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

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};