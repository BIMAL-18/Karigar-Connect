const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/Product");

const createReview = async (
  userId,
  productId,
  orderId,
  rating,
  comment
) => {
  // Check product
  const product =
    await Product.findById(productId);

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  // Check order belongs to customer
  const order =
    await Order.findOne({
      _id: orderId,
      customer: userId,
    });

  if (!order) {
    throw new Error(
      "Order not found."
    );
  }

  // Review only after delivery
  if (
    order.orderStatus !==
    "DELIVERED"
  ) {
    throw new Error(
      "You can review a product only after the order is delivered."
    );
  }

  // Check product exists inside order
  const purchasedProduct =
    order.items.some(
      (item) =>
        item.product.toString() ===
        productId.toString()
    );

  if (!purchasedProduct) {
    throw new Error(
      "You can only review products you purchased."
    );
  }

  // Prevent duplicate review
  const existingReview =
    await Review.findOne({
      product: productId,
      customer: userId,
    });

  if (existingReview) {
    throw new Error(
      "You have already reviewed this product."
    );
  }

  const review =
    await Review.create({
      product: productId,
      customer: userId,
      order: orderId,
      rating: Number(rating),
      comment,
    });

  return await Review.findById(
    review._id
  )
    .populate(
      "customer",
      "name email"
    )
    .populate(
      "product",
      "name images"
    );
};

const getProductReviews = async (
  productId
) => {
  const product =
    await Product.findById(productId);

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  const reviews =
    await Review.find({
      product: productId,
      isApproved: true,
    })
      .populate(
        "customer",
        "name"
      )
      .sort({
        createdAt: -1,
      });

  const totalReviews =
    reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : reviews.reduce(
          (total, review) =>
            total + review.rating,
          0
        ) / totalReviews;

  return {
    reviews,
    totalReviews,
    averageRating:
      Math.round(
        averageRating * 10
      ) / 10,
  };
};

const getMyReviews = async (
  userId
) => {
  return await Review.find({
    customer: userId,
  })
    .populate(
      "product",
      "name images"
    )
    .populate(
      "order",
      "orderNumber"
    )
    .sort({
      createdAt: -1,
    });
};

const updateReview = async (
  userId,
  reviewId,
  rating,
  comment
) => {
  const review =
    await Review.findOne({
      _id: reviewId,
      customer: userId,
    });

  if (!review) {
    throw new Error(
      "Review not found."
    );
  }

  if (rating !== undefined) {
    review.rating = Number(rating);
  }

  if (comment !== undefined) {
    review.comment = comment.trim();
  }

  await review.save();

  return await Review.findById(
    review._id
  )
    .populate(
      "customer",
      "name email"
    )
    .populate(
      "product",
      "name images"
    );
};

const deleteReview = async (
  userId,
  reviewId
) => {
  const review =
    await Review.findOne({
      _id: reviewId,
      customer: userId,
    });

  if (!review) {
    throw new Error(
      "Review not found."
    );
  }

  await review.deleteOne();

  return true;
};

module.exports = {
  createReview,
  getProductReviews,
  getMyReviews,
  updateReview,
  deleteReview,
};