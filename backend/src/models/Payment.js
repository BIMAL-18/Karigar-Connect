const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: [
        "COD",
        "ESEWA",
        "KHALTI",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "COMPLETED",
        "FAILED",
        "REFUNDED",
      ],
      default: "PENDING",
    },

    transactionId: {
      type: String,
      default: "",
    },

    referenceId: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    failureReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Payment",
  paymentSchema
);