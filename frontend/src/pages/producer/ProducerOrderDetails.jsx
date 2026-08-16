import {
    ArrowLeft,
    Calendar,
    CheckCircle,
    Package,
    User,
    XCircle,
} from "lucide-react";

import {
    Link,
    useLocation,
    useParams,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import api from "../../services/api";

const ProducerOrderDetails = () => {
    const { id } = useParams();

    const location = useLocation();

    const [order, setOrder] =
        useState(location.state?.order || null);

    const [loading, setLoading] =
        useState(!order);

    const [error, setError] =
        useState("");

    // ==========================================
    // LOAD ORDER
    // ==========================================

    const loadOrder = async () => {
        try {
            setLoading(true);

            setError("");

            /*
             * Your current producer backend provides
             * recent orders, so find this order there.
             */
            const response =
                await api.get(
                    "/producer-dashboard/recent-orders?limit=50"
                );

            const orders =
                response.data?.orders ||
                response.data?.data ||
                [];

            const found =
                orders.find(
                    (item) =>
                        String(item._id) ===
                        String(id)
                );

            if (!found) {
                throw new Error(
                    "Order not found."
                );
            }

            setOrder(found);
        } catch (err) {
            console.error(
                "Failed to load producer order:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load order."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

        if (!order) {
            loadOrder();
        }

    }, [id]);

    // ==========================================
    // FORMAT
    // ==========================================

    const formatStatus = (status) => {
        if (!status) {
            return "Unknown";
        }

        return String(status)
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                (letter) =>
                    letter.toUpperCase()
            );
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "DELIVERED":
                return "bg-green-100 text-green-700";

            case "SHIPPED":
                return "bg-blue-100 text-blue-700";

            case "PROCESSING":
                return "bg-purple-100 text-purple-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "Unknown";
        }

        return new Date(date).toLocaleString(
            "en-US",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );
    };

    const getTotal = () => {
        if (!order?.items) {
            return 0;
        }

        return order.items.reduce(
            (total, item) =>
                total +
                Number(item.price || 0) *
                Number(item.quantity || 0),
            0
        );
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">

                <div className="mx-auto max-w-5xl px-4 py-10">

                    <div className="animate-pulse space-y-6">

                        <div className="h-10 w-64 rounded bg-gray-200" />

                        <div className="h-48 rounded-2xl bg-gray-200" />

                        <div className="h-96 rounded-2xl bg-gray-200" />

                    </div>

                </div>

            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50">

                <div className="mx-auto max-w-5xl px-4 py-10">

                    <Link
                        to="/producer/orders"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
                    >
                        <ArrowLeft size={17} />

                        Back to Orders
                    </Link>

                    <div className="mt-8 rounded-2xl border bg-white p-12 text-center">

                        <XCircle
                            size={50}
                            className="mx-auto text-red-500"
                        />

                        <h1 className="mt-5 text-2xl font-black">
                            Order Not Found
                        </h1>

                        <p className="mt-2 text-gray-500">
                            {error ||
                                "Unable to find this order."}
                        </p>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

                {/* HEADER */}

                <Link
                    to="/producer/orders"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
                >
                    <ArrowLeft size={17} />

                    Back to Orders
                </Link>

                <div className="mt-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                        <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                            Producer Order
                        </p>

                        <h1 className="mt-1 text-3xl font-black">
                            #
                            {order.orderNumber ||
                                String(
                                    order._id
                                ).slice(-10)}
                        </h1>

                    </div>

                    <span
                        className={`w-fit rounded-full px-5 py-2 text-sm font-bold ${getStatusStyle(
                            order.orderStatus
                        )}`}
                    >
                        {formatStatus(
                            order.orderStatus
                        )}
                    </span>

                </div>

                {/* ORDER INFO */}

                <div className="mt-8 grid gap-6 md:grid-cols-3">

                    <div className="rounded-2xl border bg-white p-5">

                        <Calendar
                            size={21}
                            className="text-gray-500"
                        />

                        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-gray-400">
                            Order Date
                        </p>

                        <p className="mt-1 font-bold">
                            {formatDate(
                                order.createdAt
                            )}
                        </p>

                    </div>

                    <div className="rounded-2xl border bg-white p-5">

                        <User
                            size={21}
                            className="text-gray-500"
                        />

                        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-gray-400">
                            Customer
                        </p>

                        <p className="mt-1 font-bold">
                            {order.customer?.name ||
                                "Customer"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            {order.customer?.email ||
                                ""}
                        </p>

                    </div>

                    <div className="rounded-2xl border bg-white p-5">

                        <Package
                            size={21}
                            className="text-gray-500"
                        />

                        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-gray-400">
                            Your Products
                        </p>

                        <p className="mt-1 font-bold">
                            {order.items?.length ||
                                0}{" "}
                            item(s)
                        </p>

                    </div>

                </div>

                {/* PRODUCTS */}

                <div className="mt-6 rounded-2xl border bg-white p-6">

                    <h2 className="text-xl font-black">
                        Ordered Products
                    </h2>

                    <div className="mt-6 space-y-4">

                        {(order.items || []).map(
                            (item, index) => (

                                <div
                                    key={
                                        item._id ||
                                        index
                                    }
                                    className="flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                            <Package
                                                size={21}
                                            />
                                        </div>

                                        <div>

                                            <h3 className="font-black">
                                                {item.name ||
                                                    item.productName ||
                                                    "Product"}
                                            </h3>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Quantity:{" "}
                                                {item.quantity ||
                                                    0}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="text-left sm:text-right">

                                        <p className="text-sm text-gray-500">
                                            Price
                                        </p>

                                        <p className="font-black">
                                            Rs.{" "}
                                            {Number(
                                                item.price ||
                                                0
                                            ).toLocaleString()}
                                        </p>

                                        <p className="mt-1 text-sm font-bold">
                                            Subtotal: Rs.{" "}
                                            {(
                                                Number(
                                                    item.price ||
                                                    0
                                                ) *
                                                Number(
                                                    item.quantity ||
                                                    0
                                                )
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                    {/* TOTAL */}

                    <div className="mt-6 flex justify-between border-t pt-6">

                        <p className="font-bold">
                            Your Order Total
                        </p>

                        <p className="text-xl font-black">
                            Rs.{" "}
                            {getTotal().toLocaleString()}
                        </p>

                    </div>

                </div>

                {/* PAYMENT */}

                <div className="mt-6 rounded-2xl border bg-white p-6">

                    <h2 className="text-lg font-black">
                        Payment Information
                    </h2>

                    <div className="mt-4 flex items-center gap-3">

                        {order.paymentStatus ===
                        "PAID" ? (
                            <CheckCircle
                                size={21}
                                className="text-green-600"
                            />
                        ) : (
                            <XCircle
                                size={21}
                                className="text-red-500"
                            />
                        )}

                        <div>

                            <p className="font-bold">
                                {order.paymentStatus ||
                                    "UNKNOWN"}
                            </p>

                            <p className="text-sm text-gray-500">
                                Payment status
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ProducerOrderDetails;