const crypto = require("crypto");
const QRCode = require("qrcode");

const DeliveryAssignment =
  require("../models/DeliveryAssignment");

const DeliveryPerson =
  require("../models/DeliveryPerson");


// Generate QR code for delivery
const generateDeliveryQr = async (
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
    [
      "DELIVERED",
      "CANCELLED",
      "REJECTED",
    ].includes(
      assignment.status
    )
  ) {
    throw new Error(
      "QR code cannot be generated for this delivery."
    );
  }


  // Generate secure random token
  const token =
    crypto
      .randomBytes(32)
      .toString("hex");


  // QR data
  const qrData = JSON.stringify({
    type: "DELIVERY_VERIFICATION",
    assignmentId:
      assignment._id.toString(),
    token,
  });


  // Generate QR image as Data URL
  const qrCode =
    await QRCode.toDataURL(
      qrData,
      {
        errorCorrectionLevel: "H",
        width: 400,
        margin: 2,
      }
    );


  assignment.deliveryQrToken =
    token;

  assignment.deliveryQrCode =
    qrCode;

  assignment.qrVerified =
    false;

  assignment.qrVerifiedAt =
    null;


  await assignment.save();


  return {
    assignmentId:
      assignment._id,

    qrCode,

    message:
      "Delivery QR code generated successfully.",
  };
};


// Verify delivery QR
const verifyDeliveryQr = async (
  userId,
  assignmentId,
  token
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


  if (
    assignment.status ===
    "DELIVERED"
  ) {
    throw new Error(
      "This order has already been delivered."
    );
  }


  if (
    assignment.status !==
    "OUT_FOR_DELIVERY"
  ) {
    throw new Error(
      "Order must be out for delivery before QR verification."
    );
  }


  if (
    !assignment.deliveryQrToken
  ) {
    throw new Error(
      "Delivery QR code has not been generated."
    );
  }


  // Secure token comparison
  const receivedToken =
    String(token || "");

  const storedToken =
    String(
      assignment.deliveryQrToken
    );


  const receivedBuffer =
    Buffer.from(
      receivedToken
    );

  const storedBuffer =
    Buffer.from(
      storedToken
    );


  if (
    receivedBuffer.length !==
    storedBuffer.length
  ) {
    throw new Error(
      "Invalid delivery QR code."
    );
  }


  const isValid =
    crypto.timingSafeEqual(
      receivedBuffer,
      storedBuffer
    );


  if (!isValid) {
    throw new Error(
      "Invalid delivery QR code."
    );
  }


  // Verify QR
  assignment.qrVerified =
    true;

  assignment.qrVerifiedAt =
    new Date();

  assignment.status =
    "DELIVERED";

  assignment.deliveredAt =
    new Date();


  await assignment.save();


  // Return delivery person to available state
  deliveryPerson.isAvailable =
    true;

  await deliveryPerson.save();


  // Update order
  if (assignment.order) {
    assignment.order.orderStatus =
      "DELIVERED";

    await assignment.order.save();
  }


  return {
    success: true,

    assignmentId:
      assignment._id,

    orderId:
      assignment.order?._id,

    status:
      assignment.status,

    qrVerified:
      assignment.qrVerified,

    qrVerifiedAt:
      assignment.qrVerifiedAt,
  };
};


// Get QR code
const getDeliveryQr = async (
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
    !assignment.deliveryQrCode
  ) {
    throw new Error(
      "QR code has not been generated."
    );
  }


  return {
    assignmentId:
      assignment._id,

    qrCode:
      assignment.deliveryQrCode,

    qrVerified:
      assignment.qrVerified,

    status:
      assignment.status,
  };
};


module.exports = {
  generateDeliveryQr,
  verifyDeliveryQr,
  getDeliveryQr,
};