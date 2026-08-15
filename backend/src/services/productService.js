const Product = require("../models/Product");
const Producer = require("../models/Producer");
const Category = require("../models/Category");

const createProduct = async (
  userId,
  productData
) => {
  const producer =
    await Producer.findOne({
      user: userId,
    });

  if (!producer) {
    throw new Error(
      "Producer profile not found."
    );
  }

  if (
    producer.verificationStatus !==
    "APPROVED"
  ) {
    throw new Error(
      "Your producer account must be approved before adding products."
    );
  }

  const category =
    await Category.findById(
      productData.category
    );

  if (!category || !category.isActive) {
    throw new Error(
      "Invalid or inactive category."
    );
  }

  const product =
    await Product.create({
      ...productData,
      producer: producer._id,
    });

  return await Product.findById(
    product._id
  )
    .populate(
      "producer",
      "businessName province district verificationStatus"
    )
    .populate(
      "category",
      "name"
    );
};

const getProducts = async (filters = {}) => {
  const {
    search,
    category,
    province,
    district,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
  } = filters;

  const query = {
    isActive: true,
    verificationStatus: "APPROVED",
  };

  if (search) {
    query.$text = {
      $search: search,
    };
  }

  if (category) {
    query.category = category;
  }

  if (province) {
    query.province = province;
  }

  if (district) {
    query.district = district;
  }

  if (
    minPrice !== undefined ||
    maxPrice !== undefined
  ) {
    query.price = {};

    if (minPrice !== undefined) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      query.price.$lte = Number(maxPrice);
    }
  }

  const skip =
    (Number(page) - 1) *
    Number(limit);

  const [products, total] =
    await Promise.all([
      Product.find(query)
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
        })
        .skip(skip)
        .limit(Number(limit)),

      Product.countDocuments(query),
    ]);

  return {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(
      total / Number(limit)
    ),
  };
};

const getProductById = async (
  productId
) => {
  const product =
    await Product.findOne({
      _id: productId,
      isActive: true,
    })
      .populate(
        "producer",
        "businessName description story province district municipality address location verificationStatus"
      )
      .populate(
        "category",
        "name description"
      );

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  return product;
};

const getMyProducts = async (
  userId
) => {
  const producer =
    await Producer.findOne({
      user: userId,
    });

  if (!producer) {
    throw new Error(
      "Producer profile not found."
    );
  }

  return await Product.find({
    producer: producer._id,
  })
    .populate(
      "category",
      "name"
    )
    .sort({
      createdAt: -1,
    });
};

const updateProduct = async (
  userId,
  productId,
  updateData
) => {
  const producer =
    await Producer.findOne({
      user: userId,
    });

  if (!producer) {
    throw new Error(
      "Producer profile not found."
    );
  }

  const product =
    await Product.findOne({
      _id: productId,
      producer: producer._id,
    });

  if (!product) {
    throw new Error(
      "Product not found or access denied."
    );
  }

  const allowedFields = [
    "name",
    "description",
    "price",
    "stock",
    "images",
    "category",
    "province",
    "district",
    "municipality",
    "ward",
    "originAddress",
    "originLocation",
    "materials",
    "tags",
    "productionMethod",
  ];

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      product[field] =
        updateData[field];
    }
  });

  // Updated product needs approval again
  product.verificationStatus =
    "PENDING";

  return await product.save();
};

const deleteProduct = async (
  userId,
  productId
) => {
  const producer =
    await Producer.findOne({
      user: userId,
    });

  if (!producer) {
    throw new Error(
      "Producer profile not found."
    );
  }

  const product =
    await Product.findOne({
      _id: productId,
      producer: producer._id,
    });

  if (!product) {
    throw new Error(
      "Product not found or access denied."
    );
  }

  product.isActive = false;

  await product.save();

  return product;
};

const updateProductLocation = async (
  userId,
  productId,
  longitude,
  latitude
) => {
  const producer =
    await Producer.findOne({
      user: userId,
    });

  if (!producer) {
    throw new Error(
      "Producer profile not found."
    );
  }

  const product =
    await Product.findOne({
      _id: productId,
      producer: producer._id,
    });

  if (!product) {
    throw new Error(
      "Product not found or access denied."
    );
  }

  product.originLocation = {
    type: "Point",
    coordinates: [
      Number(longitude),
      Number(latitude),
    ],
  };

  return await product.save();
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
  updateProductLocation,
};