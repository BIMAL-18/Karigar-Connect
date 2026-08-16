import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  Phone,
  RefreshCw,
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
  useState,
} from "react";

import api from "../../services/api";

const DeliveryAssignment = () => {
  const [searchParams] =
    useSearchParams();

  const selectedOrder =
    searchParams.get("order");

  const [assignments, setAssignments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [updatingId, setUpdatingId] =
    useState(null);

  const [error, setError] =
    useState("");

  // =========================
  // LOAD ASSIGNMENTS
  // =========================

  const loadAssignments = async () => {
    try {
      setError("");

      const response =
        await api.get(
          "/delivery-assignments/my"
        );

      const data =
        response.data?.assignments ||
        response.data?.data ||
        response.data ||
        [];

      let result = Array.isArray(data)
        ? data
        : [];

      // If coming from a specific order
      if (selectedOrder) {
        result = result.filter(
          (assignment) => {
            const order =
              assignment.order ||
              assignment.orderId;

            const orderId =
              order?._id ||
              order?.id ||
              order;

            return (
              String(orderId) ===
              String(selectedOrder)
            );
          }
        );
      }

      setAssignments(result);
    } catch (err) {
      console.error(
        "Failed to load assignments:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load delivery assignments."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [selectedOrder]);

  // =========================
  // REFRESH
  // =========================

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadAssignments();
  };

  // =========================
  // STATUS
  // =========================

  const updateStatus = async (
    assignment,
    status
  ) => {
    const assignmentId =
      assignment._id ||
      assignment.id;

    if (!assignmentId) {
      return;
    }

    try {
      setUpdatingId(assignmentId);

      await api.patch(
        `/delivery-assignments/${assignmentId}/status`,
        {
          status,
        }
      );

      await loadAssignments();
    } catch (err) {
      console.error(
        "Status update failed:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to update delivery status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // FORMAT STATUS
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
        (letter) =>
          letter.toUpperCase()
      );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ASSIGNED":
        return "bg-yellow-100 text-yellow-700";

      case "PICKED_UP":
        return "bg-purple-100 text-purple-700";

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

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="mx-auto max-w-6xl px-4 py-10">

          <div className="animate-pulse space-y-6">

            <div className="h-8 w-64 rounded bg-gray-200" />

            <div className="h-48 rounded-2xl bg-gray-200" />

            <div className="h-48 rounded-2xl bg-gray-200" />

          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* =========================
            HEADER
        ========================== */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>

            <Link
              to="/delivery"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Delivery
            </p>

            <h1 className="mt-1 text-3xl font-black">
              Delivery Assignments
            </h1>

            <p className="mt-2 text-gray-500">
              View and manage your assigned
              deliveries.
            </p>

          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
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

            <div className="flex gap-3">

              <XCircle
                size={22}
                className="text-red-600"
              />

              <div>

                <p className="font-bold text-red-700">
                  Error
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>

              </div>

            </div>

          </div>
        )}

        {/* =========================
            EMPTY
        ========================== */}

        {assignments.length === 0 ? (
          <div className="mt-8 rounded-2xl border bg-white p-12 text-center">

            <Truck
              size={55}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-5 text-2xl font-black">
              No Delivery Assignments
            </h2>

            <p className="mt-2 text-gray-500">
              There are currently no delivery
              orders assigned to you.
            </p>

            {selectedOrder && (
              <Link
                to="/delivery/assignments"
                className="mt-6 inline-flex rounded-xl bg-black px-5 py-3 font-semibold text-white"
              >
                View All Assignments
              </Link>
            )}

          </div>
        ) : (
          <div className="mt-8 space-y-6">

            {assignments.map(
              (assignment, index) => {

                const assignmentId =
                  assignment._id ||
                  assignment.id ||
                  index;

                const order =
                  assignment.order ||
                  assignment.orderId ||
                  {};

                const orderId =
                  order._id ||
                  order.id ||
                  order;

                const status =
                  assignment.status ||
                  order.status ||
                  "ASSIGNED";

                const customer =
                  assignment.customer ||
                  order.customer ||
                  {};

                const address =
                  assignment.deliveryAddress ||
                  order.deliveryAddress ||
                  {};

                const phone =
                  customer.phone ||
                  address.phone;

                const customerName =
                  customer.name ||
                  customer.fullName ||
                  order.customerName ||
                  "Customer";

                return (
                  <div
                    key={assignmentId}
                    className="overflow-hidden rounded-2xl border bg-white"
                  >

                    {/* CARD HEADER */}

                    <div className="flex flex-col justify-between gap-4 border-b p-6 sm:flex-row sm:items-start">

                      <div className="flex gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                          <Package
                            size={25}
                          />
                        </div>

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Order
                          </p>

                          <h2 className="mt-1 break-all text-lg font-black">
                            #{orderId}
                          </h2>

                          <span
                            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                              status
                            )}`}
                          >
                            {formatStatus(
                              status
                            )}
                          </span>

                        </div>

                      </div>

                      {assignment.createdAt && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock size={16} />

                          {new Date(
                            assignment.createdAt
                          ).toLocaleString(
                            "en-NP"
                          )}
                        </div>
                      )}

                    </div>

                    {/* DETAILS */}

                    <div className="grid gap-6 p-6 md:grid-cols-2">

                      {/* CUSTOMER */}

                      <div className="rounded-xl bg-gray-50 p-5">

                        <div className="flex items-center gap-3">

                          <User
                            size={20}
                            className="text-gray-500"
                          />

                          <h3 className="font-black">
                            Customer
                          </h3>

                        </div>

                        <div className="mt-4">

                          <p className="font-semibold">
                            {customerName}
                          </p>

                          {phone && (
                            <a
                              href={`tel:${phone}`}
                              className="mt-2 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
                            >
                              <Phone
                                size={15}
                              />

                              {phone}
                            </a>
                          )}

                        </div>

                      </div>

                      {/* ADDRESS */}

                      <div className="rounded-xl bg-gray-50 p-5">

                        <div className="flex items-center gap-3">

                          <MapPin
                            size={20}
                            className="text-gray-500"
                          />

                          <h3 className="font-black">
                            Delivery Address
                          </h3>

                        </div>

                        <div className="mt-4">

                          <p className="font-semibold">
                            {address.address ||
                              "Address unavailable"}
                          </p>

                          <p className="mt-2 text-sm text-gray-500">

                            {address.municipality &&
                              `${address.municipality}, `}

                            {address.district &&
                              `${address.district}, `}

                            {address.province ||
                              ""}

                          </p>

                          {address.ward && (
                            <p className="mt-1 text-sm text-gray-500">
                              Ward{" "}
                              {
                                address.ward
                              }
                            </p>
                          )}

                        </div>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-3 border-t p-6">

                      {status ===
                        "ASSIGNED" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              assignment,
                              "PICKED_UP"
                            )
                          }
                          disabled={
                            updatingId ===
                            assignmentId
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                          <Package
                            size={17}
                          />

                          {updatingId ===
                          assignmentId
                            ? "Updating..."
                            : "Mark Picked Up"}
                        </button>
                      )}

                      {status ===
                        "PICKED_UP" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              assignment,
                              "OUT_FOR_DELIVERY"
                            )
                          }
                          disabled={
                            updatingId ===
                            assignmentId
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                          <Truck
                            size={17}
                          />

                          {updatingId ===
                          assignmentId
                            ? "Updating..."
                            : "Start Delivery"}
                        </button>
                      )}

                      {status ===
                        "OUT_FOR_DELIVERY" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              assignment,
                              "DELIVERED"
                            )
                          }
                          disabled={
                            updatingId ===
                            assignmentId
                          }
                          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          <CheckCircle
                            size={17}
                          />

                          {updatingId ===
                          assignmentId
                            ? "Updating..."
                            : "Mark Delivered"}
                        </button>
                      )}

                      {/* ROUTE */}

                      <Link
                        to={`/delivery/routes?order=${orderId}`}
                        className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-gray-50"
                      >
                        <MapPin
                          size={17}
                        />
                        View Route
                      </Link>

                      {/* QR */}

                      <Link
                        to={`/delivery/qr?order=${orderId}`}
                        className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-gray-50"
                      >
                        <CheckCircle
                          size={17}
                        />
                        Verify Order
                      </Link>

                      {/* CALL */}

                      {phone && (
                        <a
                          href={`tel:${phone}`}
                          className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold hover:bg-gray-50"
                        >
                          <Phone size={17} />
                          Call Customer
                        </a>
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default DeliveryAssignment;