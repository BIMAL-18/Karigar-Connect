const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlist,
} = require("../controllers/wishlistController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getWishlist
);

router.post(
  "/:productId",
  protect,
  addToWishlist
);

router.delete(
  "/:productId",
  protect,
  removeFromWishlist
);

router.delete(
  "/",
  protect,
  clearWishlist
);

router.get(
  "/check/:productId",
  protect,
  checkWishlist
);

module.exports = router;