import api from "./api";

const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

const getProductById = async (productId) => {
  const response = await api.get(
    `/products/${productId}`
  );

  return response.data;
};

const getMyProducts = async () => {
  const response = await api.get(
    "/products/my-products"
  );

  return response.data;
};

const productService = {
  getProducts,
  getProductById,
  getMyProducts,
};

export default productService;