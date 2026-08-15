const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
  updateProductLocation,
} = require("../controllers/productController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  productValidator,
} = require("../validators/productValidator");

const validate = require("../middleware/validationMiddleware");

const router = express.Router();

// Public - all approved products
router.get(
  "/",
  getProducts
);

// Producer - own products
router.get(
  "/my-products",
  protect,
  authorize("PRODUCER"),
  getMyProducts
);

// Public - single product
router.get(
  "/:id",
  getProductById
);

// Producer - create product
router.post(
  "/",
  protect,
  authorize("PRODUCER"),
  productValidator,
  validate,
  createProduct
);

// Producer - update product
router.put(
  "/:id",
  protect,
  authorize("PRODUCER"),
  updateProduct
);

// Producer - update product location
router.put(
  "/:id/location",
  protect,
  authorize("PRODUCER"),
  updateProductLocation
);

// Producer - deactivate product
router.delete(
  "/:id",
  protect,
  authorize("PRODUCER"),
  deleteProduct
);

module.exports = router;