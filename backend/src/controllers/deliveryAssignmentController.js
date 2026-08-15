const deliveryAssignmentService =
  require("../services/deliveryAssignmentService");


// Admin assigns delivery
const assignDelivery =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        orderId,
        deliveryPersonId,
        notes,
      } = req.body;

      if (
        !orderId ||
        !deliveryPersonId
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Order ID and delivery person ID are required.",
        });
      }

      const assignment =
        await deliveryAssignmentService.assignDelivery(
          req.user._id,
          orderId,
          deliveryPersonId,
          notes
        );

      res.status(201).json({
        success: true,
        message:
          "Delivery assigned successfully.",
        assignment,
      });
    } catch (error) {
      next(error);
    }
  };


// Delivery person - all assignments
const getMyAssignments =
  async (
    req,
    res,
    next
  ) => {
    try {
      const assignments =
        await deliveryAssignmentService.getMyAssignments(
          req.user._id
        );

      res.status(200).json({
        success: true,
        count:
          assignments.length,
        assignments,
      });
    } catch (error) {
      next(error);
    }
  };


// Delivery person - active assignments
const getMyActiveAssignments =
  async (
    req,
    res,
    next
  ) => {
    try {
      const assignments =
        await deliveryAssignmentService.getMyActiveAssignments(
          req.user._id
        );

      res.status(200).json({
        success: true,
        count:
          assignments.length,
        assignments,
      });
    } catch (error) {
      next(error);
    }
  };


// Accept assignment
const acceptAssignment =
  async (
    req,
    res,
    next
  ) => {
    try {
      const assignment =
        await deliveryAssignmentService.acceptAssignment(
          req.user._id,
          req.params.id
        );

      res.status(200).json({
        success: true,
        message:
          "Delivery assignment accepted.",
        assignment,
      });
    } catch (error) {
      next(error);
    }
  };


// Reject assignment
const rejectAssignment =
  async (
    req,
    res,
    next
  ) => {
    try {
      const assignment =
        await deliveryAssignmentService.rejectAssignment(
          req.user._id,
          req.params.id,
          req.body.notes
        );

      res.status(200).json({
        success: true,
        message:
          "Delivery assignment rejected.",
        assignment,
      });
    } catch (error) {
      next(error);
    }
  };


// Update delivery status
const updateDeliveryStatus =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        status,
      } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message:
            "Delivery status is required.",
        });
      }

      const assignment =
        await deliveryAssignmentService.updateDeliveryStatus(
          req.user._id,
          req.params.id,
          status
        );

      res.status(200).json({
        success: true,
        message:
          "Delivery status updated successfully.",
        assignment,
      });
    } catch (error) {
      next(error);
    }
  };


// Get assignment by order
const getAssignmentByOrder =
  async (
    req,
    res,
    next
  ) => {
    try {
      const assignment =
        await deliveryAssignmentService.getAssignmentByOrder(
          req.params.orderId
        );

      res.status(200).json({
        success: true,
        assignment,
      });
    } catch (error) {
      next(error);
    }
  };


module.exports = {
  assignDelivery,
  getMyAssignments,
  getMyActiveAssignments,
  acceptAssignment,
  rejectAssignment,
  updateDeliveryStatus,
  getAssignmentByOrder,
};