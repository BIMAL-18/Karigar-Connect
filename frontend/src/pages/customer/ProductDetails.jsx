import {
  ArrowLeft,
  Check,
  MapPin,
  Minus,
  Package,
  Plus,
  ShoppingCart,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import productService from "../../services/productService";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [added, setAdded] =
    useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);

      const response =
        await productService.getProductById(
          id
        );

      setProduct(
        response.product ||
          response.data ||
          response
      );

      setError("");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load product."
      );
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    if (
      product &&
      quantity < product.stock
    ) {
      setQuantity(
        quantity + 1
      );
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(
        quantity - 1
      );
    }
  };

  const handleAddToCart = () => {
    const existingCart =
      JSON.parse(
        localStorage.getItem(
          "cart"
        ) || "[]"
      );

    const existingItem =
      existingCart.find(
        (item) =>
          item.product ===
          product._id
      );

    let updatedCart;

    if (existingItem) {
      updatedCart =
        existingCart.map(
          (item) =>
            item.product ===
            product._id
              ? {
                  ...item,
                  quantity: Math.min(
                    item.quantity +
                      quantity,
                    product.stock
                  ),
                }
              : item
        );
    } else {
      updatedCart = [
        ...existingCart,
        {
          product:
            product._id,
          name: product.name,
          price: product.price,
          image:
            product.images?.[0] ||
            "",
          quantity,
          stock:
            product.stock,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(
        updatedCart
      )
    );

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="animate-pulse">
            <div className="h-6 w-32 rounded bg-gray-200" />

            <div className="mt-8 grid gap-10 lg:grid-cols-2">
              <div className="h-[500px] rounded-2xl bg-gray-200" />

              <div className="space-y-5">
                <div className="h-10 rounded bg-gray-200" />
                <div className="h-6 w-32 rounded bg-gray-200" />
                <div className="h-32 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <Package
            size={50}
            className="mx-auto text-gray-400"
          />

          <h1 className="mt-5 text-2xl font-black">
            Product Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            {error ||
              "This product is unavailable."}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const image =
    product.images?.[0];

  const producer =
    product.producer;

  const category =
    product.category;

  const outOfStock =
    product.stock <= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Back */}

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">

          {/* Product Image */}

          <div className="overflow-hidden rounded-3xl border bg-white">
            <div className="flex min-h-[450px] items-center justify-center bg-gray-100 lg:min-h-[600px]">

              {image ? (
                <img
                  src={image}
                  alt={product.name}
                  className="h-full max-h-[600px] w-full object-cover"
                />
              ) : (
                <Package
                  size={80}
                  className="text-gray-300"
                />
              )}

            </div>
          </div>

          {/* Product Information */}

          <div className="flex flex-col">

            {category?.name && (
              <span className="w-fit rounded-full bg-gray-200 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                {category.name}
              </span>
            )}

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-3xl font-black">
              Rs.{" "}
              {Number(
                product.price || 0
              ).toLocaleString()}
            </p>

            {/* Stock */}

            <div className="mt-5 flex items-center gap-2">

              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  outOfStock
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
              />

              <span className="text-sm font-semibold">
                {outOfStock
                  ? "Out of stock"
                  : `${product.stock} items available`}
              </span>

            </div>

            {/* Description */}

            <div className="mt-8 border-t pt-8">

              <h2 className="text-lg font-black">
                Description
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {product.description}
              </p>

            </div>

            {/* Materials */}

            {product.materials?.length >
              0 && (
              <div className="mt-7">

                <h2 className="text-sm font-black uppercase tracking-wide">
                  Materials
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {product.materials.map(
                    (
                      material,
                      index
                    ) => (
                      <span
                        key={index}
                        className="rounded-full border bg-white px-3 py-1.5 text-sm"
                      >
                        {material}
                      </span>
                    )
                  )}
                </div>

              </div>
            )}

            {/* Location */}

            <div className="mt-7 flex items-start gap-3 rounded-2xl bg-white p-4">

              <MapPin
                size={20}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-bold">
                  Made in Nepal
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {product.originAddress ||
                    product.district ||
                    "Local Producer"}
                  {product.province &&
                    `, ${product.province}`}
                </p>
              </div>

            </div>

            {/* Producer */}

            {producer && (
              <div className="mt-6 rounded-2xl border bg-white p-5">

                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                  Produced by
                </p>

                <h2 className="mt-1 text-lg font-black">
                  {
                    producer.businessName
                  }
                </h2>

                {producer.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                    {
                      producer.description
                    }
                  </p>
                )}

                <p className="mt-3 text-sm text-gray-500">
                  {producer.district}
                  {producer.province &&
                    `, ${producer.province}`}
                </p>

              </div>
            )}

            {/* Quantity */}

            {!outOfStock && (
              <div className="mt-8">

                <p className="mb-3 text-sm font-bold">
                  Quantity
                </p>

                <div className="flex items-center gap-4">

                  <div className="flex items-center rounded-xl border bg-white">

                    <button
                      type="button"
                      onClick={
                        decreaseQuantity
                      }
                      disabled={
                        quantity <= 1
                      }
                      className="p-3 disabled:opacity-30"
                    >
                      <Minus
                        size={18}
                      />
                    </button>

                    <span className="w-12 text-center font-bold">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      onClick={
                        increaseQuantity
                      }
                      disabled={
                        quantity >=
                        product.stock
                      }
                      className="p-3 disabled:opacity-30"
                    >
                      <Plus
                        size={18}
                      />
                    </button>

                  </div>

                  <span className="text-sm text-gray-500">
                    Max {product.stock}
                  </span>

                </div>

              </div>
            )}

            {/* Add Cart */}

            <div className="mt-8">

              <button
                type="button"
                disabled={
                  outOfStock
                }
                onClick={
                  handleAddToCart
                }
                className={`flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 font-bold text-white transition ${
                  outOfStock
                    ? "cursor-not-allowed bg-gray-300"
                    : added
                    ? "bg-green-600"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {added ? (
                  <>
                    <Check
                      size={20}
                    />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart
                      size={20}
                    />
                    {outOfStock
                      ? "Out of Stock"
                      : "Add to Cart"}
                  </>
                )}
              </button>

            </div>

            {/* View Cart */}

            {added && (
              <Link
                to="/cart"
                className="mt-3 flex w-full items-center justify-center rounded-2xl border bg-white px-6 py-4 font-bold hover:bg-gray-50"
              >
                View Cart
              </Link>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;