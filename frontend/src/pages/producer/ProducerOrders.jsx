import {
    ArrowLeft,
    Calendar,
    ChevronRight,
    Loader2,
    Package,
    RefreshCw,
    ShoppingBag,
    User,
    XCircle,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import api from "../../services/api";

const ProducerOrders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    // ==========================================
    // LOAD ORDERS
    // ==========================================

    const loadOrders = async () => {
        try {
            setError("");

            const response = await api.get(
                "/producer-dashboard/recent-orders?limit=50"
            );

            const data =
                response.data?.orders ||
                response.data?.data ||
                [];

            setOrders(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load producer orders:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load producer orders."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // ==========================================
    // REFRESH
    // ==========================================

    const handleRefresh = async () => {
        setRefreshing(true);

        await loadOrders();
    };

    // ==========================================
    // FORMAT STATUS
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

    // ==========================================
    // STATUS STYLE
    // ==========================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "DELIVERED":
                return "bg-green-100 text-green-700";

            case "SHIPPED":
                return "bg-blue-100 text-blue-700";

            case "PROCESSING":
                return "bg-purple-100 text-purple-700";

            case "CONFIRMED":
                return "bg-cyan-100 text-cyan-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // ==========================================
    // FILTER
    // ==========================================

    const filteredOrders =
        statusFilter === "ALL"
            ? orders
            : orders.filter(
                (order) =>
                    order.orderStatus ===
                    statusFilter
            );

    // ==========================================
    // TOTAL VALUE
    // ==========================================

    const getOrderValue = (order) => {
        return (order.items || []).reduce(
            (total, item) =>
                total +
                Number(item.price || 0) *
                Number(item.quantity || 0),
            0
        );
    };

    // ==========================================
    // DATE
    // ==========================================

    const formatDate = (date) => {
        if (!date) {
            return "Unknown date";
        }

        return new Date(date).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "short",
                day: "numeric",
            }
        );
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">

                <div className="mx-auto max-w-7xl px-4 py-10">

                    <div className="animate-pulse space-y-6">

                        <div className="h-10 w-64 rounded bg-gray-200" />

                        <div className="h-24 rounded-2xl bg-gray-200" />

                        <div className="h-[500px] rounded-2xl bg-gray-200" />

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                {/* HEADER */}

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                        <Link
                            to="/producer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
                        >
                            <ArrowLeft size={17} />

                            Back to Dashboard
                        </Link>

                        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Producer Panel
                        </p>

                        <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                            Orders
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Manage orders containing your products.
                        </p>

                    </div>

                    <button
                        type="button"
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

                {/* ERROR */}

                {error && (
                    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">

                        <div className="flex items-start gap-3">

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

                {/* FILTERS */}

                <div className="mt-8 flex flex-wrap gap-2">

                    {[
                        "ALL",
                        "PENDING",
                        "CONFIRMED",
                        "PROCESSING",
                        "SHIPPED",
                        "DELIVERED",
                        "CANCELLED",
                    ].map((status) => (

                        <button
                            key={status}
                            type="button"
                            onClick={() =>
                                setStatusFilter(
                                    status
                                )
                            }
                            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                                statusFilter ===
                                status
                                    ? "bg-black text-white"
                                    : "border bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {status === "ALL"
                                ? "All Orders"
                                : formatStatus(
                                    status
                                )}
                        </button>

                    ))}

                </div>

                {/* ORDER COUNT */}

                <div className="mt-6 rounded-2xl border bg-white p-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                            <ShoppingBag size={21} />
                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Showing Orders
                            </p>

                            <p className="text-2xl font-black">
                                {filteredOrders.length}
                            </p>

                        </div>

                    </div>

                </div>

                {/* EMPTY */}

                {filteredOrders.length === 0 ? (

                    <div className="mt-6 rounded-2xl border bg-white p-12 text-center">

                        <Package
                            size={55}
                            className="mx-auto text-gray-300"
                        />

                        <h2 className="mt-5 text-2xl font-black">
                            No Orders Found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            There are no orders matching this filter.
                        </p>

                    </div>

                ) : (

                    <div className="mt-6 space-y-4">

                        {filteredOrders.map(
                            (order) => (

                                <button
                                    key={order._id}
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/producer/orders/${order._id}`,
                                            {
                                                state: {
                                                    order,
                                                },
                                            }
                                        )
                                    }
                                    className="w-full rounded-2xl border bg-white p-6 text-left transition hover:border-black hover:shadow-sm"
                                >

                                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

                                        <div className="flex items-start gap-4">

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                                <Package
                                                    size={22}
                                                />
                                            </div>

                                            <div>

                                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                                    Order
                                                </p>

                                                <h2 className="mt-1 text-lg font-black">
                                                    #
                                                    {order.orderNumber ||
                                                        String(
                                                            order._id
                                                        ).slice(
                                                            -10
                                                        )}
                                                </h2>

                                                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">

                                                    <span className="inline-flex items-center gap-1">
                                                        <Calendar
                                                            size={15}
                                                        />

                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </span>

                                                    <span className="inline-flex items-center gap-1">
                                                        <User
                                                            size={15}
                                                        />

                                                        {order.customer
                                                            ?.name ||
                                                            "Customer"}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">

                                            <span
                                                className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusStyle(
                                                    order.orderStatus
                                                )}`}
                                            >
                                                {formatStatus(
                                                    order.orderStatus
                                                )}
                                            </span>

                                            <div className="text-left sm:text-right">

                                                <p className="text-xs text-gray-400">
                                                    Your Items
                                                </p>

                                                <p className="font-black">
                                                    {order.items
                                                        ?.length ||
                                                        0}{" "}
                                                    item(s)
                                                </p>

                                                <p className="mt-1 text-sm font-bold">
                                                    Rs.{" "}
                                                    {getOrderValue(
                                                        order
                                                    ).toLocaleString()}
                                                </p>

                                            </div>

                                            <ChevronRight
                                                size={20}
                                                className="text-gray-400"
                                            />

                                        </div>

                                    </div>

                                </button>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
};

export default ProducerOrders;