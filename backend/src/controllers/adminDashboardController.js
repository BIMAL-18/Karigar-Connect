const adminDashboardService = require("../services/adminDashboardService");


const getDashboardStats = async (
  req,
  res,
  next
) => {
  try {
    const stats =
      await adminDashboardService.getDashboardStats();

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
      await adminDashboardService.getRecentOrders(
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

const getRecentUsers = async (
  req,
  res,
  next
) => {
  try {
    const users =
      await adminDashboardService.getRecentUsers(
        req.query.limit || 10
      );

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentProducts = async (
  req,
  res,
  next
) => {
  try {
    const products =
      await adminDashboardService.getRecentProducts(
        req.query.limit || 10
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
  getRecentUsers,
  getRecentProducts,
};