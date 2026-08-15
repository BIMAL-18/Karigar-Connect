const wishlistService = require("../services/wishlistService");

const getWishlist = async (
  req,
  res,
  next
) => {
  try {
    const wishlist =
      await wishlistService.getWishlist(
        req.user._id
      );

    res.status(200).json({
      success: true,
      count:
        wishlist.products.length,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (
  req,
  res,
  next
) => {
  try {
    const wishlist =
      await wishlistService.addToWishlist(
        req.user._id,
        req.params.productId
      );

    res.status(201).json({
      success: true,
      message:
        "Product added to wishlist.",
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (
  req,
  res,
  next
) => {
  try {
    const wishlist =
      await wishlistService.removeFromWishlist(
        req.user._id,
        req.params.productId
      );

    res.status(200).json({
      success: true,
      message:
        "Product removed from wishlist.",
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

const clearWishlist = async (
  req,
  res,
  next
) => {
  try {
    await wishlistService.clearWishlist(
      req.user._id
    );

    res.status(200).json({
      success: true,
      message:
        "Wishlist cleared successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const checkWishlist = async (
  req,
  res,
  next
) => {
  try {
    const exists =
      await wishlistService.checkWishlist(
        req.user._id,
        req.params.productId
      );

    res.status(200).json({
      success: true,
      productId:
        req.params.productId,
      isInWishlist: exists,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlist,
};