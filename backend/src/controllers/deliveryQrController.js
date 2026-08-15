const deliveryQrService =
  require("../services/deliveryQrService");


// Generate QR
const generateDeliveryQr =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await deliveryQrService.generateDeliveryQr(
          req.user._id,
          req.params.id
        );


      res.status(201).json({
        success: true,
        ...result,
      });

    } catch (error) {
      next(error);
    }
  };


// Get QR
const getDeliveryQr =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await deliveryQrService.getDeliveryQr(
          req.user._id,
          req.params.id
        );


      res.status(200).json({
        success: true,
        ...result,
      });

    } catch (error) {
      next(error);
    }
  };


// Verify QR
const verifyDeliveryQr =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        token,
      } = req.body;


      if (!token) {
        return res.status(400).json({
          success: false,
          message:
            "QR verification token is required.",
        });
      }


      const result =
        await deliveryQrService.verifyDeliveryQr(
          req.user._id,
          req.params.id,
          token
        );


      res.status(200).json({
        success: true,
        message:
          "QR verified. Delivery completed successfully.",
        ...result,
      });

    } catch (error) {
      next(error);
    }
  };


module.exports = {
  generateDeliveryQr,
  getDeliveryQr,
  verifyDeliveryQr,
};