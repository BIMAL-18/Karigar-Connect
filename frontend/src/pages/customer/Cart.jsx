import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

const Cart = () => {
  const navigate =
    useNavigate();

  const [cart, setCart] =
    useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const storedCart =
      JSON.parse(
        localStorage.getItem(
          "cart"
        ) || "[]"
      );

    setCart(storedCart);
  };

  const updateCart = (
    updatedCart
  ) => {
    setCart(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(
        updatedCart
      )
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  const increaseQuantity = (
    productId
  ) => {
    const updatedCart =
      cart.map((item) => {
        if (
          item.productId ===
          productId
        ) {
          if (
            item.quantity <
            item.stock
          ) {
            return {
              ...item,
              quantity:
                item.quantity + 1,
            };
          }
        }

        return item;
      });

    updateCart(updatedCart);
  };

  const decreaseQuantity = (
    productId
  ) => {
    const updatedCart =
      cart
        .map((item) => {
          if (
            item.productId ===
            productId
          ) {
            if (
              item.quantity > 1
            ) {
              return {
                ...item,
                quantity:
                  item.quantity - 1,
              };
            }
          }

          return item;
        });

    updateCart(updatedCart);
  };

  const removeItem = (
    productId
  ) => {
    const updatedCart =
      cart.filter(
        (item) =>
          item.productId !==
          productId
      );

    updateCart(updatedCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  const subtotal =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          item.quantity,
      0
    );

  const deliveryFee =
    cart.length > 0
      ? 100
      : 0;

  const total =
    subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag
              size={35}
              className="text-gray-500"
            />
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Your Cart is Empty
          </h1>

          <p className="mt-2 text-gray-500">
            Discover local products
            and add something you
            love.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            <ShoppingBag
              size={18}
            />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}

        <div className="mb-8">
          <Link
            to="/products"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
          >
            <ArrowLeft
              size={17}
            />
            Continue Shopping
          </Link>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Shopping
              </p>

              <h1 className="mt-1 text-4xl font-black">
                Your Cart
              </h1>

              <p className="mt-2 text-gray-500">
                {cart.length}{" "}
                {cart.length ===
                1
                  ? "item"
                  : "items"}{" "}
                in your cart
              </p>
            </div>

            <button
              onClick={clearCart}
              className="hidden text-sm font-medium text-red-500 hover:text-red-700 sm:block"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* Cart Items */}

          <div className="space-y-4">
            {cart.map(
              (item) => (
                <div
                  key={
                    item.productId
                  }
                  className="rounded-2xl border bg-white p-4 sm:p-5"
                >
                  <div className="flex gap-4">

                    {/* Image */}

                    <Link
                      to={`/products/${item.productId}`}
                      className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-36 sm:w-36"
                    >
                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
                        }
                        alt={
                          item.name
                        }
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    {/* Information */}

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-4">
                        <Link
                          to={`/products/${item.productId}`}
                          className="line-clamp-2 font-bold hover:underline"
                        >
                          {
                            item.name
                          }
                        </Link>

                        <button
                          onClick={() =>
                            removeItem(
                              item.productId
                            )
                          }
                          className="shrink-0 text-gray-400 hover:text-red-500"
                          title="Remove"
                        >
                          <Trash2
                            size={19}
                          />
                        </button>
                      </div>

                      <p className="mt-2 text-lg font-bold">
                        Rs.{" "}
                        {Number(
                          item.price
                        ).toLocaleString()}
                      </p>

                      <div className="mt-auto flex items-end justify-between gap-4">
                        {/* Quantity */}

                        <div>
                          <p className="mb-1 text-xs text-gray-500">
                            Quantity
                          </p>

                          <div className="flex items-center">
                            <button
                              onClick={() =>
                                decreaseQuantity(
                                  item.productId
                                )
                              }
                              disabled={
                                item.quantity <=
                                1
                              }
                              className="rounded-l-lg border bg-white p-2.5 disabled:opacity-40"
                            >
                              <Minus
                                size={16}
                              />
                            </button>

                            <span className="flex h-10 w-12 items-center justify-center border-y bg-white text-sm font-semibold">
                              {
                                item.quantity
                              }
                            </span>

                            <button
                              onClick={() =>
                                increaseQuantity(
                                  item.productId
                                )
                              }
                              disabled={
                                item.quantity >=
                                item.stock
                              }
                              className="rounded-r-lg border bg-white p-2.5 disabled:opacity-40"
                            >
                              <Plus
                                size={16}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Item total */}

                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            Item Total
                          </p>

                          <p className="mt-1 font-bold">
                            Rs.{" "}
                            {(
                              Number(
                                item.price
                              ) *
                              item.quantity
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            <button
              onClick={clearCart}
              className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 sm:hidden"
            >
              <Trash2
                size={16}
              />
              Clear Cart
            </button>
          </div>

          {/* Summary */}

          <div>
            <div className="sticky top-28 rounded-2xl border bg-white p-6">
              <h2 className="text-xl font-black">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>
                    Subtotal
                  </span>

                  <span>
                    Rs.{" "}
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>
                    Delivery Fee
                  </span>

                  <span>
                    Rs.{" "}
                    {deliveryFee.toLocaleString()}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-black">
                    <span>
                      Total
                    </span>

                    <span>
                      Rs.{" "}
                      {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(
                    "/checkout"
                  )
                }
                className="mt-6 w-full rounded-xl bg-black px-5 py-4 font-bold text-white hover:bg-gray-800"
              >
                Proceed to Checkout
              </button>

              <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                <p>
                  Delivery charges are
                  calculated based on
                  your delivery location.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;