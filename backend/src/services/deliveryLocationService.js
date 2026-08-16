const mongoose = require("mongoose");

const DeliveryLocation = require("../models/DeliveryLocation");
const DeliveryAssignment = require("../models/DeliveryAssignment");
const DeliveryPerson = require("../models/DeliveryPerson");

// ======================================================
// FIND DELIVERY PERSON
// ======================================================

const findDeliveryPerson = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  // Try user reference first
  let deliveryPerson =
    await DeliveryPerson.findOne({
      user: userId,
    });

  // Some projects may use _id directly
  if (!deliveryPerson) {
    if (mongoose.Types.ObjectId.isValid(userId)) {
      deliveryPerson =
        await DeliveryPerson.findById(userId);
    }
  }

  if (!deliveryPerson) {
    const error = new Error(
      "Delivery person not found."
    );

    error.statusCode = 404;

    throw error;
  }

  return deliveryPerson;
};

// ======================================================
// FIND ASSIGNMENT
// ======================================================

const findAssignment = async (
  assignmentId,
  deliveryPersonId
) => {
  if (!assignmentId) {
    const error = new Error(
      "Assignment ID is required."
    );

    error.statusCode = 400;

    throw error;
  }

  if (
    !mongoose.Types.ObjectId.isValid(
      assignmentId
    )
  ) {
    const error = new Error(
      "Invalid assignment ID."
    );

    error.statusCode = 400;

    throw error;
  }

  const assignment =
    await DeliveryAssignment.findOne({
      _id: assignmentId,
      deliveryPerson: deliveryPersonId,
    });

  if (!assignment) {
    const error = new Error(
      "Delivery assignment not found or does not belong to you."
    );

    error.statusCode = 404;

    throw error;
  }

  return assignment;
};

// ======================================================
// UPDATE DELIVERY LOCATION
// ======================================================

const updateDeliveryLocation = async (
  userId,
  assignmentId,
  locationData
) => {
  const {
    latitude,
    longitude,
    accuracy,
    speed,
    heading,
  } = locationData;

  // ------------------------------------------
  // Validate latitude
  // ------------------------------------------

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (!Number.isFinite(lat)) {
    const error = new Error(
      "Latitude must be a valid number."
    );

    error.statusCode = 400;

    throw error;
  }

  if (!Number.isFinite(lng)) {
    const error = new Error(
      "Longitude must be a valid number."
    );

    error.statusCode = 400;

    throw error;
  }

  if (lat < -90 || lat > 90) {
    const error = new Error(
      "Latitude must be between -90 and 90."
    );

    error.statusCode = 400;

    throw error;
  }

  if (lng < -180 || lng > 180) {
    const error = new Error(
      "Longitude must be between -180 and 180."
    );

    error.statusCode = 400;

    throw error;
  }

  // ------------------------------------------
  // Find delivery person
  // ------------------------------------------

  const deliveryPerson =
    await findDeliveryPerson(userId);

  // ------------------------------------------
  // Find assignment
  // ------------------------------------------

  const assignment =
    await findAssignment(
      assignmentId,
      deliveryPerson._id
    );

  // ------------------------------------------
  // Optional numeric values
  // ------------------------------------------

  let numericAccuracy = null;
  let numericSpeed = null;
  let numericHeading = null;

  if (
    accuracy !== undefined &&
    accuracy !== null &&
    accuracy !== ""
  ) {
    numericAccuracy = Number(accuracy);

    if (!Number.isFinite(numericAccuracy)) {
      numericAccuracy = null;
    }
  }

  if (
    speed !== undefined &&
    speed !== null &&
    speed !== ""
  ) {
    numericSpeed = Number(speed);

    if (!Number.isFinite(numericSpeed)) {
      numericSpeed = null;
    }
  }

  if (
    heading !== undefined &&
    heading !== null &&
    heading !== ""
  ) {
    numericHeading = Number(heading);

    if (!Number.isFinite(numericHeading)) {
      numericHeading = null;
    }
  }

  // ------------------------------------------
  // Update or create location
  // ------------------------------------------

  const location =
    await DeliveryLocation.findOneAndUpdate(
      {
        assignment: assignment._id,
      },
      {
        $set: {
          deliveryPerson:
            deliveryPerson._id,

          latitude: lat,

          longitude: lng,

          accuracy: numericAccuracy,

          speed: numericSpeed,

          heading: numericHeading,

          isTracking: true,

          lastUpdatedAt: new Date(),
        },
      },
      {
        new: true,

        upsert: true,

        runValidators: true,

        setDefaultsOnInsert: true,
      }
    );

  return location;
};

// ======================================================
// GET DELIVERY LOCATION
// ======================================================

const getDeliveryLocation = async (
  userId,
  assignmentId
) => {
  // ------------------------------------------
  // Find delivery person
  // ------------------------------------------

  const deliveryPerson =
    await findDeliveryPerson(userId);

  // ------------------------------------------
  // Verify assignment
  // ------------------------------------------

  const assignment =
    await findAssignment(
      assignmentId,
      deliveryPerson._id
    );

  // ------------------------------------------
  // Find location
  // ------------------------------------------

  const location =
    await DeliveryLocation.findOne({
      assignment: assignment._id,
    });

  if (!location) {
    const error = new Error(
      "Delivery location has not been updated yet."
    );

    error.statusCode = 404;

    throw error;
  }

  return location;
};

// ======================================================
// STOP DELIVERY TRACKING
// ======================================================

const stopDeliveryLocation = async (
  userId,
  assignmentId
) => {
  // ------------------------------------------
  // Find delivery person
  // ------------------------------------------

  const deliveryPerson =
    await findDeliveryPerson(userId);

  // ------------------------------------------
  // Verify assignment
  // ------------------------------------------

  const assignment =
    await findAssignment(
      assignmentId,
      deliveryPerson._id
    );

  // ------------------------------------------
  // Stop tracking
  // ------------------------------------------

  const location =
    await DeliveryLocation.findOneAndUpdate(
      {
        assignment: assignment._id,
      },
      {
        $set: {
          isTracking: false,

          lastUpdatedAt: new Date(),
        },
      },
      {
        new: true,
      }
    );

  if (!location) {
    return {
      success: true,

      message:
        "Location tracking stopped.",

      data: null,
    };
  }

  return {
    success: true,

    message:
      "Delivery location tracking stopped.",

    data: location,
  };
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  updateDeliveryLocation,
  getDeliveryLocation,
  stopDeliveryLocation,
};