const reviewService = require("../services/reviewService");

const createReview = async (
  req,
  res,
  next
) => {
  try {
    const {
      productId,
      orderId,
      rating,
      comment,
    } = req.body;

    if (
      !productId ||
      !orderId ||
      !rating ||
      !comment
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID, order ID, rating and comment are required.",
      });
    }

    if (
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5.",
      });
    }

    const review =
      await reviewService.createReview(
        req.user._id,
        productId,
        orderId,
        rating,
        comment
      );

    res.status(201).json({
      success: true,
      message:
        "Review added successfully.",
      review,
    });
  } catch (error) {
    next(error);
  }
};

const getProductReviews = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await reviewService.getProductReviews(
        req.params.productId
      );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getMyReviews = async (
  req,
  res,
  next
) => {
  try {
    const reviews =
      await reviewService.getMyReviews(
        req.user._id
      );

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (
  req,
  res,
  next
) => {
  try {
    const {
      rating,
      comment,
    } = req.body;

    if (
      rating === undefined &&
      comment === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating or comment is required.",
      });
    }

    if (
      rating !== undefined &&
      (Number(rating) < 1 ||
        Number(rating) > 5)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5.",
      });
    }

    const review =
      await reviewService.updateReview(
        req.user._id,
        req.params.id,
        rating,
        comment
      );

    res.status(200).json({
      success: true,
      message:
        "Review updated successfully.",
      review,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (
  req,
  res,
  next
) => {
  try {
    await reviewService.deleteReview(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Review deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews,
  getMyReviews,
  updateReview,
  deleteReview,
};