const Category = require("../models/Category");

const createCategory = async (categoryData) => {
  const { name, description, image } =
    categoryData;

  const existingCategory =
    await Category.findOne({
      name: {
        $regex: `^${name}$`,
        $options: "i",
      },
    });

  if (existingCategory) {
    throw new Error(
      "Category already exists."
    );
  }

  const category = await Category.create({
    name,
    description,
    image,
  });

  return category;
};

const getAllCategories = async () => {
  return await Category.find({
    isActive: true,
  }).sort({
    name: 1,
  });
};

const getCategoryById = async (categoryId) => {
  const category =
    await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found.");
  }

  return category;
};

const updateCategory = async (
  categoryId,
  updateData
) => {
  const category =
    await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found.");
  }

  if (updateData.name !== undefined) {
    category.name = updateData.name;
  }

  if (updateData.description !== undefined) {
    category.description =
      updateData.description;
  }

  if (updateData.image !== undefined) {
    category.image = updateData.image;
  }

  if (updateData.isActive !== undefined) {
    category.isActive =
      updateData.isActive;
  }

  return await category.save();
};

const deleteCategory = async (categoryId) => {
  const category =
    await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found.");
  }

  category.isActive = false;

  await category.save();

  return category;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};