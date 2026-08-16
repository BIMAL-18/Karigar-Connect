import {
  ArrowLeft,
  MapPin,
  ShoppingBag,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import orderService from "../../services/orderService";

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      province: "",
      district: "",
      municipality: "",
      ward: "",
      address: "",
      phone: "",
      longitude: "",
      latitude: "",
    });

  useEffect(() => {
    const storedCart =
      JSON.parse(
        localStorage.getItem(
          "cart"
        ) || "[]"
      );

    if (!storedCart.length) {
      navigate("/cart");
      return;
    }

    setCart(storedCart);
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((previous) => ({
          ...previous,
          latitude:
            position.coords
              .latitude,
          longitude:
            position.coords
              .longitude,
        }));
      },
      () => {
        alert(
          "Unable to get your current location."
        );
      }
    );
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!cart.length) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.map(
          (item) => ({
            product: item.productId,
            quantity:
              item.quantity,
          })
        ),

        deliveryAddress: {
          province:
            form.province,
          district:
            form.district,
          municipality:
            form.municipality,
          ward: form.ward,
          address:
            form.address,
          phone: form.phone,
          location: {
            type: "Point",
            coordinates: [
              Number(
                form.longitude
              ),
              Number(
                form.latitude
              ),
            ],
          },
        },
      };

      const response =
        await orderService.createOrder(
          orderData
        );

      const order =
        response.order ||
        response.data ||
        response;

      localStorage.removeItem(
        "cart"
      );

      window.dispatchEvent(
        new Event("cartUpdated")
      );

      navigate(
        `/orders/${order._id}`
      );
    } catch (error) {
      console.error(
        "Order creation failed:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          "Failed to create order."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <Link
          to="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-black">
          Checkout
        </h1>

        <p className="mt-2 text-gray-500">
          Enter your delivery information
          to place your order.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]"
        >

          {/* Delivery Information */}

          <div className="rounded-2xl border bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                <MapPin size={20} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Delivery Address
                </h2>

                <p className="text-sm text-gray-500">
                  Where should we deliver
                  your order?
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">

              {/* Province */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Province *
                </label>

                <input
                  required
                  name="province"
                  value={
                    form.province
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Bagmati"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* District */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  District *
                </label>

                <input
                  required
                  name="district"
                  value={
                    form.district
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Kathmandu"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Municipality */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Municipality *
                </label>

                <input
                  required
                  name="municipality"
                  value={
                    form.municipality
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Kathmandu Metropolitan"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Ward */}

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Ward *
                </label>

                <input
                  required
                  name="ward"
                  value={form.ward}
                  onChange={
                    handleChange
                  }
                  placeholder="10"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Phone */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Phone Number *
                </label>

                <input
                  required
                  name="phone"
                  value={form.phone}
                  onChange={
                    handleChange
                  }
                  placeholder="98XXXXXXXX"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                />
              </div>

              {/* Address */}

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  Full Address *
                </label>

                <textarea
                  required
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  rows={4}
                  placeholder="House number, street, nearby landmark..."
                  className="w-full resize-none rounded-xl border px-4 py-3 outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Location */}

            <div className="mt-6 rounded-xl bg-gray-50 p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-bold">
                    Delivery Location
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Use your current location
                    for accurate delivery.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    getCurrentLocation
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-gray-100"
                >
                  <MapPin size={17} />
                  Use Current Location
                </button>
              </div>

              {form.latitude &&
                form.longitude && (
                  <div className="mt-4 rounded-lg bg-white p-3 text-sm text-green-600">
                    Location captured:
                    <br />
                    Latitude:{" "}
                    {
                      form.latitude
                    }
                    <br />
                    Longitude:{" "}
                    {
                      form.longitude
                    }
                  </div>
                )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-black px-5 py-4 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating Order..."
                : "Place Order"}
            </button>
          </div>

          {/* Order Summary */}

          <div>
            <div className="sticky top-28 rounded-2xl border bg-white p-6">
              <div className="flex items-center gap-3">
                <ShoppingBag
                  size={20}
                />

                <h2 className="text-xl font-bold">
                  Order Summary
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {cart.map(
                  (item) => (
                    <div
                      key={
                        item.productId
                      }
                      className="flex gap-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <img
                          src={
                            item.image
                          }
                          alt={
                            item.name
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold">
                          {
                            item.name
                          }
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>
                      </div>

                      <p className="text-sm font-bold">
                        Rs.{" "}
                        {(
                          Number(
                            item.price
                          ) *
                          item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 space-y-4 border-t pt-5">
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
                    Delivery
                  </span>

                  <span>
                    Rs.{" "}
                    {deliveryFee.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between border-t pt-4 text-lg font-black">
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
          </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;