const express = require("express");
const authLimiter = require("../middleware/authRateLimitMiddleware");
const {
  register,
  login,
  getMe
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const {
  registerValidator,
  loginValidator
} = require("../validators/authValidator");

const validate = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validate,
  authLimiter,
  register
);

router.post(
  "/login",
  loginValidator,
  validate,
  authLimiter,
  login
);

router.get(
  "/me",
  protect,
  getMe
);

module.exports = router;