const express = require("express");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  categoryValidator,
} = require("../validators/categoryValidator");

const validate = require("../middleware/validationMiddleware");

const router = express.Router();

// Public - get categories
router.get(
  "/",
  getAllCategories
);

// Public - get category
router.get(
  "/:id",
  getCategoryById
);

// Admin - create category
router.post(
  "/",
  protect,
  authorize("ADMIN"),
  categoryValidator,
  validate,
  createCategory
);

// Admin - update category
router.put(
  "/:id",
  protect,
  authorize("ADMIN"),
  categoryValidator,
  validate,
  updateCategory
);

// Admin - deactivate category
router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  deleteCategory
);

module.exports = router;