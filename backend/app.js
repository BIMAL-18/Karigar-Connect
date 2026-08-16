const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");

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

const deliveryPersonRoutes =
  require("./src/routes/deliveryPersonRoutes");

const adminDashboardRoutes =
  require("./src/routes/adminDashboardRoutes");

const apiLimiter =
  require("./src/middleware/rateLimitMiddleware");

const uploadRoutes =
  require("./src/routes/uploadRoutes");

const producerDashboardRoutes =
  require("./src/routes/producerDashboardRoutes");

const deliveryAssignmentRoutes =
  require("./src/routes/deliveryAssignmentRoutes");

const deliveryRouteRoutes =
  require("./src/routes/deliveryRouteRoutes");

const deliveryQrRoutes =
  require("./src/routes/deliveryQrRoutes");

const errorMiddleware =
  require("./src/middleware/errorMiddleware");

const app = express();

// =========================
// SECURITY
// =========================

app.use(helmet());

// =========================
// CORS
// =========================

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  })
);

// =========================
// BODY PARSER
// =========================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// =========================
// COOKIES
// =========================

app.use(cookieParser());

// =========================
// RATE LIMITING
// =========================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});

app.use("/api", limiter);

// =========================
// HEALTH CHECK
// =========================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "KarigarConnect API is running.",
  });
});

// =========================
// ROUTES
// =========================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

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

app.use(
  "/api/admin/dashboard",
  adminDashboardRoutes
);

app.use(
  "/api/producer/dashboard",
  producerDashboardRoutes
);

app.use(
  "/api/uploads",
  uploadRoutes
);

// =========================
// STATIC UPLOADS
// =========================

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "src/uploads"
    )
  )
);

// =========================
// DELIVERY ROUTES
// =========================

app.use(
  "/api/delivery",
  deliveryPersonRoutes
);

app.use(
  "/api/delivery-assignments",
  deliveryAssignmentRoutes
);

app.use(
  "/api/delivery-routes",
  deliveryRouteRoutes
);

app.use(
  "/api/delivery-qr",
  deliveryQrRoutes
);

// =========================
// API RATE LIMITER
// =========================

app.use(
  "/api",
  apiLimiter
);

// =========================
// ERROR HANDLER
// =========================

app.use(errorMiddleware);

module.exports = app;