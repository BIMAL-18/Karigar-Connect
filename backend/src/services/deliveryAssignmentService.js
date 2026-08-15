const DeliveryAssignment = require("../models/DeliveryAssignment");
const DeliveryPerson = require("../models/DeliveryPerson");
const Order = require("../models/Order");


// Admin assigns delivery person
const assignDelivery = async (
  adminId,
  orderId,
  deliveryPersonId,
  notes = ""
) => {
  const order =
    await Order.findById(orderId);

  if (!order) {
    throw new Error(
      "Order not found."
    );
  }

  if (
    order.orderStatus ===
      "DELIVERED" ||
    order.orderStatus ===
      "CANCELLED"
  ) {
    throw new Error(
      "This order cannot be assigned for delivery."
    );
  }

  const deliveryPerson =
    await DeliveryPerson.findById(
      deliveryPersonId
    );

  if (!deliveryPerson) {
    throw new Error(
      "Delivery person not found."
    );
  }

  if (
    deliveryPerson.verificationStatus !==
    "APPROVED"
  ) {
    throw new Error(
      "Delivery person is not approved."
    );
  }

  if (
    !deliveryPerson.isActive
  ) {
    throw new Error(
      "Delivery person is inactive."
    );
  }

  if (
    !deliveryPerson.isAvailable
  ) {
    throw new Error(
      "Delivery person is currently unavailable."
    );
  }

  // Check existing assignment
  const existingAssignment =
    await DeliveryAssignment.findOne({
      order: orderId,
      status: {
        $nin: [
          "DELIVERED",
          "CANCELLED",
          "REJECTED",
        ],
      },
    });

  if (existingAssignment) {
    throw new Error(
      "This order is already assigned to a delivery person."
    );
  }

  const assignment =
    await DeliveryAssignment.create({
      order: orderId,
      deliveryPerson:
        deliveryPersonId,
      assignedBy: adminId,
      notes,
    });

  // Delivery person becomes unavailable
  deliveryPerson.isAvailable =
    false;

  await deliveryPerson.save();

  // Update order status
  order.orderStatus =
    "CONFIRMED";

  await order.save();

  return await DeliveryAssignment.findById(
    assignment._id
  )
    .populate(
      "deliveryPerson",
      "fullName phone vehicleType vehicleNumber currentLocation"
    )
    .populate(
      "order"
    );
};


// Delivery person gets own assignments
const getMyAssignments =
  async (userId) => {
    const deliveryPerson =
      await DeliveryPerson.findOne({
        user: userId,
      });

    if (!deliveryPerson) {
      throw new Error(
        "Delivery person profile not found."
      );
    }

    return await DeliveryAssignment.find({
      deliveryPerson:
        deliveryPerson._id,
    })
      .populate(
        "order"
      )
      .sort({
        createdAt: -1,
      });
  };


// Get active assignments
const getMyActiveAssignments =
  async (userId) => {
    const deliveryPerson =
      await DeliveryPerson.findOne({
        user: userId,
      });

    if (!deliveryPerson) {
      throw new Error(
        "Delivery person profile not found."
      );
    }

    return await DeliveryAssignment.find({
      deliveryPerson:
        deliveryPerson._id,

      status: {
        $nin: [
          "DELIVERED",
          "CANCELLED",
          "REJECTED",
        ],
      },
    })
      .populate("order")
      .sort({
        createdAt: -1,
      });
  };


// Delivery person accepts assignment
const acceptAssignment =
  async (
    userId,
    assignmentId
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

    const assignment =
      await DeliveryAssignment.findOne({
        _id: assignmentId,
        deliveryPerson:
          deliveryPerson._id,
      });

    if (!assignment) {
      throw new Error(
        "Delivery assignment not found."
      );
    }

    if (
      assignment.status !==
      "ASSIGNED"
    ) {
      throw new Error(
        "This assignment cannot be accepted."
      );
    }

    assignment.status =
      "ACCEPTED";

    assignment.acceptedAt =
      new Date();

    await assignment.save();

    return assignment;
  };


// Delivery person rejects assignment
const rejectAssignment =
  async (
    userId,
    assignmentId,
    notes = ""
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

    const assignment =
      await DeliveryAssignment.findOne({
        _id: assignmentId,
        deliveryPerson:
          deliveryPerson._id,
      });

    if (!assignment) {
      throw new Error(
        "Delivery assignment not found."
      );
    }

    if (
      assignment.status !==
      "ASSIGNED"
    ) {
      throw new Error(
        "This assignment cannot be rejected."
      );
    }

    assignment.status =
      "REJECTED";

    assignment.rejectedAt =
      new Date();

    assignment.notes =
      notes;

    await assignment.save();

    // Make delivery person available again
    deliveryPerson.isAvailable =
      true;

    await deliveryPerson.save();

    return assignment;
  };


// Update delivery status
const updateDeliveryStatus =
  async (
    userId,
    assignmentId,
    status
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

    const assignment =
      await DeliveryAssignment.findOne({
        _id: assignmentId,
        deliveryPerson:
          deliveryPerson._id,
      }).populate("order");

    if (!assignment) {
      throw new Error(
        "Delivery assignment not found."
      );
    }

    const allowedStatuses = [
      "PICKED_UP",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      throw new Error(
        "Invalid delivery status."
      );
    }

    // Status transition validation
    if (
      status === "PICKED_UP" &&
      assignment.status !==
        "ACCEPTED"
    ) {
      throw new Error(
        "Order must be accepted before pickup."
      );
    }

    if (
      status ===
        "OUT_FOR_DELIVERY" &&
      assignment.status !==
        "PICKED_UP"
    ) {
      throw new Error(
        "Order must be picked up first."
      );
    }

    if (
      status === "DELIVERED" &&
      assignment.status !==
        "OUT_FOR_DELIVERY"
    ) {
      throw new Error(
        "Order must be out for delivery first."
      );
    }

    assignment.status =
      status;

    const now = new Date();

    if (
      status === "PICKED_UP"
    ) {
      assignment.pickedUpAt =
        now;
    }

    if (
      status ===
      "OUT_FOR_DELIVERY"
    ) {
      assignment.outForDeliveryAt =
        now;
    }

    if (
      status === "DELIVERED"
    ) {
      assignment.deliveredAt =
        now;

      deliveryPerson.isAvailable =
        true;

      await deliveryPerson.save();
    }

    await assignment.save();

    // Update main order status
    if (
      assignment.order
    ) {
      if (
        status ===
        "PICKED_UP"
      ) {
        assignment.order.orderStatus =
          "PROCESSING";
      }

      if (
        status ===
        "OUT_FOR_DELIVERY"
      ) {
        assignment.order.orderStatus =
          "SHIPPED";
      }

      if (
        status === "DELIVERED"
      ) {
        assignment.order.orderStatus =
          "DELIVERED";
      }

      await assignment.order.save();
    }

    return assignment;
  };


// Get assignment by order
const getAssignmentByOrder =
  async (orderId) => {
    const assignment =
      await DeliveryAssignment.findOne({
        order: orderId,
      })
        .populate(
          "deliveryPerson",
          "fullName phone vehicleType vehicleNumber currentLocation lastLocationUpdate"
        )
        .populate(
          "order"
        );

    if (!assignment) {
      throw new Error(
        "Delivery assignment not found."
      );
    }

    return assignment;
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