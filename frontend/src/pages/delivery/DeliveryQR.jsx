
import {
  ArrowLeft,
  CheckCircle,
  Package,
  QrCode,
  RefreshCw,
  ScanLine,
  Search,
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

const DeliveryQR = () => {
  const [searchParams] = useSearchParams();

  const orderQuery = searchParams.get("order");

  const [assignments, setAssignments] =
    useState([]);

  const [selectedAssignment, setSelectedAssignment] =
    useState(null);

  const [qrData, setQrData] = useState("");

  const [verificationResult, setVerificationResult] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [verifying, setVerifying] =
    useState(false);

  const [error, setError] =
    useState("");

  const [manualCode, setManualCode] =
    useState("");

  // =========================
  // LOAD ASSIGNMENTS
  // =========================

  const loadAssignments = async () => {
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

      const list = Array.isArray(data)
        ? data
        : [];

      setAssignments(list);

      // Select order from URL
      if (orderQuery) {
        const matched = list.find(
          (assignment) => {
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
          }
        );

        if (matched) {
          setSelectedAssignment(matched);
        }
      } else if (list.length > 0) {
        setSelectedAssignment(list[0]);
      }
    } catch (err) {
      console.error(
        "Failed to load delivery assignments:",
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
  }, [orderQuery]);

  // =========================
  // REFRESH
  // =========================

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadAssignments();
  };

  // =========================
  // SELECT ORDER
  // =========================

  const selectAssignment = (
    assignment
  ) => {
    setSelectedAssignment(assignment);
    setQrData("");
    setVerificationResult(null);
    setManualCode("");
    setError("");
  };

  // =========================
  // GET ORDER ID
  // =========================

  const getOrderId = (assignment) => {
    if (!assignment) {
      return null;
    }

    const order =
      assignment.order ||
      assignment.orderId ||
      {};

    return (
      order._id ||
      order.id ||
      assignment.orderId ||
      null
    );
  };

  // =========================
  // GENERATE QR
  // =========================

  const generateQR = async () => {
    if (!selectedAssignment) {
      setError(
        "Please select a delivery first."
      );

      return;
    }

    const assignmentId =
      selectedAssignment._id ||
      selectedAssignment.id;

    const orderId =
      getOrderId(selectedAssignment);

    try {
      setError("");
      setQrData("");
      setVerificationResult(null);

      /*
       * Try the assignment-based endpoint first.
       *
       * If your backend uses a different endpoint,
       * change only this request.
       */

      const response = await api.post(
        `/delivery-qr/generate`,
        {
          assignmentId,
          orderId,
        }
      );

      const data =
        response.data?.qr ||
        response.data?.qrData ||
        response.data?.data ||
        response.data;

      if (typeof data === "string") {
        setQrData(data);
      } else {
        setQrData(
          data?.qrCode ||
            data?.code ||
            data?.token ||
            ""
        );
      }
    } catch (err) {
      console.error(
        "Failed to generate QR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to generate QR code."
      );
    }
  };

  // =========================
  // VERIFY QR
  // =========================

  const verifyQR = async (
    code = manualCode
  ) => {
    if (!code.trim()) {
      setError(
        "Please enter a QR verification code."
      );

      return;
    }

    try {
      setVerifying(true);
      setError("");
      setVerificationResult(null);

      const assignmentId =
        selectedAssignment?._id ||
        selectedAssignment?.id;

      const orderId =
        getOrderId(selectedAssignment);

      const response = await api.post(
        `/delivery-qr/verify`,
        {
          code: code.trim(),
          assignmentId,
          orderId,
        }
      );

      setVerificationResult({
        success: true,
        message:
          response.data?.message ||
          "QR verification successful.",
        data:
          response.data?.data ||
          response.data,
      });
    } catch (err) {
      console.error(
        "QR verification failed:",
        err
      );

      setVerificationResult({
        success: false,
        message:
          err.response?.data?.message ||
          "QR verification failed.",
      });
    } finally {
      setVerifying(false);
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

  // =========================
  // SELECTED ORDER
  // =========================

  const selectedOrder =
    selectedAssignment?.order ||
    selectedAssignment?.orderId ||
    {};

  const selectedOrderId =
    getOrderId(selectedAssignment);

  const selectedStatus =
    selectedAssignment?.status ||
    selectedOrder?.status ||
    "ASSIGNED";

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">

            <div className="h-10 w-72 rounded bg-gray-200" />

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
              QR Verification
            </h1>

            <p className="mt-2 text-gray-500">
              Generate and verify delivery QR
              codes.
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

            <div className="flex items-start gap-3">

              <XCircle
                size={22}
                className="mt-0.5 text-red-600"
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
            MAIN
        ========================== */}

        {assignments.length === 0 ? (
          <div className="mt-8 rounded-2xl border bg-white p-12 text-center">

            <QrCode
              size={55}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-5 text-2xl font-black">
              No Deliveries
            </h2>

            <p className="mt-2 text-gray-500">
              You don't have any delivery
              assignments to verify.
            </p>

            <Link
              to="/delivery"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            {/* =========================
                ORDERS
            ========================== */}

            <div className="rounded-2xl border bg-white p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                  <Package size={21} />
                </div>

                <div>
                  <h2 className="font-black">
                    My Deliveries
                  </h2>

                  <p className="text-sm text-gray-500">
                    Select an order
                  </p>
                </div>

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

                    const orderId =
                      order._id ||
                      order.id ||
                      assignment.orderId;

                    const status =
                      assignment.status ||
                      order.status ||
                      "ASSIGNED";

                    const selected =
                      selectedAssignment ===
                      assignment;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          selectAssignment(
                            assignment
                          )
                        }
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-black bg-gray-50"
                            : "hover:bg-gray-50"
                        }`}
                      >

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                            <Package size={18} />
                          </div>

                          <div className="min-w-0 flex-1">

                            <p className="truncate font-black">
                              #
                              {String(
                                orderId ||
                                  "N/A"
                              ).slice(-10)}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              {formatStatus(
                                status
                              )}
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
                QR PANEL
            ========================== */}

            <div className="lg:col-span-2">

              {!selectedAssignment ? (
                <div className="flex min-h-[500px] items-center justify-center rounded-2xl border bg-white">

                  <div className="text-center">

                    <QrCode
                      size={55}
                      className="mx-auto text-gray-300"
                    />

                    <h2 className="mt-5 text-xl font-black">
                      Select an Order
                    </h2>

                    <p className="mt-2 text-gray-500">
                      Select a delivery from the
                      list.
                    </p>

                  </div>

                </div>
              ) : (
                <div className="space-y-6">

                  {/* ORDER INFO */}

                  <div className="rounded-2xl border bg-white p-6">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                      <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Selected Order
                        </p>

                        <h2 className="mt-1 text-2xl font-black">
                          #
                          {String(
                            selectedOrderId ||
                              "N/A"
                          ).slice(-10)}
                        </h2>

                      </div>

                      <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-bold">
                        {formatStatus(
                          selectedStatus
                        )}
                      </span>

                    </div>

                  </div>

                  {/* GENERATE */}

                  <div className="rounded-2xl border bg-white p-6">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                        <QrCode size={22} />
                      </div>

                      <div>
                        <h2 className="text-xl font-black">
                          Generate QR
                        </h2>

                        <p className="text-sm text-gray-500">
                          Generate a verification
                          code for this delivery.
                        </p>
                      </div>

                    </div>

                    <button
                      onClick={generateQR}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
                    >
                      <QrCode size={18} />
                      Generate QR Code
                    </button>

                    {qrData && (
                      <div className="mt-6 rounded-xl border bg-gray-50 p-5">

                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                          QR / Verification
                          Data
                        </p>

                        <div className="mt-3 break-all rounded-lg bg-white p-4 font-mono text-sm">
                          {qrData}
                        </div>

                      </div>
                    )}

                  </div>

                  {/* VERIFY */}

                  <div className="rounded-2xl border bg-white p-6">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                        <ScanLine size={22} />
                      </div>

                      <div>
                        <h2 className="text-xl font-black">
                          Verify QR
                        </h2>

                        <p className="text-sm text-gray-500">
                          Enter the QR verification
                          code.
                        </p>
                      </div>

                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                      <div className="relative flex-1">

                        <Search
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                          type="text"
                          value={manualCode}
                          onChange={(event) =>
                            setManualCode(
                              event.target.value
                            )
                          }
                          placeholder="Enter QR code"
                          className="w-full rounded-xl border px-11 py-3 outline-none focus:border-black"
                        />

                      </div>

                      <button
                        onClick={() =>
                          verifyQR()
                        }
                        disabled={verifying}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        {verifying
                          ? "Verifying..."
                          : "Verify"}
                      </button>

                    </div>

                    {/* RESULT */}

                    {verificationResult && (
                      <div
                        className={`mt-6 rounded-xl border p-5 ${
                          verificationResult.success
                            ? "border-green-200 bg-green-50"
                            : "border-red-200 bg-red-50"
                        }`}
                      >

                        <div className="flex items-start gap-3">

                          {verificationResult.success ? (
                            <CheckCircle
                              size={23}
                              className="text-green-600"
                            />
                          ) : (
                            <XCircle
                              size={23}
                              className="text-red-600"
                            />
                          )}

                          <div>

                            <p
                              className={`font-bold ${
                                verificationResult.success
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {verificationResult.success
                                ? "Verification Successful"
                                : "Verification Failed"}
                            </p>

                            <p
                              className={`mt-1 text-sm ${
                                verificationResult.success
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {
                                verificationResult.message
                              }
                            </p>

                          </div>

                        </div>

                      </div>
                    )}

                  </div>

                  {/* INSTRUCTIONS */}

                  <div className="rounded-2xl border bg-white p-6">

                    <h2 className="text-lg font-black">
                      Delivery Verification
                    </h2>

                    <div className="mt-5 space-y-4">

                      <div className="flex gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-black">
                          1
                        </div>

                        <p className="text-sm text-gray-600">
                          Select the delivery order
                          you want to verify.
                        </p>

                      </div>

                      <div className="flex gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-black">
                          2
                        </div>

                        <p className="text-sm text-gray-600">
                          Generate or obtain the
                          customer's QR verification
                          code.
                        </p>

                      </div>

                      <div className="flex gap-3">

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-black">
                          3
                        </div>

                        <p className="text-sm text-gray-600">
                          Enter the code and verify
                          the delivery.
                        </p>

                      </div>

                    </div>

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

export default DeliveryQR;
