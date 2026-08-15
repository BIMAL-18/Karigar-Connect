const cartService = require("../services/cartService");

const getCart = async (
  req,
  res,
  next
) => {
  try {
    const cart =
      await cartService.getCart(
        req.user._id
      );

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (
  req,
  res,
  next
) => {
  try {
    const {
      productId,
      quantity,
    } = req.body;

    if (
      !productId ||
      !quantity
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID and quantity are required.",
      });
    }

    if (Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be at least 1.",
      });
    }

    const cart =
      await cartService.addToCart(
        req.user._id,
        productId,
        quantity
      );

    res.status(200).json({
      success: true,
      message:
        "Product added to cart successfully.",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (
  req,
  res,
  next
) => {
  try {
    const {
      quantity,
    } = req.body;

    if (!quantity) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity is required.",
      });
    }

    if (Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be at least 1.",
      });
    }

    const cart =
      await cartService.updateCartItem(
        req.user._id,
        req.params.productId,
        quantity
      );

    res.status(200).json({
      success: true,
      message:
        "Cart item updated successfully.",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (
  req,
  res,
  next
) => {
  try {
    const cart =
      await cartService.removeFromCart(
        req.user._id,
        req.params.productId
      );

    res.status(200).json({
      success: true,
      message:
        "Product removed from cart.",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (
  req,
  res,
  next
) => {
  try {
    await cartService.clearCart(
      req.user._id
    );

    res.status(200).json({
      success: true,
      message:
        "Cart cleared successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};