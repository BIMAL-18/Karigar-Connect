const orderService = require("../services/orderService");

const createOrder = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await orderService.createOrder(
        req.user._id,
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Order created successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (
  req,
  res,
  next
) => {
  try {
    const orders =
      await orderService.getMyOrders(
        req.user._id
      );

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await orderService.getOrderById(
        req.user._id,
        req.params.id
      );

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (
  req,
  res,
  next
) => {
  try {
    const order =
      await orderService.cancelOrder(
        req.user._id,
        req.params.id,
        req.body.reason
      );

    res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully.",
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};