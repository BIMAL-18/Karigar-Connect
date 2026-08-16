import {
  CheckCircle,
  Clock,
  MapPin,
  Navigation,
  Package,
  Phone,
  QrCode,
  RefreshCw,
  Truck,
  User,
  XCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

const DeliveryDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // =========================
  // LOAD DELIVERY DATA
  // =========================

  const loadDashboard = async () => {
    try {
      setError("");

      const response = await api.get(
        "/delivery-assignments/my"
      );

      const data =
        response.data?.assignments ||
        response.data?.data ||
        response.data ||
        [];

      setAssignments(
        Array.isArray(data) ? data : []
      );

      // Optional profile information
      if (response.data?.deliveryPerson) {
        setProfile(
          response.data.deliveryPerson
        );
      }
    } catch (err) {
      console.error(
        "Failed to load delivery dashboard:",
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
    loadDashboard();
  }, []);

  // =========================
  // REFRESH
  // =========================

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
  };

  // =========================
  // UPDATE DELIVERY STATUS
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

      await loadDashboard();
    } catch (err) {
      console.error(
        "Failed to update status:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to update delivery status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // STATUS HELPERS
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
  // COUNTS
  // =========================

  const totalAssignments =
    assignments.length;

  const activeAssignments =
    assignments.filter(
      (item) =>
        ![
          "DELIVERED",
          "CANCELLED",
        ].includes(
          item.status ||
            item.order?.status
        )
    ).length;

  const deliveredAssignments =
    assignments.filter(
      (item) =>
        (item.status ||
          item.order?.status) ===
        "DELIVERED"
    ).length;

  const outForDelivery =
    assignments.filter(
      (item) =>
        (item.status ||
          item.order?.status) ===
        "OUT_FOR_DELIVERY"
    ).length;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">

            <div className="h-10 w-72 rounded bg-gray-200" />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="h-32 rounded-2xl bg-gray-200"
                  />
                )
              )}
            </div>

            <div className="h-96 rounded-2xl bg-gray-200" />

          </div>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* =========================
            HEADER
        ========================== */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Delivery Panel
            </p>

            <h1 className="mt-1 text-3xl font-black sm:text-4xl">
              Delivery Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your assigned deliveries
              and track your routes.
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
            PROFILE
        ========================== */}

        {profile && (
          <div className="mt-8 rounded-2xl border bg-white p-6">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <User size={25} />
              </div>

              <div>
                <h2 className="font-black">
                  {profile.name ||
                    profile.fullName ||
                    "Delivery Person"}
                </h2>

                {profile.phone && (
                  <p className="mt-1 text-sm text-gray-500">
                    {profile.phone}
                  </p>
                )}
              </div>

            </div>

          </div>
        )}

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
                  Unable to load deliveries
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* =========================
            STATISTICS
        ========================== */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border bg-white p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Total Assignments
                </p>

                <p className="mt-2 text-3xl font-black">
                  {totalAssignments}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                <Package size={22} />
              </div>

            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Active Deliveries
                </p>

                <p className="mt-2 text-3xl font-black">
                  {activeAssignments}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Truck
                  size={22}
                  className="text-blue-600"
                />
              </div>

            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Out for Delivery
                </p>

                <p className="mt-2 text-3xl font-black">
                  {outForDelivery}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <Navigation
                  size={22}
                  className="text-purple-600"
                />
              </div>

            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Delivered
                </p>

                <p className="mt-2 text-3xl font-black">
                  {deliveredAssignments}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <CheckCircle
                  size={22}
                  className="text-green-600"
                />
              </div>

            </div>
          </div>

        </div>

        {/* =========================
            QUICK ACTIONS
        ========================== */}

        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <Link
            to="/delivery/routes"
            className="rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Navigation size={22} />
            </div>

            <h3 className="mt-5 font-black">
              Delivery Routes
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              View and manage your delivery
              routes.
            </p>
          </Link>

          <Link
            to="/delivery/qr"
            className="rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <QrCode size={22} />
            </div>

            <h3 className="mt-5 font-black">
              QR Verification
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Scan or verify an order using
              QR code.
            </p>
          </Link>

          <div className="rounded-2xl border bg-white p-6">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <MapPin size={22} />
            </div>

            <h3 className="mt-5 font-black">
              Live Location
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Update your location while
              delivering orders.
            </p>

          </div>

        </div>

        {/* =========================
            ASSIGNMENTS
        ========================== */}

        <div className="mt-10">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-black">
                My Deliveries
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Orders currently assigned to you.
              </p>
            </div>

          </div>

          {assignments.length === 0 ? (
            <div className="mt-6 rounded-2xl border bg-white p-12 text-center">

              <Truck
                size={50}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-5 text-xl font-black">
                No Deliveries Assigned
              </h3>

              <p className="mt-2 text-gray-500">
                You currently don't have any
                delivery assignments.
              </p>

            </div>
          ) : (
            <div className="mt-6 space-y-5">

              {assignments.map(
                (assignment, index) => {
                  const order =
                    assignment.order ||
                    assignment.orderId ||
                    {};

                  const assignmentId =
                    assignment._id ||
                    assignment.id ||
                    index;

                  const status =
                    assignment.status ||
                    order.status ||
                    "ASSIGNED";

                  const address =
                    order.deliveryAddress ||
                    assignment.deliveryAddress ||
                    {};

                  const customer =
                    order.customer ||
                    assignment.customer ||
                    {};

                  const phone =
                    address.phone ||
                    customer.phone;

                  const orderId =
                    order._id ||
                    order.id ||
                    assignment.orderId;

                  return (
                    <div
                      key={assignmentId}
                      className="rounded-2xl border bg-white p-6"
                    >

                      {/* Top */}

                      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">

                        <div className="flex gap-4">

                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                            <Package size={25} />
                          </div>

                          <div>

                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                              Delivery Order
                            </p>

                            <h3 className="mt-1 font-black">
                              #
                              {String(
                                orderId ||
                                  "N/A"
                              ).slice(-10)}
                            </h3>

                            <div className="mt-2 flex flex-wrap items-center gap-2">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                  status
                                )}`}
                              >
                                {formatStatus(
                                  status
                                )}
                              </span>

                              {assignment.priority && (
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                                  {
                                    assignment.priority
                                  }{" "}
                                  Priority
                                </span>
                              )}

                            </div>

                          </div>

                        </div>

                        <div className="text-sm text-gray-500">

                          {assignment.createdAt && (
                            <div className="flex items-center gap-2">
                              <Clock size={15} />

                              {new Date(
                                assignment.createdAt
                              ).toLocaleString(
                                "en-NP"
                              )}
                            </div>
                          )}

                        </div>

                      </div>

                      {/* Details */}

                      <div className="mt-6 grid gap-5 border-t pt-6 md:grid-cols-2">

                        {/* Customer */}

                        <div className="flex gap-3">

                          <User
                            size={20}
                            className="mt-0.5 text-gray-500"
                          />

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                              Customer
                            </p>

                            <p className="mt-1 font-semibold">
                              {customer.name ||
                                customer.fullName ||
                                order.customerName ||
                                "Customer"}
                            </p>

                            {phone && (
                              <p className="mt-1 text-sm text-gray-500">
                                {phone}
                              </p>
                            )}
                          </div>

                        </div>

                        {/* Address */}

                        <div className="flex gap-3">

                          <MapPin
                            size={20}
                            className="mt-0.5 text-gray-500"
                          />

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                              Delivery Address
                            </p>

                            <p className="mt-1 font-semibold">
                              {address.address ||
                                "Address unavailable"}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              {address.municipality &&
                                `${address.municipality}, `}

                              {address.district &&
                                `${address.district}, `}

                              {address.province ||
                                ""}
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* Actions */}

                      <div className="mt-6 flex flex-wrap gap-3 border-t pt-6">

                        {/* Start pickup */}

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
                            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
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

                        {/* Out for delivery */}

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
                            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
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

                        {/* Delivered */}

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
                            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
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

                        {/* Route */}

                        {orderId && (
                          <Link
                            to={`/delivery/routes?order=${orderId}`}
                            className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
                          >
                            <Navigation
                              size={17}
                            />
                            View Route
                          </Link>
                        )}

                        {/* QR */}

                        {orderId && (
                          <Link
                            to={`/delivery/qr?order=${orderId}`}
                            className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
                          >
                            <QrCode
                              size={17}
                            />
                            QR Verify
                          </Link>
                        )}

                        {/* Call */}

                        {phone && (
                          <a
                            href={`tel:${phone}`}
                            className="inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-gray-50"
                          >
                            <Phone
                              size={17}
                            />
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
    </div>
  );
};

export default DeliveryDashboard;