const express = require("express");

const {
  createDeliveryPerson,
  getMyDeliveryProfile,
  updateDeliveryProfile,
  updateAvailability,
  updateLocation,
  getAvailableDeliveryPersons,
} = require("../controllers/deliveryPersonController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router =
  express.Router();


// Create delivery profile
router.post(
  "/profile",
  protect,
  authorize("DELIVERY"),
  createDeliveryPerson
);


// Get own profile
router.get(
  "/profile",
  protect,
  authorize("DELIVERY"),
  getMyDeliveryProfile
);


// Update profile
router.put(
  "/profile",
  protect,
  authorize("DELIVERY"),
  updateDeliveryProfile
);


// Update availability
router.put(
  "/availability",
  protect,
  authorize("DELIVERY"),
  updateAvailability
);


// Update current location
router.put(
  "/location",
  protect,
  authorize("DELIVERY"),
  updateLocation
);


// Admin can view available delivery persons
router.get(
  "/available",
  protect,
  authorize("ADMIN"),
  getAvailableDeliveryPersons
);


module.exports = router;