const express = require("express");

const {
  calculateRoute,
} = require("../controllers/deliveryRouteController");

const protect =
  require("../middleware/authMiddleware");

const authorize =
  require("../middleware/authorize");


const router =
  express.Router();


// Delivery person calculates route
router.post(
  "/:id/calculate",
  protect,
  authorize("DELIVERY"),
  calculateRoute
);


module.exports =
  router;