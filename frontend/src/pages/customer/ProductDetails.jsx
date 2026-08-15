import {
  ArrowLeft,
  CheckCircle,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  Store,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import productService from "../../services/productService";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  const [
    selectedImage,
    setSelectedImage,
  ] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    setError("");

    try {
      const data =
        await productService.getProductById(
          id
        );

      setProduct(
        data.product ||
          data.data ||
          data
      );
    } catch (error) {
      console.error(
        "Failed to load product:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Product not found."
      );
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    if (
      quantity <
      (product?.stock || 1)
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
    if (!product) return;

    const existingCart =
      JSON.parse(
        localStorage.getItem(
          "cart"
        ) || "[]"
      );

    const existingProduct =
      existingCart.find(
        (item) =>
          item.productId ===
          product._id
      );

    if (existingProduct) {
      existingProduct.quantity +=
        quantity;
    } else {
      existingCart.push({
        productId:
          product._id,
        name: product.name,
        price: product.price,
        image:
          product.images?.[0] || "",
        quantity,
        stock: product.stock,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(
        existingCart
      )
    );

    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid animate-pulse gap-10 lg:grid-cols-2">
          <div className="h-[500px] rounded-3xl bg-gray-200" />

          <div className="space-y-5">
            <div className="h-8 w-3/4 rounded bg-gray-200" />
            <div className="h-6 w-1/4 rounded bg-gray-200" />
            <div className="h-24 rounded bg-gray-200" />
            <div className="h-12 rounded bg-gray-200" />
            <div className="h-12 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-black">
          Product Not Found
        </h1>

        <p className="mt-2 text-gray-500">
          {error ||
            "This product is no longer available."}
        </p>

        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>
      </div>
    );
  }

  const images =
    product.images?.length
      ? product.images
      : [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        ];

  const producer =
    product.producer;

  const category =
    product.category;

  return (
    <div className="bg-gray-50">
      {/* Main Product */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Images */}

          <div>
            <div className="overflow-hidden rounded-3xl bg-white">
              <img
                src={
                  images[
                    selectedImage
                  ]
                }
                alt={product.name}
                className="h-[500px] w-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {images.map(
                  (
                    image,
                    index
                  ) => (
                    <button
                      key={index}
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      className={`overflow-hidden rounded-xl border-2 ${
                        selectedImage ===
                        index
                          ? "border-black"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-20 w-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Product Information */}

          <div>
            {category && (
              <span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-medium">
                {category.name}
              </span>
            )}

            <h1 className="mt-4 text-4xl font-black leading-tight">
              {product.name}
            </h1>

            <div className="mt-5 flex items-center gap-4">
              <span className="text-3xl font-black">
                Rs.{" "}
                {Number(
                  product.price
                ).toLocaleString()}
              </span>

              {product.stock >
                0 && (
                <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <CheckCircle
                    size={16}
                  />
                  In stock
                </span>
              )}
            </div>

            <div className="mt-6 border-y py-6">
              <p className="leading-7 text-gray-600">
                {product.description}
              </p>
            </div>

            {/* Location */}

            <div className="mt-6 flex items-start gap-3">
              <MapPin
                size={20}
                className="mt-1 shrink-0"
              />

              <div>
                <h3 className="font-bold">
                  Product Origin
                </h3>

                <p className="text-sm text-gray-500">
                  {[
                    product.originAddress,
                    product.municipality,
                    product.district,
                    product.province,
                  ]
                    .filter(
                      Boolean
                    )
                    .join(", ") ||
                    "Nepal"}
                </p>
              </div>
            </div>

            {/* Producer */}

            {producer && (
              <div className="mt-6 rounded-2xl border bg-white p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                    <Store
                      size={22}
                    />
                  </div>

                  <div>
                    <h3 className="font-bold">
                      {
                        producer.businessName
                      }
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {[
                        producer.district,
                        producer.province,
                      ]
                        .filter(
                          Boolean
                        )
                        .join(
                          ", "
                        )}
                    </p>

                    {producer.verificationStatus ===
                      "APPROVED" && (
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                        <CheckCircle
                          size={14}
                        />
                        Verified Producer
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quantity */}

            {product.stock >
              0 && (
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">
                    Quantity
                  </span>

                  <span className="text-sm text-gray-500">
                    {product.stock}{" "}
                    available
                  </span>
                </div>

                <div className="flex items-center">
                  <button
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1
                    }
                    className="rounded-l-xl border bg-white p-3 disabled:opacity-40"
                  >
                    <Minus
                      size={18}
                    />
                  </button>

                  <span className="flex h-12 w-16 items-center justify-center border-y bg-white font-semibold">
                    {quantity}
                  </span>

                  <button
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity >=
                      product.stock
                    }
                    className="rounded-r-xl border bg-white p-3 disabled:opacity-40"
                  >
                    <Plus
                      size={18}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Add Cart */}

            <button
              onClick={
                handleAddToCart
              }
              disabled={
                !product.stock ||
                product.stock <= 0
              }
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-black px-6 py-4 font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <ShoppingCart
                size={21}
              />

              {product.stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* Additional Information */}

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Materials */}

          {product.materials
            ?.length > 0 && (
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-xl font-bold">
                Materials
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {product.materials.map(
                  (
                    material,
                    index
                  ) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-4 py-2 text-sm"
                    >
                      {material}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* Production Method */}

          {product.productionMethod && (
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-xl font-bold">
                Production Method
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {
                  product.productionMethod
                }
              </p>
            </div>
          )}

          {/* Tags */}

          {product.tags?.length >
            0 && (
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-xl font-bold">
                Tags
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map(
                  (
                    tag,
                    index
                  ) => (
                    <span
                      key={index}
                      className="rounded-full border px-4 py-2 text-sm"
                    >
                      #{tag}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* Producer Story */}

          {producer?.story && (
            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-xl font-bold">
                Producer Story
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {producer.story}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;