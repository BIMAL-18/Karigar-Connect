const Producer = require("../models/Producer");
const User = require("../models/User");

const createProducer = async (userId, producerData) => {
  const existingProducer = await Producer.findOne({
    user: userId,
  });

  if (existingProducer) {
    throw new Error(
      "Producer profile already exists."
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.role !== "PRODUCER") {
    throw new Error(
      "Only producer accounts can create a producer profile."
    );
  }

  const producer = await Producer.create({
    user: userId,
    ...producerData,
  });

  return producer;
};

const getProducerByUserId = async (userId) => {
  const producer = await Producer.findOne({
    user: userId,
  }).populate(
    "user",
    "name email phone avatar"
  );

  if (!producer) {
    throw new Error(
      "Producer profile not found."
    );
  }

  return producer;
};

const getProducerById = async (producerId) => {
  const producer = await Producer.findById(
    producerId
  ).populate(
    "user",
    "name email phone avatar"
  );

  if (!producer) {
    throw new Error(
      "Producer not found."
    );
  }

  return producer;
};

const updateProducer = async (
  userId,
  updateData
) => {
  const producer = await Producer.findOne({
    user: userId,
  });

  if (!producer) {
    throw new Error(
      "Producer profile not found."
    );
  }

  const allowedFields = [
    "businessName",
    "businessType",
    "description",
    "story",
    "phone",
    "province",
    "district",
    "municipality",
    "ward",
    "address",
    "profileImage",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      producer[field] = updateData[field];
    }
  });

  const updatedProducer =
    await producer.save();

  return updatedProducer;
};

const updateProducerLocation = async (
  userId,
  longitude,
  latitude
) => {
  const producer = await Producer.findOne({
    user: userId,
  });

  if (!producer) {
    throw new Error(
      "Producer profile not found."
    );
  }

  producer.location = {
    type: "Point",
    coordinates: [
      Number(longitude),
      Number(latitude),
    ],
  };

  return await producer.save();
};

module.exports = {
  createProducer,
  getProducerByUserId,
  getProducerById,
  updateProducer,
  updateProducerLocation,
};