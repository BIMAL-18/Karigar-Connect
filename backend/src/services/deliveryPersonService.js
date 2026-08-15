const DeliveryPerson = require("../models/DeliveryPerson");
const User = require("../models/User");


// Create delivery person profile
const createDeliveryPerson = async (
  userId,
  deliveryData
) => {
  const user =
    await User.findById(userId);

  if (!user) {
    throw new Error(
      "User not found."
    );
  }

  if (
    user.role !== "DELIVERY"
  ) {
    throw new Error(
      "User is not a delivery person."
    );
  }

  const existing =
    await DeliveryPerson.findOne({
      user: userId,
    });

  if (existing) {
    throw new Error(
      "Delivery person profile already exists."
    );
  }

  const deliveryPerson =
    await DeliveryPerson.create({
      user: userId,
      ...deliveryData,
    });

  return deliveryPerson;
};


// Get delivery person's profile
const getMyDeliveryProfile =
  async (userId) => {
    const deliveryPerson =
      await DeliveryPerson.findOne({
        user: userId,
      }).populate(
        "user",
        "name email role"
      );

    if (!deliveryPerson) {
      throw new Error(
        "Delivery person profile not found."
      );
    }

    return deliveryPerson;
  };


// Update delivery profile
const updateDeliveryProfile =
  async (
    userId,
    updateData
  ) => {
    const deliveryPerson =
      await DeliveryPerson.findOne({
        user: userId,
      });

    if (!deliveryPerson) {
      throw new Error(
        "Delivery person profile not found."
      );
    }

    const allowedFields = [
      "fullName",
      "phone",
      "vehicleType",
      "vehicleNumber",
      "licenseNumber",
      "profileImage",
    ];

    allowedFields.forEach(
      (field) => {
        if (
          updateData[field] !==
          undefined
        ) {
          deliveryPerson[field] =
            updateData[field];
        }
      }
    );

    return await deliveryPerson.save();
  };


// Update availability
const updateAvailability =
  async (
    userId,
    isAvailable
  ) => {
    const deliveryPerson =
      await DeliveryPerson.findOne({
        user: userId,
      });

    if (!deliveryPerson) {
      throw new Error(
        "Delivery person profile not found."
      );
    }

    deliveryPerson.isAvailable =
      Boolean(isAvailable);

    return await deliveryPerson.save();
  };


// Update current location
const updateLocation =
  async (
    userId,
    longitude,
    latitude
  ) => {
    const deliveryPerson =
      await DeliveryPerson.findOne({
        user: userId,
      });

    if (!deliveryPerson) {
      throw new Error(
        "Delivery person profile not found."
      );
    }

    deliveryPerson.currentLocation =
      {
        type: "Point",

        coordinates: [
          Number(longitude),
          Number(latitude),
        ],
      };

    deliveryPerson.lastLocationUpdate =
      new Date();

    return await deliveryPerson.save();
  };


// Get all available delivery persons
const getAvailableDeliveryPersons =
  async () => {
    return await DeliveryPerson.find({
      isAvailable: true,
      isActive: true,
      verificationStatus:
        "APPROVED",
    }).populate(
      "user",
      "name email"
    );
  };


module.exports = {
  createDeliveryPerson,
  getMyDeliveryProfile,
  updateDeliveryProfile,
  updateAvailability,
  updateLocation,
  getAvailableDeliveryPersons,
};