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
    },
    {
      timestamps: true,
    }
  );

deliveryAssignmentSchema.index({
  deliveryPerson: 1,
  status: 1,
});

module.exports =
  mongoose.model(
    "DeliveryAssignment",
    deliveryAssignmentSchema
  );
