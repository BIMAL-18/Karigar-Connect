const deliveryPersonService =
  require("../services/deliveryPersonService");


// Create profile
const createDeliveryPerson =
  async (
    req,
    res,
    next
  ) => {
    try {
      const deliveryPerson =
        await deliveryPersonService.createDeliveryPerson(
          req.user._id,
          req.body
        );

      res.status(201).json({
        success: true,
        message:
          "Delivery person profile created successfully.",
        deliveryPerson,
      });
    } catch (error) {
      next(error);
    }
  };


// Get own profile
const getMyDeliveryProfile =
  async (
    req,
    res,
    next
  ) => {
    try {
      const deliveryPerson =
        await deliveryPersonService.getMyDeliveryProfile(
          req.user._id
        );

      res.status(200).json({
        success: true,
        deliveryPerson,
      });
    } catch (error) {
      next(error);
    }
  };


// Update profile
const updateDeliveryProfile =
  async (
    req,
    res,
    next
  ) => {
    try {
      const deliveryPerson =
        await deliveryPersonService.updateDeliveryProfile(
          req.user._id,
          req.body
        );

      res.status(200).json({
        success: true,
        message:
          "Delivery profile updated successfully.",
        deliveryPerson,
      });
    } catch (error) {
      next(error);
    }
  };


// Update availability
const updateAvailability =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        isAvailable,
      } = req.body;

      const deliveryPerson =
        await deliveryPersonService.updateAvailability(
          req.user._id,
          isAvailable
        );

      res.status(200).json({
        success: true,
        message:
          "Availability updated successfully.",
        isAvailable:
          deliveryPerson.isAvailable,
      });
    } catch (error) {
      next(error);
    }
  };


// Update location
const updateLocation =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        longitude,
        latitude,
      } = req.body;

      if (
        longitude ===
          undefined ||
        latitude ===
          undefined
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Longitude and latitude are required.",
        });
      }

      const deliveryPerson =
        await deliveryPersonService.updateLocation(
          req.user._id,
          longitude,
          latitude
        );

      res.status(200).json({
        success: true,
        message:
          "Location updated successfully.",
        location:
          deliveryPerson.currentLocation,
        lastLocationUpdate:
          deliveryPerson.lastLocationUpdate,
      });
    } catch (error) {
      next(error);
    }
  };


// Available delivery persons
const getAvailableDeliveryPersons =
  async (
    req,
    res,
    next
  ) => {
    try {
      const deliveryPersons =
        await deliveryPersonService.getAvailableDeliveryPersons();

      res.status(200).json({
        success: true,
        count:
          deliveryPersons.length,
        deliveryPersons,
      });
    } catch (error) {
      next(error);
    }
  };


module.exports = {
  createDeliveryPerson,
  getMyDeliveryProfile,
  updateDeliveryProfile,
  updateAvailability,
  updateLocation,
  getAvailableDeliveryPersons,
};