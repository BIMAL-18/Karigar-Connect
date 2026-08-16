import api from "./api";

// ===============================
// ADMIN DASHBOARD
// ===============================

export const getAdminDashboard = async () => {
  try {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    throw error;
  }
};

// ===============================
// USERS
// ===============================

export const getAllUsers = async () => {
  try {
    const response = await api.get("/admin/dashboard/recent-users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUserStatus = async (userId, isActive) => {
  try {
    const response = await api.put(`/admin/users/${userId}/status`, {
      isActive,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// ===============================
// PRODUCERS
// ===============================

export const getAllProducers = async () => {
  try {
    const response = await api.get("/admin/producers/pending");
    return response.data;
  } catch (error) {
    console.error("Error fetching producers:", error);
    throw error;
  }
};

export const approveProducer = async (producerId) => {
  try {
    const response = await api.put(
      `/admin/producers/${producerId}/approve`
    );

    return response.data;
  } catch (error) {
    console.error("Error approving producer:", error);
    throw error;
  }
};

export const rejectProducer = async (producerId, reason) => {
  try {
    const response = await api.put(
      `/admin/producers/${producerId}/reject`,
      { rejectionReason: reason }
    );

    return response.data;
  } catch (error) {
    console.error("Error rejecting producer:", error);
    throw error;
  }
};

// ===============================
// PRODUCTS
// ===============================

export const getAllProducts = async () => {
  try {
    const response = await api.get("/admin/products/pending");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const approveProduct = async (productId) => {
  try {
    const response = await api.put(
      `/admin/products/${productId}/approve`
    );

    return response.data;
  } catch (error) {
    console.error("Error approving product:", error);
    throw error;
  }
};

export const rejectProduct = async (productId, reason) => {
  try {
    const response = await api.put(
      `/admin/products/${productId}/reject`,
      { rejectionReason: reason }
    );

    return response.data;
  } catch (error) {
    console.error("Error rejecting product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(
      `/admin/products/${productId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// ===============================
// ORDERS
// ===============================

export const getAllOrders = async () => {
  try {
    const response = await api.get("/admin/orders");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(
      `/admin/orders/${orderId}/status`,
      { status }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// ===============================
// CATEGORIES
// ===============================

export const getAllCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post(
      "/admin/categories",
      categoryData
    );

    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (
  categoryId,
  categoryData
) => {
  try {
    const response = await api.put(
      `/admin/categories/${categoryId}`,
      categoryData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(
      `/admin/categories/${categoryId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};