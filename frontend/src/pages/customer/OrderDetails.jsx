import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Package,
  Phone,
  Truck,
  XCircle,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import orderService from "../../services/orderService";

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // load order

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await orderService.getOrderById(id);

      setOrder(
        response.order ||
          response.data ||
          response
      );
    } catch (error) {
      console.error(
        "Failed to load order:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load order."
      );
    } finally {
      setLoading(false);
    }
  };

  // cancel order

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    setCancelling(true);

    try {
      await orderService.cancelOrder(id);

      await loadOrder();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };

  // format status

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) => letter.toUpperCase()
      );
  };

  // format date

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleString(
      "en-NP",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // order status steps

  const statusSteps = [
    {
      key: "PENDING",
      label: "Order Placed",
      description:
        "Your order has been placed.",
    },
    {
      key: "CONFIRMED",
      label: "Confirmed",
      description:
        "Your order has been confirmed.",
    },
    {
      key: "PROCESSING",
      label: "Processing",
      description:
        "The producer is preparing your order.",
    },
    {
      key: "READY_FOR_PICKUP",
      label: "Ready for Pickup",
      description:
        "Your order is ready for the delivery person.",
    },
    {
      key: "ASSIGNED",
      label: "Delivery Assigned",
      description:
        "A delivery person has been assigned.",
    },
    {
      key: "PICKED_UP",
      label: "Picked Up",
      description:
        "Your order has been picked up.",
    },
    {
      key: "OUT_FOR_DELIVERY",
      label: "Out for Delivery",
      description:
        "Your order is on its way.",
    },
    {
      key: "DELIVERED",
      label: "Delivered",
      description:
        "Your order has been delivered.",
    },
  ];

  // current status step

  const getCurrentStep = () => {
    if (!order?.status) {
      return 0;
    }

    const index =
      statusSteps.findIndex(
        (step) =>
          step.key === order.status
      );

    return index === -1 ? 0 : index;
  };

  // price calculations

  const subtotal = Number(
    order?.subtotal ||
      order?.totalAmount ||
      order?.total ||
      0
  );

  const deliveryFee = Number(
    order?.deliveryFee || 0
  );

  const total = Number(
    order?.totalAmount ||
      order?.total ||
      subtotal + deliveryFee
  );

  // tracking available

  const canTrackDelivery = [
    "ASSIGNED",
    "PICKED_UP",
    "OUT_FOR_DELIVERY",
  ].includes(order?.status);

  // loading

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-gray-200" />

            <div className="h-48 rounded-2xl bg-gray-200" />

            <div className="h-80 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  // error

  if (error || !order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <Package
            size={50}
            className="mx-auto text-gray-400"
          />

          <h1 className="mt-5 text-2xl font-black">
            Order Not Found
          </h1>

          <p className="mt-2 text-gray-500">
            {error ||
              "We couldn't find this order."}
          </p>

          <Link
            to="/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
          >
            <ArrowLeft size={17} />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStep();

  const isCancelled =
    order.status === "CANCELLED";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* back */}

        <Link
          to="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        {/* header */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Order Details
            </p>

            <h1 className="mt-1 text-3xl font-black sm:text-4xl">
              Order #{order._id}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Placed on{" "}
              {formatDate(order.createdAt)}
            </p>
          </div>

          <div
            className={`w-fit rounded-full px-4 py-2 text-sm font-bold ${
              isCancelled
                ? "bg-red-100 text-red-700"
                : order.status === "DELIVERED"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {formatStatus(order.status)}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* main */}

          <div className="space-y-8">

            {/* status timeline */}

            <div className="rounded-2xl border bg-white p-6">
              <div className="flex items-center gap-3">
                <Truck size={21} />

                <h2 className="text-xl font-black">
                  Order Status
                </h2>
              </div>

              {isCancelled ? (
                <div className="mt-6 flex items-center gap-4 rounded-xl bg-red-50 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100">
                    <XCircle
                      size={24}
                      className="text-red-600"
                    />
                  </div>

                  <div>
                    <p className="font-bold text-red-700">
                      Order Cancelled
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                      This order is no longer
                      being processed.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-8">
                  {statusSteps.map(
                    (step, index) => {
                      const completed =
                        index <= currentStep;

                      const active =
                        index === currentStep;

                      return (
                        <div
                          key={step.key}
                          className="relative flex gap-4"
                        >
                          {index <
                            statusSteps.length - 1 && (
                            <div
                              className={`absolute left-5 top-10 h-full w-0.5 ${
                                index <
                                currentStep
                                  ? "bg-black"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}

                          <div
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                              completed
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {completed ? (
                              <Check size={18} />
                            ) : (
                              <Clock size={18} />
                            )}
                          </div>

                          <div className="pb-8">
                            <p
                              className={`font-bold ${
                                active
                                  ? "text-black"
                                  : completed
                                  ? "text-gray-700"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.label}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* delivery tracking */}

            <div className="rounded-2xl border bg-white p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <h2 className="text-xl font-black">
                      Delivery Tracking
                    </h2>

                    <p className="text-sm text-gray-500">
                      Track your delivery
                      location.
                    </p>
                  </div>
                </div>

                {canTrackDelivery && (
                  <Link
                    to={`/orders/${order._id}/tracking`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
                  >
                    <MapPin size={18} />
                    Track Delivery
                  </Link>
                )}
              </div>

              <div className="mt-6 flex h-64 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                <div className="text-center">
                  <MapPin
                    size={38}
                    className="mx-auto text-gray-400"
                  />

                  <p className="mt-3 font-bold text-gray-600">
                    Delivery Map
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Live map will appear
                    when delivery starts.
                  </p>

                  {canTrackDelivery && (
                    <Link
                      to={`/orders/${order._id}/tracking`}
                      className="mt-4 inline-block text-sm font-semibold text-black underline"
                    >
                      Open Live Tracking
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* products */}

            <div className="rounded-2xl border bg-white p-6">
              <div className="flex items-center gap-3">
                <Package size={21} />

                <h2 className="text-xl font-black">
                  Ordered Products
                </h2>
              </div>

              <div className="mt-6 divide-y">
                {order.items?.map(
                  (item, index) => {
                    const product =
                      item.product || item;

                    const image =
                      product.image ||
                      product.images?.[0];

                    const price = Number(
                      item.price ||
                        product.price ||
                        0
                    );

                    const quantity =
                      item.quantity || 1;

                    return (
                      <div
                        key={
                          item._id || index
                        }
                        className="flex gap-4 py-5 first:pt-0 last:pb-0"
                      >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                          {image ? (
                            <img
                              src={image}
                              alt={
                                product.name ||
                                "Product"
                              }
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package
                                size={25}
                                className="text-gray-400"
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold">
                            {product.name ||
                              "Product"}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Quantity:{" "}
                            {quantity}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Rs.{" "}
                            {price.toLocaleString()}{" "}
                            each
                          </p>
                        </div>

                        <p className="font-black">
                          Rs.{" "}
                          {(
                            price *
                            quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* sidebar */}

          <div className="space-y-6">

            {/* delivery address */}

            <div className="rounded-2xl border bg-white p-6">
              <div className="flex items-center gap-3">
                <MapPin size={20} />

                <h2 className="text-lg font-black">
                  Delivery Address
                </h2>
              </div>

              <div className="mt-5 space-y-2 text-sm text-gray-600">
                <p className="font-semibold text-black">
                  {order.deliveryAddress
                    ?.address ||
                    "Address not available"}
                </p>

                <p>
                  {order.deliveryAddress
                    ?.municipality &&
                    `${order.deliveryAddress.municipality}, `}

                  {order.deliveryAddress
                    ?.district &&
                    `${order.deliveryAddress.district}, `}

                  {order.deliveryAddress
                    ?.province || ""}
                </p>

                {order.deliveryAddress
                  ?.ward && (
                  <p>
                    Ward{" "}
                    {
                      order
                        .deliveryAddress
                        .ward
                    }
                  </p>
                )}

                {order.deliveryAddress
                  ?.phone && (
                  <div className="mt-4 flex items-center gap-2 border-t pt-4">
                    <Phone size={16} />

                    <span>
                      {
                        order
                          .deliveryAddress
                          .phone
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* payment summary */}

            <div className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-black">
                Payment Summary
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>

                  <span>
                    Rs.{" "}
                    {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    Delivery Fee
                  </span>

                  <span>
                    Rs.{" "}
                    {deliveryFee.toLocaleString()}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-black">
                    <span>Total</span>

                    <span>
                      Rs.{" "}
                      {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* track delivery */}

            {canTrackDelivery && (
              <Link
                to={`/orders/${order._id}/tracking`}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                <Truck size={18} />
                Track Delivery
              </Link>
            )}

            {/* cancel order */}

            {!isCancelled &&
              ![
                "DELIVERED",
                "OUT_FOR_DELIVERY",
                "PICKED_UP",
              ].includes(order.status) && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full rounded-xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {cancelling
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;