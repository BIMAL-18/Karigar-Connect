const mongoose = require("mongoose");

const deliveryAssignmentSchema =
  new mongoose.Schema(
    {
      order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        unique: true,
      },

      deliveryPerson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryPerson",
        required: true,
      },

      assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      status: {
        type: String,
        enum: [
          "ASSIGNED",
          "ACCEPTED",
          "PICKED_UP",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
          "CANCELLED",
          "REJECTED",
        ],
        default: "ASSIGNED",
      },

      assignedAt: {
        type: Date,
        default: Date.now,
      },

      acceptedAt: {
        type: Date,
        default: null,
      },

      pickedUpAt: {
        type: Date,
        default: null,
      },

      outForDeliveryAt: {
        type: Date,
        default: null,
      },

      deliveredAt: {
        type: Date,
        default: null,
      },

      rejectedAt: {
        type: Date,
        default: null,
      },

      notes: {
        type: String,
        trim: true,
        default: "",
      },

      deliveryLocation: {
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

      route: {
        type: [[Number]],
        default: [],
      },

      distance: {
        type: Number,
        default: 0,
      },

      estimatedTime: {
        type: Number,
        default: 0,
      },

      routeUpdatedAt: {
        type: Date,
        default: null,
      },

      // QR verification
      deliveryQrToken: {
        type: String,
        unique: true,
        sparse: true,
      },

      deliveryQrCode: {
        type: String,
        default: null,
      },

      qrVerified: {
        type: Boolean,
        default: false,
      },

      qrVerifiedAt: {
        type: Date,
        default: null,
      },
    },

    {
      timestamps: true,
    }
  );

// Index for finding assignments by delivery person and status
deliveryAssignmentSchema.index({
  deliveryPerson: 1,
  status: 1,
});

// Geospatial index for customer delivery location
deliveryAssignmentSchema.index({
  deliveryLocation: "2dsphere",
});

module.exports = mongoose.model(
  "DeliveryAssignment",
  deliveryAssignmentSchema
);
