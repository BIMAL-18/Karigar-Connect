const adminService = require("../services/adminService");

// ===============================
// PRODUCER MANAGEMENT
// ===============================

const getPendingProducers = async (
  req,
  res,
  next
) => {
  try {
    const producers =
      await adminService.getPendingProducers();

    res.status(200).json({
      success: true,
      count: producers.length,
      producers,
    });
  } catch (error) {
    next(error);
  }
};

const approveProducer = async (
  req,
  res,
  next
) => {
  try {
    const producer =
      await adminService.approveProducer(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message:
        "Producer approved successfully.",
      producer,
    });
  } catch (error) {
    next(error);
  }
};

const rejectProducer = async (
  req,
  res,
  next
) => {
  try {
    const {
      rejectionReason,
    } = req.body;

    const producer =
      await adminService.rejectProducer(
        req.params.id,
        rejectionReason
      );

    res.status(200).json({
      success: true,
      message:
        "Producer rejected successfully.",
      producer,
    });
  } catch (error) {
    next(error);
  }
};

// ===============================
// PRODUCT MANAGEMENT
// ===============================

const getPendingProducts = async (
  req,
  res,
  next
) => {
  try {
    const products =
      await adminService.getPendingProducts();

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const approveProduct = async (
  req,
  res,
  next
) => {
  try {
    const product =
      await adminService.approveProduct(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message:
        "Product approved successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const rejectProduct = async (
  req,
  res,
  next
) => {
  try {
    const {
      rejectionReason,
    } = req.body;

    const product =
      await adminService.rejectProduct(
        req.params.id,
        rejectionReason
      );

    res.status(200).json({
      success: true,
      message:
        "Product rejected successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingProducers,
  approveProducer,
  rejectProducer,
  getPendingProducts,
  approveProduct,
  rejectProduct,
};