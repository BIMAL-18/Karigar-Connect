import api from "./api";

const deliveryLocationService = {
  // ==========================================
  // UPDATE LIVE LOCATION
  // ==========================================

  updateDeliveryLocation: async (
    assignmentId,
    latitude,
    longitude,
    accuracy = null,
    speed = null,
    heading = null
  ) => {
    const response = await api.post(
      `/delivery-locations/${assignmentId}/update`,
      {
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
      }
    );

    return response.data;
  },

  // ==========================================
  // GET CURRENT LOCATION
  // ==========================================

  getDeliveryLocation: async (
    assignmentId
  ) => {
    const response = await api.get(
      `/delivery-locations/${assignmentId}`
    );

    return response.data;
  },

  // ==========================================
  // STOP TRACKING
  // ==========================================

  stopDeliveryLocation: async (
    assignmentId
  ) => {
    const response = await api.post(
      `/delivery-locations/${assignmentId}/stop`
    );

    return response.data;
  },
};

export default deliveryLocationService;