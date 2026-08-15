const categoryService = require("../services/categoryService");

const createCategory = async (
  req,
  res,
  next
) => {
  try {
    const category =
      await categoryService.createCategory(
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Category created successfully.",
      category,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCategories = async (
  req,
  res,
  next
) => {
  try {
    const categories =
      await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (
  req,
  res,
  next
) => {
  try {
    const category =
      await categoryService.getCategoryById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (
  req,
  res,
  next
) => {
  try {
    const category =
      await categoryService.updateCategory(
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Category updated successfully.",
      category,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (
  req,
  res,
  next
) => {
  try {
    await categoryService.deleteCategory(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Category deactivated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};