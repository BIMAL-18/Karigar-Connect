const adminOrderService = require("../services/adminOrderService");

const getAllOrders = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
      paymentStatus,
      search,
    } = req.query;

    const orders =
      await adminOrderService.getAllOrders(
        {
          status,
          paymentStatus,
          search,
        }
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
      await adminOrderService.getOrderById(
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

const updateOrderStatus = async (
  req,
  res,
  next
) => {
  try {
    const {
      status,
    } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message:
          "Order status is required.",
      });
    }

    const order =
      await adminOrderService.updateOrderStatus(
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

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};