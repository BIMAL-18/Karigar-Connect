const paymentService = require("../services/paymentService");

const createPayment = async (
  req,
  res,
  next
) => {
  try {
    const {
      orderId,
    } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID is required.",
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

module.exports = {
  createPayment,
  getPaymentByOrder,
};