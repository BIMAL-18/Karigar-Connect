const Cart = require("../models/Cart");
const Product = require("../models/Product");

const calculateTotal = (items) => {
  return items.reduce(
    (total, item) => {
      return (
        total +
        item.price * item.quantity
      );
    },
    0
  );
};

const getCart = async (userId) => {
  let cart = await Cart.findOne({
    user: userId,
  }).populate({
    path: "items.product",
    populate: [
      {
        path: "producer",
        select:
          "businessName province district",
      },
      {
        path: "category",
        select: "name",
      },
    ],
  });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
      totalAmount: 0,
    });

    cart = await Cart.findById(
      cart._id
    ).populate({
      path: "items.product",
      populate: [
        {
          path: "producer",
          select:
            "businessName province district",
        },
        {
          path: "category",
          select: "name",
        },
      ],
    });
  }

  return cart;
};

const addToCart = async (
  userId,
  productId,
  quantity
) => {
  const product =
    await Product.findOne({
      _id: productId,
      isActive: true,
      verificationStatus: "APPROVED",
    });

  if (!product) {
    throw new Error(
      "Product not found or unavailable."
    );
  }

  if (product.stock < quantity) {
    throw new Error(
      "Requested quantity is not available."
    );
  }

  let cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
    });
  }

  const existingItem =
    cart.items.find(
      (item) =>
        item.product.toString() ===
        productId.toString()
    );

  if (existingItem) {
    const newQuantity =
      existingItem.quantity +
      Number(quantity);

    if (
      newQuantity > product.stock
    ) {
      throw new Error(
        "Requested quantity exceeds available stock."
      );
    }

    existingItem.quantity =
      newQuantity;

    // Keep latest product price
    existingItem.price =
      product.price;
  } else {
    cart.items.push({
      product: product._id,
      quantity: Number(quantity),
      price: product.price,
    });
  }

  cart.totalAmount =
    calculateTotal(cart.items);

  await cart.save();

  return await getCart(userId);
};

const updateCartItem = async (
  userId,
  productId,
  quantity
) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  const item = cart.items.find(
    (item) =>
      item.product.toString() ===
      productId.toString()
  );

  if (!item) {
    throw new Error(
      "Product is not in your cart."
    );
  }

  const product =
    await Product.findById(productId);

  if (!product) {
    throw new Error(
      "Product not found."
    );
  }

  if (
    Number(quantity) > product.stock
  ) {
    throw new Error(
      "Requested quantity exceeds available stock."
    );
  }

  item.quantity = Number(quantity);
  item.price = product.price;

  cart.totalAmount =
    calculateTotal(cart.items);

  await cart.save();

  return await getCart(userId);
};

const removeFromCart = async (
  userId,
  productId
) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  const itemExists = cart.items.some(
    (item) =>
      item.product.toString() ===
      productId.toString()
  );

  if (!itemExists) {
    throw new Error(
      "Product is not in your cart."
    );
  }

  cart.items =
    cart.items.filter(
      (item) =>
        item.product.toString() !==
        productId.toString()
    );

  cart.totalAmount =
    calculateTotal(cart.items);

  await cart.save();

  return await getCart(userId);
};

const clearCart = async (
  userId
) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new Error("Cart not found.");
  }

  cart.items = [];
  cart.totalAmount = 0;

  await cart.save();

  return cart;
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};