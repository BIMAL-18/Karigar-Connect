const Producer = require("../models/Producer");
const Product = require("../models/Product");

const getPendingProducers = async () => {
  return await Producer.find({
    verificationStatus: "PENDING",
  })
    .populate(
      "user",
      "name email phone"
    )
    .sort({
      createdAt: -1,
    });
};

const approveProducer = async (
  producerId
) => {
  const producer =
    await Producer.findById(
      producerId
    );

  if (!producer) {
    throw new Error(
      "Producer not found."
    );
  }

  producer.verificationStatus =
    "APPROVED";

  producer.rejectionReason = "";

  producer.verifiedAt = new Date();

  await producer.save();

  return producer;
};

const rejectProducer = async (
  producerId,
  rejectionReason
) => {
  const producer =
    await Producer.findById(
      producerId
    );

  if (!producer) {
    throw new Error(
      "Producer not found."
    );
  }

  producer.verificationStatus =
    "REJECTED";

  producer.rejectionReason =
    rejectionReason || "Application rejected.";

  producer.verifiedAt = null;

  await producer.save();

  return producer;
};

const getPendingProducts = async () => {
  return await Product.find({
    verificationStatus: "PENDING",
  })
    .populate(
      "producer",
      "businessName province district"
    )
    .populate(
      "category",
      "name"
    )
    .sort({
      createdAt: -1,
    });
};

const approveProduct = async (
  productId
) => {
  const product =
    await Product.findById(
      productId
    );

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  product.verificationStatus =
    "APPROVED";

  product.rejectionReason = "";

  await product.save();

  return product;
};

const rejectProduct = async (
  productId,
  rejectionReason
) => {
  const product =
    await Product.findById(
      productId
    );

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  product.verificationStatus =
    "REJECTED";

  product.rejectionReason =
    rejectionReason || "Product rejected.";

  await product.save();

  return product;
};

module.exports = {
  getPendingProducers,
  approveProducer,
  rejectProducer,
  getPendingProducts,
  approveProduct,
  rejectProduct,
};