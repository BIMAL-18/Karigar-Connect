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

const getProducts = async (
  filters = {}
) => {
  const {
    search,
    category,
    province,
    district,
    minPrice,
    maxPrice,
    sort = "newest",
    page = 1,
    limit = 12,
  } = filters;

  const query = {
    isActive: true,
    verificationStatus: "APPROVED",
  };

  // Search
  if (search) {
    query.$text = {
      $search: search,
    };
  }

  // Category
  if (category) {
    query.category = category;
  }

  // Province
  if (province) {
    query.province = {
      $regex: province,
      $options: "i",
    };
  }

  // District
  if (district) {
    query.district = {
      $regex: district,
      $options: "i",
    };
  }

  // Price range
  if (
    minPrice !== undefined ||
    maxPrice !== undefined
  ) {
    query.price = {};

    if (minPrice !== undefined) {
      query.price.$gte =
        Number(minPrice);
    }

    if (maxPrice !== undefined) {
      query.price.$lte =
        Number(maxPrice);
    }
  }

  // Pagination
  const currentPage =
    Math.max(Number(page), 1);

  const currentLimit =
    Math.min(
      Math.max(Number(limit), 1),
      100
    );

  const skip =
    (currentPage - 1) *
    currentLimit;

  // Sorting
  let sortOption = {
    createdAt: -1,
  };

  switch (sort) {
    case "oldest":
      sortOption = {
        createdAt: 1,
      };
      break;

    case "price_asc":
      sortOption = {
        price: 1,
      };
      break;

    case "price_desc":
      sortOption = {
        price: -1,
      };
      break;

    case "name_asc":
      sortOption = {
        name: 1,
      };
      break;

    case "name_desc":
      sortOption = {
        name: -1,
      };
      break;

    case "newest":
    default:
      sortOption = {
        createdAt: -1,
      };
      break;
  }

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
        .sort(sortOption)
        .skip(skip)
        .limit(currentLimit),

      Product.countDocuments(query),
    ]);

  return {
    products,
    total,
    page: currentPage,
    limit: currentLimit,
    pages: Math.ceil(
      total / currentLimit
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
    if (
      updateData[field] !==
      undefined
    ) {
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

// Get nearby products
const getNearbyProducts = async (
  longitude,
  latitude,
  distance = 10
) => {
  const maxDistance =
    Number(distance) * 1000;

  const products =
    await Product.find({
      isActive: true,
      verificationStatus: "APPROVED",

      originLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              Number(longitude),
              Number(latitude),
            ],
          },

          $maxDistance:
            maxDistance,
        },
      },
    })
      .populate(
        "producer",
        "businessName province district"
      )
      .populate(
        "category",
        "name"
      );

  return products;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
  updateProductLocation,
  getNearbyProducts,
};
