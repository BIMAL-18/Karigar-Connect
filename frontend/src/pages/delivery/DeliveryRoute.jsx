
import {
  ArrowLeft,
  Clock,
  MapPin,
  Navigation,
  Package,
  RefreshCw,
  Route as RouteIcon,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import api from "../../services/api";

const DeliveryRoute = () => {
  const [searchParams] = useSearchParams();

  const orderQuery = searchParams.get("order");

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // LOAD ASSIGNMENTS
  // =========================

  const loadAssignments = async () => {
    try {
      setError("");

      const response = await api.get(
        "/delivery-assignments/my-deliveries"
      );

      const data =
        response.data?.assignments ||
        response.data?.data ||
        response.data ||
        [];

      const list = Array.isArray(data)
        ? data
        : [];

      setAssignments(list);

      // Select order from query parameter
      if (orderQuery) {
        const matched = list.find((assignment) => {
          const order =
            assignment.order ||
            assignment.orderId ||
            {};

          const currentOrderId =
            order._id ||
            order.id ||
            assignment.orderId;

          return (
            String(currentOrderId) ===
            String(orderQuery)
          );
        });

        if (matched) {
          setSelectedAssignment(matched);
        }
      } else if (list.length > 0) {
        setSelectedAssignment(list[0]);
      }
    } catch (err) {
      console.error(
        "Failed to load delivery routes:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load delivery route information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [orderQuery]);

  // =========================
  // REFRESH
  // =========================

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAssignments();
  };

  // =========================
  // SELECT ASSIGNMENT
  // =========================

  const handleSelectAssignment = (
    assignment
  ) => {
    setSelectedAssignment(assignment);
  };

  // =========================
  // HELPERS
  // =========================

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

  const getStatusClass = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "OUT_FOR_DELIVERY":
        return "bg-blue-100 text-blue-700";

      case "PICKED_UP":
        return "bg-purple-100 text-purple-700";

      case "ASSIGNED":
        return "bg-yellow-100 text-yellow-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // SELECTED DATA
  // =========================

  const selectedOrder =
    selectedAssignment?.order ||
    selectedAssignment?.orderId ||
    {};

  const deliveryAddress =
    selectedOrder.deliveryAddress ||
    selectedAssignment?.deliveryAddress ||
    {};

  const customer =
    selectedOrder.customer ||
    selectedAssignment?.customer ||
    {};

  const orderId =
    selectedOrder._id ||
    selectedOrder.id ||
    selectedAssignment?.orderId;

  const customerName =
    customer.name ||
    customer.fullName ||
    selectedOrder.customerName ||
    "Customer";

  const customerPhone =
    deliveryAddress.phone ||
    customer.phone ||
    "";

  const status =
    selectedAssignment?.status ||
    selectedOrder.status ||
    "ASSIGNED";

  const currentLocation =
    selectedAssignment?.currentLocation ||
    selectedAssignment?.location ||
    selectedAssignment?.tracking?.currentLocation ||
    null;

  const destination =
    deliveryAddress.location ||
    deliveryAddress.coordinates ||
    deliveryAddress.destination ||
    null;

  // =========================
  // GOOGLE MAPS URL
  // =========================

  const navigationUrl = useMemo(() => {
    if (!deliveryAddress) {
      return null;
    }

    const addressParts = [
      deliveryAddress.address,
      deliveryAddress.municipality,
      deliveryAddress.district,
      deliveryAddress.province,
    ].filter(Boolean);

    if (addressParts.length === 0) {
      return null;
    }

    const destinationAddress =
      encodeURIComponent(
        addressParts.join(", ")
      );

    return `https://www.google.com/maps/dir/?api=1&destination=${destinationAddress}`;
  }, [deliveryAddress]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-64 rounded bg-gray-200" />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="h-[500px] rounded-2xl bg-gray-200" />

              <div className="h-[500px] rounded-2xl bg-gray-200 lg:col-span-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* =========================
            HEADER
        ========================== */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <Link
              to="/delivery"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Delivery Panel
            </p>

            <h1 className="mt-1 text-3xl font-black sm:text-4xl">
              Delivery Routes
            </h1>

            <p className="mt-2 text-gray-500">
              View your assigned deliveries and
              navigate to customer locations.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* =========================
            ERROR
        ========================== */}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <XCircle
                size={22}
                className="mt-0.5 text-red-600"
              />

              <div>
                <p className="font-bold text-red-700">
                  Unable to load routes
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================
            NO ASSIGNMENTS
        ========================== */}

        {!error &&
          assignments.length === 0 && (
            <div className="mt-8 rounded-2xl border bg-white p-12 text-center">
              <RouteIcon
                size={55}
                className="mx-auto text-gray-300"
              />

              <h2 className="mt-5 text-2xl font-black">
                No Routes Available
              </h2>

              <p className="mt-2 text-gray-500">
                You currently don't have any
                assigned deliveries.
              </p>

              <Link
                to="/delivery"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white"
              >
                <ArrowLeft size={17} />
                Back to Dashboard
              </Link>
            </div>
          )}

        {/* =========================
            ROUTE CONTENT
        ========================== */}

        {assignments.length > 0 && (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            {/* =========================
                ASSIGNMENT LIST
            ========================== */}

            <div className="rounded-2xl border bg-white p-5">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">
                    My Routes
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {assignments.length}{" "}
                    assigned delivery
                    {assignments.length !== 1
                      ? "ies"
                      : ""}
                  </p>
                </div>

                <RouteIcon size={22} />
              </div>

              <div className="mt-5 space-y-3">

                {assignments.map(
                  (assignment, index) => {
                    const order =
                      assignment.order ||
                      assignment.orderId ||
                      {};

                    const id =
                      assignment._id ||
                      assignment.id ||
                      index;

                    const assignmentOrderId =
                      order._id ||
                      order.id ||
                      assignment.orderId;

                    const assignmentStatus =
                      assignment.status ||
                      order.status ||
                      "ASSIGNED";

                    const isSelected =
                      selectedAssignment ===
                      assignment;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          handleSelectAssignment(
                            assignment
                          )
                        }
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          isSelected
                            ? "border-black bg-gray-50 shadow-sm"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                            <Package size={19} />
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-start justify-between gap-2">

                              <p className="truncate font-black">
                                #
                                {String(
                                  assignmentOrderId ||
                                    "N/A"
                                ).slice(-10)}
                              </p>

                              <span
                                className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${getStatusClass(
                                  assignmentStatus
                                )}`}
                              >
                                {formatStatus(
                                  assignmentStatus
                                )}
                              </span>

                            </div>

                            <p className="mt-2 truncate text-sm text-gray-500">
                              {order.deliveryAddress
                                ?.address ||
                                assignment
                                  .deliveryAddress
                                  ?.address ||
                                "Address unavailable"}
                            </p>

                          </div>

                        </div>
                      </button>
                    );
                  }
                )}

              </div>
            </div>

            {/* =========================
                ROUTE DETAILS
            ========================== */}

            <div className="lg:col-span-2">

              {selectedAssignment ? (
                <div className="space-y-6">

                  {/* MAP */}

                  <div className="overflow-hidden rounded-2xl border bg-white">

                    <div className="flex flex-col justify-between gap-4 border-b p-5 sm:flex-row sm:items-center">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                          <Navigation size={21} />
                        </div>

                        <div>
                          <h2 className="font-black">
                            Delivery Route
                          </h2>

                          <p className="text-sm text-gray-500">
                            Order #
                            {String(
                              orderId ||
                                "N/A"
                            ).slice(-10)}
                          </p>
                        </div>

                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-2 text-xs font-bold ${getStatusClass(
                          status
                        )}`}
                      >
                        {formatStatus(status)}
                      </span>

                    </div>

                    {/* MAP VISUAL */}

                    <div className="relative h-[430px] overflow-hidden bg-gray-100">

                      {/* Roads */}

                      <div className="absolute inset-0 opacity-50">

                        <div className="absolute left-[5%] top-[25%] h-2 w-[90%] rotate-[8deg] bg-white" />

                        <div className="absolute left-[10%] top-[60%] h-2 w-[85%] -rotate-[12deg] bg-white" />

                        <div className="absolute left-[25%] top-[-10%] h-[120%] w-2 rotate-[25deg] bg-white" />

                        <div className="absolute left-[70%] top-[-10%] h-[120%] w-2 -rotate-[18deg] bg-white" />

                        <div className="absolute left-[45%] top-[-10%] h-[120%] w-1 rotate-[5deg] bg-white" />

                      </div>

                      {/* Route line */}

                      <div className="absolute left-[25%] right-[25%] top-1/2 border-t-4 border-dashed border-black" />

                      {/* Delivery person */}

                      <div className="absolute left-[18%] top-[42%]">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl">
                          <Truck size={25} />
                        </div>

                        <div className="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-bold shadow">
                          Your Location
                        </div>

                      </div>

                      {/* Destination */}

                      <div className="absolute right-[18%] top-[42%]">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl">

                          <MapPin
                            size={28}
                            className="text-red-500"
                          />

                        </div>

                        <div className="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-bold shadow">
                          Customer
                        </div>

                      </div>

                      {/* Location status */}

                      {!currentLocation && (
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold shadow">
                          Live location is not
                          available.
                        </div>
                      )}

                    </div>

                  </div>

                  {/* CUSTOMER / DESTINATION */}

                  <div className="grid gap-6 md:grid-cols-2">

                    <div className="rounded-2xl border bg-white p-6">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                          <User size={21} />
                        </div>

                        <div>
                          <h3 className="font-black">
                            Customer
                          </h3>

                          <p className="text-sm text-gray-500">
                            Delivery recipient
                          </p>
                        </div>

                      </div>

                      <div className="mt-6">

                        <p className="font-bold">
                          {customerName}
                        </p>

                        {customerPhone && (
                          <a
                            href={`tel:${customerPhone}`}
                            className="mt-2 inline-flex text-sm font-semibold text-blue-600 hover:underline"
                          >
                            {customerPhone}
                          </a>
                        )}

                      </div>

                    </div>

                    <div className="rounded-2xl border bg-white p-6">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                          <MapPin size={21} />
                        </div>

                        <div>
                          <h3 className="font-black">
                            Destination
                          </h3>

                          <p className="text-sm text-gray-500">
                            Customer address
                          </p>
                        </div>

                      </div>

                      <div className="mt-6">

                        <p className="font-semibold">
                          {deliveryAddress.address ||
                            "Address unavailable"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {deliveryAddress.municipality &&
                            `${deliveryAddress.municipality}, `}

                          {deliveryAddress.district &&
                            `${deliveryAddress.district}, `}

                          {deliveryAddress.province ||
                            ""}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ROUTE INFORMATION */}

                  <div className="rounded-2xl border bg-white p-6">

                    <div className="flex items-center gap-3">

                      <RouteIcon size={21} />

                      <h2 className="text-xl font-black">
                        Route Information
                      </h2>

                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-3">

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                          Order
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold">
                          #{orderId || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                          Status
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {formatStatus(status)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                          Created
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {selectedAssignment.createdAt
                            ? new Date(
                                selectedAssignment.createdAt
                              ).toLocaleDateString(
                                "en-NP"
                              )
                            : "N/A"}
                        </p>
                      </div>

                    </div>

                    {/* NAVIGATION BUTTON */}

                    {navigationUrl && (
                      <a
                        href={navigationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-gray-800"
                      >
                        <Navigation size={18} />
                        Open Navigation
                      </a>
                    )}

                  </div>

                  {/* BACK */}

                  <div className="flex flex-wrap gap-3">

                    <Link
                      to="/delivery"
                      className="inline-flex items-center gap-2 rounded-xl border bg-white px-5 py-3 font-semibold hover:bg-gray-50"
                    >
                      <ArrowLeft size={18} />
                      Dashboard
                    </Link>

                    {orderId && (
                      <Link
                        to={`/delivery/qr?order=${orderId}`}
                        className="inline-flex items-center gap-2 rounded-xl border bg-white px-5 py-3 font-semibold hover:bg-gray-50"
                      >
                        Verify QR
                      </Link>
                    )}

                  </div>

                </div>
              ) : (
                <div className="flex min-h-[400px] items-center justify-center rounded-2xl border bg-white">
                  <div className="text-center">
                    <RouteIcon
                      size={50}
                      className="mx-auto text-gray-300"
                    />

                    <h3 className="mt-4 text-xl font-black">
                      Select a delivery
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      Select a delivery from the
                      list to view its route.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryRoute;