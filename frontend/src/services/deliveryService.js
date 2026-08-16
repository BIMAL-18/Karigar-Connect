import api from "./api";

const deliveryService = {
  // Get delivery person's profile
  getMyProfile: async () => {
    const response = await api.get("/delivery-person/me");
    return response.data;
  },

  // Get orders assigned to the logged-in delivery person
  getMyAssignments: async () => {
    const response = await api.get(
      "/delivery-assignments/my"
    );
    return response.data;
  },

  // Accept an assigned delivery
  acceptAssignment: async (assignmentId) => {
    const response = await api.put(
      `/delivery-assignments/${assignmentId}/accept`
    );

    return response.data;
  },

  // Update delivery status
  updateStatus: async (
    assignmentId,
    status
  ) => {
    const response = await api.put(
      `/delivery-assignments/${assignmentId}/status`,
      {
        status,
      }
    );

    return response.data;
  },

  // Update delivery person's current location
  updateLocation: async (
    assignmentId,
    longitude,
    latitude
  ) => {
    const response = await api.put(
      `/delivery-routes/${assignmentId}/location`,
      {
        longitude,
        latitude,
      }
    );

    return response.data;
  },

  // Get delivery route
  getRoute: async (assignmentId) => {
    const response = await api.get(
      `/delivery-routes/${assignmentId}`
    );

    return response.data;
  },

  // Get delivery QR
  getQr: async (assignmentId) => {
    const response = await api.get(
      `/delivery-qr/${assignmentId}`
    );

    return response.data;
  },

  // Verify delivery QR
  verifyQr: async (
    assignmentId,
    qrCode
  ) => {
    const response = await api.post(
      `/delivery-qr/${assignmentId}/verify`,
      {
        qrCode,
      }
    );

    return response.data;
  },
};

export default deliveryService;