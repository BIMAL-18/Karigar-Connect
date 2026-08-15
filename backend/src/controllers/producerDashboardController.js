const producerDashboardService =
  require("../services/producerDashboardService");

const getDashboardStats = async (
  req,
  res,
  next
) => {
  try {
    const stats =
      await producerDashboardService.getDashboardStats(
        req.user._id
      );

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentOrders = async (
  req,
  res,
  next
) => {
  try {
    const orders =
      await producerDashboardService.getRecentOrders(
        req.user._id,
        req.query.limit || 10
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

const getProducerProducts = async (
  req,
  res,
  next
) => {
  try {
    const products =
      await producerDashboardService.getProducerProducts(
        req.user._id
      );

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getRecentOrders,
  getProducerProducts,
};