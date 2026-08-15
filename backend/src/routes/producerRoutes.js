const express = require("express");

const {
  createProducer,
  getMyProducerProfile,
  getProducerById,
  updateProducer,
  updateProducerLocation,
} = require("../controllers/producerController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  createProducerValidator,
} = require("../validators/producerValidator");

const validate = require("../middleware/validationMiddleware");

const router = express.Router();

// Create producer profile
router.post(
  "/",
  protect,
  authorize("PRODUCER"),
  createProducerValidator,
  validate,
  createProducer
);

// Get logged-in producer profile
router.get(
  "/me",
  protect,
  authorize("PRODUCER"),
  getMyProducerProfile
);

// Update producer profile
router.put(
  "/me",
  protect,
  authorize("PRODUCER"),
  createProducerValidator,
  validate,
  updateProducer
);

// Update producer location
router.put(
  "/me/location",
  protect,
  authorize("PRODUCER"),
  updateProducerLocation
);

// Get public producer profile
router.get(
  "/:id",
  getProducerById
);

module.exports = router;