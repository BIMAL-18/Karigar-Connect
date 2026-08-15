import api from "./api";

const getCategories = async () => {
  const response = await api.get(
    "/categories"
  );

  return response.data;
};

const getCategoryById = async (
  categoryId
) => {
  const response = await api.get(
    `/categories/${categoryId}`
  );

  return response.data;
};

const categoryService = {
  getCategories,
  getCategoryById,
};

export default categoryService;