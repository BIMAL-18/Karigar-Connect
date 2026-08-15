const producerService = require("../services/producerService");

const createProducer = async (
  req,
  res,
  next
) => {
  try {
    const producer =
      await producerService.createProducer(
        req.user._id,
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Producer profile created successfully.",
      producer,
    });
  } catch (error) {
    next(error);
  }
};

const getMyProducerProfile = async (
  req,
  res,
  next
) => {
  try {
    const producer =
      await producerService.getProducerByUserId(
        req.user._id
      );

    res.status(200).json({
      success: true,
      producer,
    });
  } catch (error) {
    next(error);
  }
};

const getProducerById = async (
  req,
  res,
  next
) => {
  try {
    const producer =
      await producerService.getProducerById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      producer,
    });
  } catch (error) {
    next(error);
  }
};

const updateProducer = async (
  req,
  res,
  next
) => {
  try {
    const producer =
      await producerService.updateProducer(
        req.user._id,
        req.body
      );

    res.status(200).json({
      success: true,
      message:
        "Producer profile updated successfully.",
      producer,
    });
  } catch (error) {
    next(error);
  }
};

const updateProducerLocation = async (
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
      longitude === undefined ||
      latitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Longitude and latitude are required.",
      });
    }

    const producer =
      await producerService.updateProducerLocation(
        req.user._id,
        longitude,
        latitude
      );

    res.status(200).json({
      success: true,
      message:
        "Producer location updated successfully.",
      producer,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProducer,
  getMyProducerProfile,
  getProducerById,
  updateProducer,
  updateProducerLocation,
};