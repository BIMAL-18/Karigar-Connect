import {
  ArrowRight,
  Calendar,
  Package,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import orderService from "../../services/orderService";

const Orders = () => {
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders =
    async () => {
      setLoading(true);
      setError("");

      try {
        const response =
          await orderService.getMyOrders();

        setOrders(
          response.orders ||
            response.data ||
            response ||
            []
        );
      } catch (error) {
        console.error(
          "Failed to load orders:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";

      case "PROCESSING":
        return "bg-purple-100 text-purple-700";

      case "READY_FOR_PICKUP":
        return "bg-indigo-100 text-indigo-700";

      case "ASSIGNED":
        return "bg-orange-100 text-orange-700";

      case "PICKED_UP":
        return "bg-cyan-100 text-cyan-700";

      case "OUT_FOR_DELIVERY":
        return "bg-blue-100 text-blue-700";

      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (
    status
  ) => {
    if (!status) {
      return "UNKNOWN";
    }

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase()
      );
  };

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "N/A";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "en-NP",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <div className="animate-pulse space-y-5">
            <div className="h-10 w-52 rounded bg-gray-200" />

            <div className="h-5 w-72 rounded bg-gray-200" />

            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-40 rounded-2xl bg-gray-200"
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-black">
            Something went wrong
          </h1>

          <p className="mt-2 text-gray-500">
            {error}
          </p>

          <button
            onClick={loadOrders}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white"
          >
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <ShoppingBag
              size={36}
              className="text-gray-500"
            />
          </div>

          <h1 className="mt-6 text-3xl font-black">
            No Orders Yet
          </h1>

          <p className="mt-2 text-gray-500">
            Your orders will appear
            here after you make a
            purchase.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 font-semibold text-white"
          >
            <ShoppingBag size={18} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}

        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Customer
            </p>

            <h1 className="mt-1 text-4xl font-black">
              My Orders
            </h1>

            <p className="mt-2 text-gray-500">
              Track and manage your
              orders.
            </p>
          </div>

          <button
            onClick={loadOrders}
            className="hidden items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-semibold hover:bg-gray-100 sm:flex"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Orders */}

        <div className="mt-8 space-y-5">
          {orders.map(
            (order) => (
              <div
                key={order._id}
                className="rounded-2xl border bg-white p-5"
              >
                {/* Top */}

                <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Order ID
                    </p>

                    <p className="mt-1 font-mono text-sm font-semibold">
                      #{order._id}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {formatStatus(
                        order.status
                      )}
                    </span>

                    <Link
                      to={`/orders/${order._id}`}
                      className="flex items-center gap-1 text-sm font-semibold hover:underline"
                    >
                      View
                      <ArrowRight
                        size={15}
                      />
                    </Link>
                  </div>
                </div>

                {/* Details */}

                <div className="grid gap-5 py-5 sm:grid-cols-3">

                  {/* Date */}

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                      <Calendar
                        size={18}
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Order Date
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {formatDate(
                          order.createdAt
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Items */}

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                      <Package
                        size={18}
                      />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Items
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {order.items
                          ?.length ||
                          0}{" "}
                        {order.items
                          ?.length ===
                        1
                          ? "item"
                          : "items"}
                      </p>
                    </div>
                  </div>

                  {/* Total */}

                  <div>
                    <p className="text-xs text-gray-400">
                      Total
                    </p>

                    <p className="mt-1 text-xl font-black">
                      Rs.{" "}
                      {Number(
                        order.totalAmount ||
                          order.total ||
                          0
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Products */}

                {order.items
                  ?.length > 0 && (
                  <div className="border-t pt-5">
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {order.items
                        .slice(0, 4)
                        .map(
                          (
                            item,
                            index
                          ) => {
                            const product =
                              item.product ||
                              item;

                            return (
                              <div
                                key={
                                  item._id ||
                                  index
                                }
                                className="flex min-w-[220px] gap-3 rounded-xl bg-gray-50 p-3"
                              >
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                                  {product.image ||
                                  product.images?.[0] ? (
                                    <img
                                      src={
                                        product.image ||
                                        product.images?.[0]
                                      }
                                      alt={
                                        product.name ||
                                        "Product"
                                      }
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full items-center justify-center">
                                      <Package
                                        size={20}
                                        className="text-gray-400"
                                      />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="line-clamp-2 text-sm font-semibold">
                                    {product.name ||
                                      "Product"}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-500">
                                    Qty:{" "}
                                    {item.quantity ||
                                      1}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                        )}

                      {order.items
                        .length > 4 && (
                        <div className="flex min-w-[100px] items-center justify-center rounded-xl bg-gray-100 px-4 text-sm font-semibold text-gray-500">
                          +
                          {order
                            .items
                            .length -
                            4}{" "}
                          more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;