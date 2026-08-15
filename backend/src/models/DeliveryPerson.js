const mongoose = require("mongoose");

const deliveryPersonSchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },

      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      vehicleType: {
        type: String,
        enum: [
          "BIKE",
          "SCOOTER",
          "CAR",
          "VAN",
          "OTHER",
        ],
        required: true,
      },

      vehicleNumber: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
      },

      licenseNumber: {
        type: String,
        required: true,
        trim: true,
      },

      profileImage: {
        type: String,
        default: null,
      },

      isAvailable: {
        type: Boolean,
        default: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      verificationStatus: {
        type: String,
        enum: [
          "PENDING",
          "APPROVED",
          "REJECTED",
        ],
        default: "PENDING",
      },

      currentLocation: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },

        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },

      lastLocationUpdate: {
        type: Date,
        default: null,
      },
    },

    {
      timestamps: true,
    }
  );


// Geospatial index
deliveryPersonSchema.index({
  currentLocation: "2dsphere",
});


module.exports =
  mongoose.model(
    "DeliveryPerson",
    deliveryPersonSchema
  );