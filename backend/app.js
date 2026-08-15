const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const producerRoutes = require("./src/routes/producerRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const productRoutes = require("./src/routes/productRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const cartRoutes = require("./src/routes/cartRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const adminOrderRoutes = require("./src/routes/adminOrderRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const wishlistRoutes = require("./src/routes/wishlistRoutes");
const errorMiddleware = require("./src/middleware/errorMiddleware");

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookies
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

app.use("/api", limiter);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "KarigarConnect API is running."
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(
  "/api/producers",
  producerRoutes
);
app.use(
  "/api/categories",
  categoryRoutes
);
app.use(
  "/api/products",
  productRoutes
);
app.use(
  "/api/admin",
  adminRoutes
);
app.use(
  "/api/admin/orders",
  adminOrderRoutes
);
app.use(
  "/api/cart",
  cartRoutes
);
app.use(
  "/api/orders",
  orderRoutes
);
app.use(
  "/api/payments",
  paymentRoutes
);
app.use(
  "/api/reviews",
  reviewRoutes
);
app.use(
  "/api/notifications",
  notificationRoutes
);
app.use(
  "/api/wishlist",
  wishlistRoutes
);
// Error handler
app.use(errorMiddleware);

module.exports = app;
