const productService = require("../services/productService");

const createProduct = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await productService.createProduct(
        req.user._id,
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Product created successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await productService.getProducts(
        req.query
      );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await productService.getProductById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

const getMyProducts = async (
  req,
  res,
  next
) => {
  try {
    const products =
      await productService.getMyProducts(
        req.user._id
      );

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await productService.updateProduct(
        req.user._id,
        req.params.id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Product updated successfully and sent for approval.",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (
  req,
  res,
  next
) => {
  try {
    await productService.deleteProduct(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Product deactivated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const updateProductLocation = async (
  req,
  res,
  next
) => {
  try {
    const {
      longitude,
      latitude,
    } = req.body;

    if (
      longitude === undefined ||
      latitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Longitude and latitude are required.",
      });
    }

    const product =
      await productService.updateProductLocation(
        req.user._id,
        req.params.id,
        longitude,
        latitude
      );

    res.status(200).json({
      success: true,
      message:
        "Product origin location updated successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};
const getNearbyProducts = async (
  req,
  res,
  next
) => {
  try {

    const {
      longitude,
      latitude,
      distance = 10,
    } = req.query;

    if (
      !longitude ||
      !latitude
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Longitude and latitude are required.",
      });
    }

    const products =
      await productService.getNearbyProducts(
        longitude,
        latitude,
        distance
      );

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
  updateProductLocation,
  getNearbyProducts,
};