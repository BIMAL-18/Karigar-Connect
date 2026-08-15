const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    producer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producer",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: 3000,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    province: {
      type: String,
      required: [true, "Province is required"],
      trim: true,
    },

    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },

    municipality: {
      type: String,
      trim: true,
    },

    ward: {
      type: String,
      trim: true,
    },

    originAddress: {
      type: String,
      trim: true,
    },

    originLocation: {
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

    materials: [
      {
        type: String,
        trim: true,
      },
    ],

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    productionMethod: {
      type: String,
      trim: true,
      maxlength: 1000,
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

    rejectionReason: {
      type: String,
      default: "",
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    totalSales: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index
productSchema.index({
  originLocation: "2dsphere",
});

// Search indexes
productSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

module.exports = mongoose.model(
  "Product",
  productSchema
);