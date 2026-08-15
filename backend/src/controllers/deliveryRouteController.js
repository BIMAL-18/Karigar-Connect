const deliveryRouteService =
  require("../services/deliveryRouteService");


const calculateRoute =
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
            "Destination longitude and latitude are required.",
        });
      }


      const route =
        await deliveryRouteService.calculateRoute(
          req.user._id,
          req.params.id,
          longitude,
          latitude
        );


      res.status(200).json({
        success: true,
        message:
          "Delivery route calculated successfully.",
        route,
      });

    } catch (error) {
      next(error);
    }
  };


module.exports = {
  calculateRoute,
};