const mongoose = require("mongoose");

const deliveryLocationSchema =
  new mongoose.Schema(
    {
      assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryAssignment",
        required: true,
        unique: true,
        index: true,
      },

      deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPerson",
        required: true,
        index: true,
      },

      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },

      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },

      accuracy: {
        type: Number,
        default: null,
      },

      speed: {
        type: Number,
        default: null,
      },

      heading: {
        type: Number,
        default: null,
      },

      isTracking: {
        type: Boolean,
        default: true,
      },

      lastUpdatedAt: {
        type: Date,
        default: Date.now,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "DeliveryLocation",
    deliveryLocationSchema
  );