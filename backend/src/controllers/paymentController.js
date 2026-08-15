const paymentService = require("../services/paymentService");

// Initialize eSewa payment
const initiateEsewaPayment = async (
  req,
  res,
  next
) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    const payment =
      await paymentService.createEsewaPayment(
        req.user._id,
        orderId
      );

    res.status(200).json({
      success: true,
      message: "eSewa payment initialized.",
      payment,
      paymentUrl:
        process.env.ESEWA_PRODUCT_URL,
    });
  } catch (error) {
    next(error);
  }
};

// Create normal payment
const createPayment = async (
  req,
  res,
  next
) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
    }

    const payment =
      await paymentService.createPayment(
        req.user._id,
        orderId
      );

    res.status(201).json({
      success: true,
      message:
        "Payment initialized successfully.",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// Get payment by order
const getPaymentByOrder = async (
  req,
  res,
  next
) => {
  try {
    const payment =
      await paymentService.getPaymentByOrder(
        req.user._id,
        req.params.orderId
      );

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// Verify eSewa payment
const verifyEsewa = async (
  req,
  res,
  next
) => {
  try {
    const { encodedData } = req.body;

    if (!encodedData) {
      return res.status(400).json({
        success: false,
        message:
          "eSewa response data is required.",
      });
    }

    const result =
      await paymentService.verifyEsewaPayment(
        req.user._id,
        encodedData
      );

    res.status(200).json({
      success: true,
      message:
        "eSewa payment verified successfully.",
      payment: result.payment,
      order: result.order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  getPaymentByOrder,
  initiateEsewaPayment,
  verifyEsewa,
};
