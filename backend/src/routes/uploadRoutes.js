const express = require("express");

const {
  uploadProductImages,
  deleteProductImage,
} = require("../controllers/uploadController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const upload = require("../middleware/uploadMiddleware");

const router =
  express.Router();


// Upload product images
router.post(
  "/product-images",
  protect,
  authorize("PRODUCER"),
  upload.array(
    "images",
    5
  ),
  uploadProductImages
);


// Delete product image
router.delete(
  "/product-images",
  protect,
  authorize("PRODUCER"),
  deleteProductImage
);


module.exports = router;