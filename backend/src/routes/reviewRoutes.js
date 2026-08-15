const express = require("express");

const {
  createReview,
  getProductReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create review
router.post(
  "/",
  protect,
  createReview
);

// Get product reviews
router.get(
  "/product/:productId",
  getProductReviews
);

// Get logged-in user's reviews
router.get(
  "/my-reviews",
  protect,
  getMyReviews
);

// Update review
router.put(
  "/:id",
  protect,
  updateReview
);

// Delete review
router.delete(
  "/:id",
  protect,
  deleteReview
);

module.exports = router;