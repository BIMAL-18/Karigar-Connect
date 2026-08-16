const deliveryLocationService =
  require("../services/deliveryLocationService");


// ==========================================
// UPDATE LOCATION
// ==========================================

const updateDeliveryLocation =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
      } = req.body;


      if (
        latitude ===
          undefined ||
        longitude ===
          undefined
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Latitude and longitude are required.",
        });
      }


      const result =
        await deliveryLocationService.updateDeliveryLocation(
          req.user._id,

          req.params.assignmentId,

          {
            latitude,
            longitude,
            accuracy,
            speed,
            heading,
          }
        );


      return res.status(200).json({
        success: true,

        message:
          "Delivery location updated successfully.",

        data: result,
      });
    } catch (error) {
      next(error);
    }
  };


// ==========================================
// GET LOCATION
// ==========================================

const getDeliveryLocation =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await deliveryLocationService.getDeliveryLocation(
          req.user._id,

          req.params.assignmentId
        );


      return res.status(200).json({
        success: true,

        data: result,
      });
    } catch (error) {
      next(error);
    }
  };


// ==========================================
// STOP TRACKING
// ==========================================

const stopDeliveryLocation =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await deliveryLocationService.stopDeliveryLocation(
          req.user._id,

          req.params.assignmentId
        );


      return res.status(200).json({
        success: true,

        ...result,
      });
    } catch (error) {
      next(error);
    }
  };


module.exports = {
  updateDeliveryLocation,
  getDeliveryLocation,
  stopDeliveryLocation,
};