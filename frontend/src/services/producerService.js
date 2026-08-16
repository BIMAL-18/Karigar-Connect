import api from "./api";

// ==========================================
// PRODUCER DASHBOARD
// ==========================================

export const getProducerDashboard = async () => {
  try {
    const response = await api.get("/orders/producer");
    return response.data;
  } catch (error) {
    console.error(
      "Producer dashboard error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// GET PRODUCER PRODUCTS
// ==========================================

export const getProducerProducts = async () => {
  try {
    const response = await api.get("/products/producer");
    return response.data;
  } catch (error) {
    console.error(
      "Producer products error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// ADD PRODUCT
// ==========================================

export const addProduct = async (productData) => {
  try {
    const response = await api.post(
      "/products",
      productData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Backend error:",
      error.response?.data || error.message
    );

    console.error(
      "Validation errors:",
      error.response?.data?.errors
    );

    throw error;
  }
};

// ==========================================
// UPDATE PRODUCT
// ==========================================

export const updateProduct = async (
  productId,
  productData
) => {
  try {
    const response = await api.put(
      `/products/${productId}`,
      productData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update product error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(
      `/products/${productId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Delete product error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// UPDATE ORDER STATUS
// ==========================================

export const updateOrderStatus = async (
  orderId,
  status
) => {
  try {
    const response = await api.put(
      `/orders/${orderId}/status`,
      { status }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update order status error:",
      error.response?.data || error.message
    );

    throw error;
  }
};