const orderService = require("../services/orderService");

// Create order
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

// Get my orders
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

// Get order by ID
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

// Cancel order
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

// Get producer orders
const getProducerOrders = async (
  req,
  res,
  next
) => {
  try {
    const orders =
      await orderService.getProducerOrders(
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

// Update producer order status
const updateProducerOrderStatus =
  async (
    req,
    res,
    next
  ) => {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message:
            "Order status is required.",
        });
      }

      const order =
        await orderService.updateProducerOrderStatus(
          req.user._id,
          req.params.id,
          status
        );

      res.status(200).json({
        success: true,
        message:
          "Order status updated successfully.",
        order,
      });
    } catch (error) {
      next(error);
    }
  };

// Export controllers
module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getProducerOrders,
  updateProducerOrderStatus,
};
