import api from "./api";

const createOrder = async (
  orderData
) => {
  const response =
    await api.post(
      "/orders",
      orderData
    );

  return response.data;
};

const getMyOrders = async () => {
  const response =
    await api.get(
      "/orders/my-orders"
    );

  return response.data;
};

const getOrderById = async (
  orderId
) => {
  const response =
    await api.get(
      `/orders/${orderId}`
    );

  return response.data;
};

const cancelOrder = async (
  orderId
) => {
  const response =
    await api.put(
      `/orders/${orderId}/cancel`
    );

  return response.data;
};

export default {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};