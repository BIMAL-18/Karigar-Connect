const express = require("express");

const {
  assignDelivery,
  getMyAssignments,
  getMyActiveAssignments,
  acceptAssignment,
  rejectAssignment,
  updateDeliveryStatus,
  getAssignmentByOrder,
} = require("../controllers/deliveryAssignmentController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const router =
  express.Router();


// Admin - assign delivery person
router.post(
  "/assign",
  protect,
  authorize("ADMIN"),
  assignDelivery
);


// Delivery person - all assignments
router.get(
  "/my-deliveries",
  protect,
  authorize("DELIVERY"),
  getMyAssignments
);


// Delivery person - active assignments
router.get(
  "/my-deliveries/active",
  protect,
  authorize("DELIVERY"),
  getMyActiveAssignments
);


// Delivery person - accept
router.put(
  "/:id/accept",
  protect,
  authorize("DELIVERY"),
  acceptAssignment
);


// Delivery person - reject
router.put(
  "/:id/reject",
  protect,
  authorize("DELIVERY"),
  rejectAssignment
);


// Delivery person - update status
router.put(
  "/:id/status",
  protect,
  authorize("DELIVERY"),
  updateDeliveryStatus
);


// Admin/customer - assignment by order
router.get(
  "/order/:orderId",
  protect,
  getAssignmentByOrder
);


module.exports = router;