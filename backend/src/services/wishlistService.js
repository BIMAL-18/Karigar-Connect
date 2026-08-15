const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({
    customer: userId,
  }).populate({
    path: "products",
    select:
      "name description price images stock category producer location isApproved",
    populate: [
      {
        path: "category",
        select: "name",
      },
      {
        path: "producer",
        select:
          "businessName phone location",
      },
    ],
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      customer: userId,
      products: [],
    });
  }

  return wishlist;
};

const addToWishlist = async (
  userId,
  productId
) => {
  const product = await Product.findById(
    productId
  );

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  if (product.isApproved === false) {
    throw new Error(
      "This product is not available."
    );
  }

  let wishlist = await Wishlist.findOne({
    customer: userId,
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      customer: userId,
      products: [productId],
    });
  } else {
    const alreadyExists =
      wishlist.products.some(
        (id) =>
          id.toString() ===
          productId.toString()
      );

    if (alreadyExists) {
      throw new Error(
        "Product is already in your wishlist."
      );
    }

    wishlist.products.push(productId);

    await wishlist.save();
  }

  return await Wishlist.findById(
    wishlist._id
  ).populate({
    path: "products",
    select:
      "name description price images stock category producer",
    populate: [
      {
        path: "category",
        select: "name",
      },
      {
        path: "producer",
        select:
          "businessName",
      },
    ],
  });
};

const removeFromWishlist = async (
  userId,
  productId
) => {
  const wishlist =
    await Wishlist.findOne({
      customer: userId,
    });

  if (!wishlist) {
    throw new Error(
      "Wishlist not found."
    );
  }

  const productExists =
    wishlist.products.some(
      (id) =>
        id.toString() ===
        productId.toString()
    );

  if (!productExists) {
    throw new Error(
      "Product is not in your wishlist."
    );
  }

  wishlist.products =
    wishlist.products.filter(
      (id) =>
        id.toString() !==
        productId.toString()
    );

  await wishlist.save();

  return await Wishlist.findById(
    wishlist._id
  ).populate({
    path: "products",
    select:
      "name description price images stock category producer",
    populate: [
      {
        path: "category",
        select: "name",
      },
      {
        path: "producer",
        select: "businessName",
      },
    ],
  });
};

const clearWishlist = async (
  userId
) => {
  const wishlist =
    await Wishlist.findOne({
      customer: userId,
    });

  if (!wishlist) {
    throw new Error(
      "Wishlist not found."
    );
  }

  wishlist.products = [];

  await wishlist.save();

  return wishlist;
};

const checkWishlist = async (
  userId,
  productId
) => {
  const wishlist =
    await Wishlist.findOne({
      customer: userId,
    });

  if (!wishlist) {
    return false;
  }

  return wishlist.products.some(
    (id) =>
      id.toString() ===
      productId.toString()
  );
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlist,
};