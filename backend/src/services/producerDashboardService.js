const Producer = require("../models/Producer");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getProducer = async (userId) => {
  const producer = await Producer.findOne({
    user: userId,
  });

  if (!producer) {
    throw new Error(
      "Producer profile not found."
    );
  }

  return producer;
};

const getDashboardStats = async (
  userId
) => {
  const producer =
    await getProducer(userId);

  const producerId = producer._id;

  const [
    totalProducts,
    activeProducts,
    pendingProducts,
  ] = await Promise.all([
    Product.countDocuments({
      producer: producerId,
    }),

    Product.countDocuments({
      producer: producerId,
      isActive: true,
      verificationStatus: "APPROVED",
    }),

    Product.countDocuments({
      producer: producerId,
      verificationStatus: "PENDING",
    }),
  ]);

  /*
   * Orders containing products
   * belonging to this producer.
   */
  const producerOrders =
    await Order.find({
      "items.producer": producerId,
    });

  const totalOrders =
    producerOrders.length;

  const pendingOrders =
    producerOrders.filter(
      (order) =>
        [
          "PENDING",
          "CONFIRMED",
          "PROCESSING",
        ].includes(
          order.orderStatus
        )
    ).length;

  const shippedOrders =
    producerOrders.filter(
      (order) =>
        order.orderStatus ===
        "SHIPPED"
    ).length;

  const deliveredOrders =
    producerOrders.filter(
      (order) =>
        order.orderStatus ===
        "DELIVERED"
    ).length;

  /*
   * Calculate producer sales
   * only from delivered orders.
   */
  let totalSales = 0;

  producerOrders.forEach(
    (order) => {
      if (
        order.orderStatus !==
        "DELIVERED"
      ) {
        return;
      }

      order.items.forEach(
        (item) => {
          if (
            item.producer &&
            item.producer.toString() ===
              producerId.toString()
          ) {
            totalSales +=
              Number(item.price) *
              Number(item.quantity);
          }
        }
      );
    }
  );

  return {
    products: {
      total: totalProducts,
      active: activeProducts,
      pending: pendingProducts,
    },

    orders: {
      total: totalOrders,
      pending: pendingOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
    },

    sales: {
      total: totalSales,
    },
  };
};

const getRecentOrders = async (
  userId,
  limit = 10
) => {
  const producer =
    await getProducer(userId);

  const orders =
    await Order.find({
      "items.producer":
        producer._id,
    })
      .populate(
        "customer",
        "name email"
      )
      .sort({
        createdAt: -1,
      })
      .limit(Number(limit));

  /*
   * Return only products belonging
   * to the logged-in producer.
   */
  const result = orders.map(
    (order) => {
      const producerItems =
        order.items.filter(
          (item) =>
            item.producer &&
            item.producer.toString() ===
              producer._id.toString()
        );

      return {
        _id: order._id,
        orderNumber:
          order.orderNumber,
        customer:
          order.customer,
        orderStatus:
          order.orderStatus,
        paymentStatus:
          order.paymentStatus,
        createdAt:
          order.createdAt,
        items: producerItems,
      };
    }
  );

  return result;
};

const getProducerProducts = async (
  userId
) => {
  const producer =
    await getProducer(userId);

  return await Product.find({
    producer: producer._id,
  })
    .populate(
      "category",
      "name"
    )
    .sort({
      createdAt: -1,
    });
};

module.exports = {
  getDashboardStats,
  getRecentOrders,
  getProducerProducts,
};