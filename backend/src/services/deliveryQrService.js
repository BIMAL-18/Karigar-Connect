const crypto = require("crypto");
const QRCode = require("qrcode");

const DeliveryAssignment = require("../models/DeliveryAssignment");
const DeliveryPerson = require("../models/DeliveryPerson");

// ======================================================
// HELPER
// ======================================================

const getDeliveryPerson = async (userId) => {
  const deliveryPerson = await DeliveryPerson.findOne({
    user: userId,
  });

  if (!deliveryPerson) {
    throw new Error("Delivery person profile not found.");
  }

  return deliveryPerson;
};

// ======================================================
// GENERATE DELIVERY QR
// ======================================================

const generateDeliveryQr = async (
  userId,
  assignmentId
) => {
  const deliveryPerson =
    await getDeliveryPerson(userId);

  const assignment =
    await DeliveryAssignment.findOne({
      _id: assignmentId,
      deliveryPerson: deliveryPerson._id,
    });

  if (!assignment) {
    throw new Error(
      "Delivery assignment not found."
    );
  }

  console.log(
    "Generating QR for assignment:",
    assignment._id.toString()
  );

  console.log(
    "Current assignment status:",
    assignment.status
  );

  // --------------------------------------------------
  // QR SHOULD NOT BE GENERATED FOR FINAL/INVALID STATES
  // --------------------------------------------------

  const blockedStatuses = [
    "DELIVERED",
    "CANCELLED",
    "REJECTED",
  ];

  if (
    blockedStatuses.includes(
      assignment.status
    )
  ) {
    throw new Error(
      `QR code cannot be generated for this delivery. Current status: ${assignment.status}`
    );
  }

  // --------------------------------------------------
  // ALLOW PICKED_UP AND OUT_FOR_DELIVERY
  // --------------------------------------------------

  const allowedStatuses = [
    "ASSIGNED",
    "ACCEPTED",
    "PICKED_UP",
    "OUT_FOR_DELIVERY",
  ];

  if (
    !allowedStatuses.includes(
      assignment.status
    )
  ) {
    throw new Error(
      `QR code cannot be generated for delivery with status: ${assignment.status}`
    );
  }

  // --------------------------------------------------
  // GENERATE SECURE TOKEN
  // --------------------------------------------------

  const token =
    crypto
      .randomBytes(32)
      .toString("hex");

  // --------------------------------------------------
  // QR PAYLOAD
  // --------------------------------------------------

  const qrData = JSON.stringify({
    type: "DELIVERY_VERIFICATION",

    assignmentId:
      assignment._id.toString(),

    token,
  });

  // --------------------------------------------------
  // GENERATE QR IMAGE
  // --------------------------------------------------

  const qrCode =
    await QRCode.toDataURL(
      qrData,
      {
        errorCorrectionLevel: "H",
        width: 400,
        margin: 2,
      }
    );

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

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

    token,

    status:
      assignment.status,

    message:
      "Delivery QR code generated successfully.",
  };
};

// ======================================================
// VERIFY DELIVERY QR
// ======================================================

const verifyDeliveryQr = async (
  userId,
  assignmentId,
  token
) => {
  const deliveryPerson =
    await getDeliveryPerson(userId);

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

  console.log(
    "Verifying assignment:",
    assignment._id.toString()
  );

  console.log(
    "Current assignment status:",
    assignment.status
  );

  // --------------------------------------------------
  // ALREADY DELIVERED
  // --------------------------------------------------

  if (
    assignment.status ===
    "DELIVERED"
  ) {
    throw new Error(
      "This order has already been delivered."
    );
  }

  // --------------------------------------------------
  // ALLOW PICKED_UP
  //
  // If status is PICKED_UP, automatically move it
  // to OUT_FOR_DELIVERY before verification.
  // --------------------------------------------------

  if (
    assignment.status ===
    "PICKED_UP"
  ) {
    assignment.status =
      "OUT_FOR_DELIVERY";

    await assignment.save();
  }

  // --------------------------------------------------
  // NOW STATUS MUST BE OUT_FOR_DELIVERY
  // --------------------------------------------------

  if (
    assignment.status !==
    "OUT_FOR_DELIVERY"
  ) {
    throw new Error(
      `Order must be OUT_FOR_DELIVERY before QR verification. Current status: ${assignment.status}`
    );
  }

  // --------------------------------------------------
  // CHECK QR
  // --------------------------------------------------

  if (
    !assignment.deliveryQrToken
  ) {
    throw new Error(
      "Delivery QR code has not been generated."
    );
  }

  if (!token) {
    throw new Error(
      "Delivery QR verification token is required."
    );
  }

  // --------------------------------------------------
  // CLEAN TOKEN
  // --------------------------------------------------

  const receivedToken =
    String(token).trim();

  const storedToken =
    String(
      assignment.deliveryQrToken
    ).trim();

  // --------------------------------------------------
  // CONSTANT-TIME COMPARISON
  // --------------------------------------------------

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

  // --------------------------------------------------
  // SUCCESS
  // --------------------------------------------------

  const now =
    new Date();

  assignment.qrVerified =
    true;

  assignment.qrVerifiedAt =
    now;

  assignment.status =
    "DELIVERED";

  assignment.deliveredAt =
    now;

  await assignment.save();

  // --------------------------------------------------
  // DELIVERY PERSON AVAILABLE
  // --------------------------------------------------

  deliveryPerson.isAvailable =
    true;

  await deliveryPerson.save();

  // --------------------------------------------------
  // UPDATE ORDER
  // --------------------------------------------------

  if (assignment.order) {
    assignment.order.orderStatus =
      "DELIVERED";

    await assignment.order.save();
  }

  return {
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

    deliveredAt:
      assignment.deliveredAt,

    message:
      "QR verified. Delivery completed successfully.",
  };
};

// ======================================================
// GET DELIVERY QR
// ======================================================

const getDeliveryQr = async (
  userId,
  assignmentId
) => {
  const deliveryPerson =
    await getDeliveryPerson(userId);

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

    token:
      assignment.deliveryQrToken,

    qrVerified:
      assignment.qrVerified,

    qrVerifiedAt:
      assignment.qrVerifiedAt,

    status:
      assignment.status,
  };
};

module.exports = {
  generateDeliveryQr,
  verifyDeliveryQr,
  getDeliveryQr,
};