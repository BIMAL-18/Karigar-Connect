const crypto = require("crypto");
const axios = require("axios");

const Payment = require("../models/Payment");
const Order = require("../models/Order");

// Generate eSewa HMAC-SHA256 signature
const generateEsewaSignature = (
  totalAmount,
  transactionUuid,
  productCode
) => {
  const message =
    `total_amount=${totalAmount},` +
    `transaction_uuid=${transactionUuid},` +
    `product_code=${productCode}`;

  return crypto
    .createHmac(
      "sha256",
      process.env.ESEWA_SECRET_KEY
    )
    .update(message)
    .digest("base64");
};


// =====================================================
// CREATE NORMAL PAYMENT
// =====================================================

const createPayment = async (
  userId,
  orderId
) => {
  const order = await Order.findOne({
    _id: orderId,
    customer: userId,
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.orderStatus === "CANCELLED") {
    throw new Error(
      "Cancelled order cannot be paid."
    );
  }

  if (order.paymentStatus === "PAID") {
    throw new Error(
      "Order is already paid."
    );
  }

  let payment = await Payment.findOne({
    order: order._id,
  });

  if (payment) {
    return payment;
  }

  payment = await Payment.create({
    order: order._id,
    customer: userId,
    amount: order.totalAmount,
    paymentMethod: order.paymentMethod,
    status: "PENDING",
  });

  return payment;
};


// =====================================================
// GET PAYMENT BY ORDER
// =====================================================

const getPaymentByOrder = async (
  userId,
  orderId
) => {
  const order = await Order.findOne({
    _id: orderId,
    customer: userId,
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const payment = await Payment.findOne({
    order: orderId,
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  return payment;
};


// =====================================================
// MARK PAYMENT COMPLETED
// =====================================================

const markPaymentCompleted = async (
  paymentId,
  transactionId,
  referenceId
) => {
  const payment =
    await Payment.findById(paymentId);

  if (!payment) {
    throw new Error(
      "Payment not found."
    );
  }

  payment.status = "COMPLETED";

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


// =====================================================
// MARK PAYMENT FAILED
// =====================================================

const markPaymentFailed = async (
  paymentId,
  reason
) => {
  const payment =
    await Payment.findById(paymentId);

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


// =====================================================
// CREATE ESEWA PAYMENT
// =====================================================

const createEsewaPayment = async (
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

  if (order.paymentStatus === "PAID") {
    throw new Error(
      "Order is already paid."
    );
  }

  if (order.orderStatus === "CANCELLED") {
    throw new Error(
      "Cancelled order cannot be paid."
    );
  }

  let payment = await Payment.findOne({
    order: order._id,
  });

  if (!payment) {
    payment = await Payment.create({
      order: order._id,
      customer: userId,
      amount: order.totalAmount,
      paymentMethod: "ESEWA",
      status: "PENDING",
    });
  }

  const transactionUuid =
    `${order.orderNumber}-${Date.now()}`;

  const productCode =
    process.env.ESEWA_MERCHANT_CODE;

  const signature =
    generateEsewaSignature(
      order.totalAmount,
      transactionUuid,
      productCode
    );

  payment.transactionId =
    transactionUuid;

  await payment.save();

  return {
    amount: order.totalAmount,

    taxAmount: 0,

    totalAmount: order.totalAmount,

    transactionUuid,

    productCode,

    productServiceCharge: 0,

    productDeliveryCharge: 0,

    successUrl:
      process.env.ESEWA_SUCCESS_URL,

    failureUrl:
      process.env.ESEWA_FAILURE_URL,

    signedFieldNames:
      "total_amount,transaction_uuid,product_code",

    signature,

    paymentId: payment._id,
  };
};


// =====================================================
// VERIFY ESEWA PAYMENT
// =====================================================

const verifyEsewaPayment = async (
  userId,
  encodedData
) => {
  let decodedData;

  // Decode eSewa response
  try {
    decodedData = JSON.parse(
      Buffer.from(
        encodedData,
        "base64"
      ).toString("utf-8")
    );
  } catch (error) {
    throw new Error(
      "Invalid eSewa response data."
    );
  }

  const {
    transaction_uuid,
    total_amount,
    product_code,
    transaction_code,
    status,
  } = decodedData;

  // Validate eSewa response
  if (
    !transaction_uuid ||
    total_amount === undefined ||
    !product_code
  ) {
    throw new Error(
      "Invalid eSewa payment response."
    );
  }

  // Find our payment
  const payment =
    await Payment.findOne({
      transactionId:
        transaction_uuid,
      customer: userId,
    });

  if (!payment) {
    throw new Error(
      "Payment record not found."
    );
  }

  // Find associated order
  const order =
    await Order.findById(
      payment.order
    );

  if (!order) {
    throw new Error(
      "Associated order not found."
    );
  }

  // Make sure amount matches
  if (
    Number(total_amount) !==
    Number(order.totalAmount)
  ) {
    throw new Error(
      "Payment amount does not match order amount."
    );
  }

  // Make sure merchant code matches
  if (
    product_code !==
    process.env.ESEWA_MERCHANT_CODE
  ) {
    throw new Error(
      "Invalid eSewa merchant code."
    );
  }

  // If already completed, don't process again
  if (payment.status === "COMPLETED") {
    return {
      payment,
      order,
    };
  }

  // Ask eSewa directly for transaction status
  const response =
    await axios.get(
      process.env.ESEWA_STATUS_URL,
      {
        params: {
          product_code:
            process.env.ESEWA_MERCHANT_CODE,

          total_amount:
            order.totalAmount,

          transaction_uuid:
            transaction_uuid,
        },
      }
    );

  const esewaData =
    response.data;

  // Verify transaction status
  if (
    esewaData.status !==
    "COMPLETE"
  ) {
    payment.status = "FAILED";

    payment.failureReason =
      `eSewa payment status: ${
        esewaData.status || status || "UNKNOWN"
      }`;

    await payment.save();

    await Order.findByIdAndUpdate(
      order._id,
      {
        paymentStatus: "FAILED",
      }
    );

    throw new Error(
      "eSewa payment was not completed."
    );
  }

  // Payment successful
  payment.status =
    "COMPLETED";

  payment.referenceId =
    transaction_code || "";

  payment.paidAt =
    new Date();

  await payment.save();

  // Update order
  await Order.findByIdAndUpdate(
    order._id,
    {
      paymentStatus: "PAID",
      orderStatus: "CONFIRMED",
    }
  );

  const updatedOrder =
    await Order.findById(
      order._id
    );

  return {
    payment,
    order: updatedOrder,
  };
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createPayment,
  getPaymentByOrder,
  markPaymentCompleted,
  markPaymentFailed,
  createEsewaPayment,
  generateEsewaSignature,
  verifyEsewaPayment,
};
