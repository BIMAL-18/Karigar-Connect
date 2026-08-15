const Payment = require("../models/Payment");
const Order = require("../models/Order");

const createPayment = async (
  userId,
  orderId
) => {
  const order = await Order.findOne({
    _id: orderId,
    customer: userId,
  });

  if (!order) {
    throw new Error(
      "Order not found."
    );
  }

  if (
    order.orderStatus ===
    "CANCELLED"
  ) {
    throw new Error(
      "Cancelled order cannot be paid."
    );
  }

  if (
    order.paymentStatus === "PAID"
  ) {
    throw new Error(
      "Order is already paid."
    );
  }

  let payment =
    await Payment.findOne({
      order: order._id,
    });

  if (payment) {
    return payment;
  }

  payment = await Payment.create({
    order: order._id,
    customer: userId,
    amount: order.totalAmount,
    paymentMethod:
      order.paymentMethod,
    status: "PENDING",
  });

  return payment;
};

const getPaymentByOrder = async (
  userId,
  orderId
) => {
  const order = await Order.findOne({
    _id: orderId,
    customer: userId,
  });

  if (!order) {
    throw new Error(
      "Order not found."
    );
  }

  const payment =
    await Payment.findOne({
      order: orderId,
    });

  if (!payment) {
    throw new Error(
      "Payment not found."
    );
  }

  return payment;
};

const markPaymentCompleted = async (
  paymentId,
  transactionId,
  referenceId
) => {
  const payment =
    await Payment.findById(
      paymentId
    );

  if (!payment) {
    throw new Error(
      "Payment not found."
    );
  }

  payment.status =
    "COMPLETED";

  payment.transactionId =
    transactionId || "";

  payment.referenceId =
    referenceId || "";

  payment.paidAt = new Date();

  await payment.save();

  await Order.findByIdAndUpdate(
    payment.order,
    {
      paymentStatus: "PAID",
      orderStatus: "CONFIRMED",
    }
  );

  return payment;
};

const markPaymentFailed = async (
  paymentId,
  reason
) => {
  const payment =
    await Payment.findById(
      paymentId
    );

  if (!payment) {
    throw new Error(
      "Payment not found."
    );
  }

  payment.status = "FAILED";

  payment.failureReason =
    reason || "Payment failed.";

  await payment.save();

  await Order.findByIdAndUpdate(
    payment.order,
    {
      paymentStatus: "FAILED",
    }
  );

  return payment;
};

module.exports = {
  createPayment,
  getPaymentByOrder,
  markPaymentCompleted,
  markPaymentFailed,
};