const mongoose = require("mongoose");

const producerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    businessName: {
      type: String,
      required: [true, "Business name is required"],
      trim: true,
      maxlength: 150,
    },

    businessType: {
      type: String,
      required: [true, "Business type is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    story: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    phone: {
      type: String,
      trim: true,
    },

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

    address: {
      type: String,
      trim: true,
    },

    location: {
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

    profileImage: {
      type: String,
      default: "",
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

    verificationDocuments: [
      {
        name: {
          type: String,
          required: true,
        },

        url: {
          type: String,
          required: true,
        },

        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    rejectionReason: {
      type: String,
      default: "",
    },

    verifiedAt: {
      type: Date,
      default: null,
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

// Geospatial index for map/location search
producerSchema.index({
  location: "2dsphere",
});

module.exports = mongoose.model(
  "Producer",
  producerSchema
);