const User = require("../models/User");
const Producer = require("../models/Producer");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalProducers,
    totalProducts,
    totalOrders,
    pendingProducers,
    pendingProducts,
    activeProducts,
    deliveredOrders,
  ] = await Promise.all([
    User.countDocuments(),

    Producer.countDocuments(),

    Product.countDocuments(),

    Order.countDocuments(),

    Producer.countDocuments({
      verificationStatus: "PENDING",
    }),

    Product.countDocuments({
      verificationStatus: "PENDING",
    }),

    Product.countDocuments({
      isActive: true,
      verificationStatus: "APPROVED",
    }),

    Order.countDocuments({
      orderStatus: "DELIVERED",
    }),
  ]);

  // Calculate total revenue
  const revenueResult =
    await Order.aggregate([
      {
        $match: {
          orderStatus: "DELIVERED",
          paymentStatus: "COMPLETED",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

  const totalRevenue =
    revenueResult.length > 0
      ? revenueResult[0].totalRevenue
      : 0;

  return {
    users: {
      total: totalUsers,
    },

    producers: {
      total: totalProducers,
      pending: pendingProducers,
    },

    products: {
      total: totalProducts,
      active: activeProducts,
      pending: pendingProducts,
    },

    orders: {
      total: totalOrders,
      delivered: deliveredOrders,
    },

    revenue: {
      total: totalRevenue,
    },
  };
};

const getRecentOrders = async (
  limit = 10
) => {
  return await Order.find()
    .populate(
      "customer",
      "name email"
    )
    .sort({
      createdAt: -1,
    })
    .limit(Number(limit));
};

const getRecentUsers = async (
  limit = 10
) => {
  return await User.find()
    .select(
      "name email role createdAt"
    )
    .sort({
      createdAt: -1,
    })
    .limit(Number(limit));
};

const getRecentProducts = async (
  limit = 10
) => {
  return await Product.find()
    .populate(
      "producer",
      "businessName"
    )
    .populate(
      "category",
      "name"
    )
    .sort({
      createdAt: -1,
    })
    .limit(Number(limit));
};

module.exports = {
  getDashboardStats,
  getRecentOrders,
  getRecentUsers,
  getRecentProducts,
};