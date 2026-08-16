import api from "./api";

const getProducts = async (
  params = {}
) => {
  const response = await api.get(
    "/products",
    {
      params,
    }
  );

  return response.data;
};

const getProductById = async (
  id
) => {
  const response = await api.get(
    `/products/${id}`
  );

  return response.data;
};

const getMyProducts = async () => {
  const response = await api.get(
    "/products/my-products"
  );

  return response.data;
};

const createProduct = async (
  productData
) => {
  const response = await api.post(
    "/products",
    productData
  );

  return response.data;
};

const updateProduct = async (
  id,
  productData
) => {
  const response = await api.put(
    `/products/${id}`,
    productData
  );

  return response.data;
};

const deleteProduct = async (
  id
) => {
  const response = await api.delete(
    `/products/${id}`
  );

  return response.data;
};

const updateProductLocation = async (
  id,
  longitude,
  latitude
) => {
  const response = await api.put(
    `/products/${id}/location`,
    {
      longitude,
      latitude,
    }
  );

  return response.data;
};

export default {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductLocation,
};