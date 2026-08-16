import {
    ArrowLeft,
    CheckCircle,
    Clock,
    Edit2,
    Package,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    XCircle,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import api from "../../services/api";

const ProducerProducts = () => {
    const navigate = useNavigate();

    // ==========================================
    // STATE
    // ==========================================

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [deleting, setDeleting] = useState(null);

    const [deleteError, setDeleteError] = useState("");

    // ==========================================
    // LOAD PRODUCTS
    // ==========================================

    const loadProducts = async () => {
        try {
            setError("");

            const response = await api.get(
                "/producer-dashboard/products"
            );

            const data =
                response.data?.products ||
                response.data?.data ||
                response.data ||
                [];

            setProducts(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load producer products:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load products."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        loadProducts();
    }, []);

    // ==========================================
    // REFRESH
    // ==========================================

    const handleRefresh = async () => {
        setRefreshing(true);

        await loadProducts();
    };

    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    const handleDelete = async (productId, productName) => {
        if (!window.confirm(
            `Are you sure you want to delete "${productName}"? This action cannot be undone.`
        )) {
            return;
        }

        try {
            setDeleting(productId);
            setDeleteError("");

            await api.delete(
                `/products/${productId}`
            );

            setProducts((prev) =>
                prev.filter(
                    (p) => p._id !== productId
                )
            );
        } catch (err) {
            console.error("Failed to delete product:", err);
            setDeleteError(
                err.response?.data?.message ||
                "Failed to delete product."
            );
        } finally {
            setDeleting(null);
        }
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
    // PRODUCT NAME
    // ==========================================

    const getProductName = (product) => {
        return (
            product.name ||
            product.title ||
            "Unnamed Product"
        );
    };

    // ==========================================
    // PRODUCT IMAGE
    // ==========================================

    const getProductImage = (product) => {
        if (
            Array.isArray(
                product.images
            ) &&
            product.images.length > 0
        ) {
            const firstImage =
                product.images[0];

            if (
                typeof firstImage ===
                "string"
            ) {
                return firstImage;
            }

            return (
                firstImage?.url ||
                firstImage?.secure_url ||
                ""
            );
        }

        return (
            product.image ||
            product.imageUrl ||
            product.thumbnail ||
            ""
        );
    };

    // ==========================================
    // PRICE
    // ==========================================

    const getPrice = (product) => {
        const price =
            Number(product.price);

        if (Number.isNaN(price)) {
            return "N/A";
        }

        return `Rs. ${price.toLocaleString()}`;
    };

    // ==========================================
    // STATUS
    // ==========================================

    const getVerificationStatus = (
        product
    ) => {
        return (
            product.verificationStatus ||
            "PENDING"
        );
    };

    // ==========================================
    // FILTER PRODUCTS
    // ==========================================

    const filteredProducts =
        useMemo(() => {
            return products.filter(
                (product) => {
                    const name =
                        getProductName(
                            product
                        ).toLowerCase();

                    const category =
                        product.category
                            ?.name ||
                        product.category ||
                        "";

                    const matchesSearch =
                        name.includes(
                            search
                                .toLowerCase()
                        ) ||
                        String(category)
                            .toLowerCase()
                            .includes(
                                search.toLowerCase()
                            );

                    const verificationStatus =
                        getVerificationStatus(
                            product
                        );

                    const matchesStatus =
                        statusFilter ===
                            "ALL" ||
                        verificationStatus ===
                            statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            products,
            search,
            statusFilter,
        ]);

    // ==========================================
    // STATISTICS
    // ==========================================

    const totalProducts =
        products.length;

    const approvedProducts =
        products.filter(
            (product) =>
                getVerificationStatus(
                    product
                ) === "APPROVED"
        ).length;

    const pendingProducts =
        products.filter(
            (product) =>
                getVerificationStatus(
                    product
                ) === "PENDING"
        ).length;

    const rejectedProducts =
        products.filter(
            (product) =>
                getVerificationStatus(
                    product
                ) === "REJECTED"
        ).length;

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">

                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                    <div className="animate-pulse space-y-8">

                        <div className="h-10 w-80 rounded bg-gray-200" />

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                            {Array.from({
                                length: 4,
                            }).map(
                                (_, index) => (
                                    <div
                                        key={
                                            index
                                        }
                                        className="h-32 rounded-2xl bg-gray-200"
                                    />
                                )
                            )}

                        </div>

                        <div className="h-24 rounded-2xl bg-gray-200" />

                        <div className="h-96 rounded-2xl bg-gray-200" />

                    </div>

                </div>

            </div>
        );
    }

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

                {/* ==================================
                    HEADER
                ================================== */}

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                    <div>

                        <Link
                            to="/producer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
                        >
                            <ArrowLeft
                                size={17}
                            />

                            Back to Dashboard
                        </Link>

                        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
                            Producer Panel
                        </p>

                        <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                            My Products
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Manage and monitor your products.
                        </p>

                    </div>

                    <div className="flex flex-wrap gap-3">

                        <button
                            type="button"
                            onClick={
                                handleRefresh
                            }
                            disabled={
                                refreshing
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl border bg-white px-5 py-3 font-semibold hover:bg-gray-50 disabled:opacity-50"
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

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/producer/products/create"
                                )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
                        >

                            <Plus
                                size={18}
                            />

                            Add Product

                        </button>

                    </div>

                </div>

                {/* ==================================
                    ERROR
                ================================== */}

                {error && (
                    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">

                        <div className="flex items-start gap-3">

                            <XCircle
                                size={22}
                                className="mt-0.5 shrink-0 text-red-600"
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

                {/* ==================================
                    DELETE ERROR
                ================================== */}

                {deleteError && (
                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-5">

                        <div className="flex items-start gap-3">

                            <XCircle
                                size={22}
                                className="mt-0.5 shrink-0 text-red-600"
                            />

                            <div>

                                <p className="font-bold text-red-700">
                                    Delete Failed
                                </p>

                                <p className="mt-1 text-sm text-red-600">
                                    {deleteError}
                                </p>

                            </div>

                        </div>

                    </div>
                )}

                {/* ==================================
                    STATISTICS
                ================================== */}

                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {/* TOTAL */}

                    <div className="rounded-2xl border bg-white p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-gray-500">
                                    Total Products
                                </p>

                                <p className="mt-2 text-3xl font-black">
                                    {
                                        totalProducts
                                    }
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">

                                <Package
                                    size={23}
                                />

                            </div>

                        </div>

                    </div>

                    {/* APPROVED */}

                    <div className="rounded-2xl border bg-white p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-gray-500">
                                    Approved
                                </p>

                                <p className="mt-2 text-3xl font-black">
                                    {
                                        approvedProducts
                                    }
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">

                                <CheckCircle
                                    size={23}
                                    className="text-green-600"
                                />

                            </div>

                        </div>

                    </div>

                    {/* PENDING */}

                    <div className="rounded-2xl border bg-white p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-gray-500">
                                    Pending
                                </p>

                                <p className="mt-2 text-3xl font-black">
                                    {
                                        pendingProducts
                                    }
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50">

                                <Clock
                                    size={23}
                                    className="text-yellow-600"
                                />

                            </div>

                        </div>

                    </div>

                    {/* REJECTED */}

                    <div className="rounded-2xl border bg-white p-6">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-gray-500">
                                    Rejected
                                </p>

                                <p className="mt-2 text-3xl font-black">
                                    {
                                        rejectedProducts
                                    }
                                </p>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                                <XCircle
                                    size={23}
                                    className="text-red-600"
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* ==================================
                    SEARCH / FILTER
                ================================== */}

                <div className="mt-8 rounded-2xl border bg-white p-5">

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div className="relative flex-1">

                            <Search
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search products..."
                                className="w-full rounded-xl border px-11 py-3 outline-none focus:border-black"
                            />

                        </div>

                        <div className="flex flex-wrap gap-2">

                            {[
                                {
                                    label: "All",
                                    value: "ALL",
                                },
                                {
                                    label: "Approved",
                                    value: "APPROVED",
                                },
                                {
                                    label: "Pending",
                                    value: "PENDING",
                                },
                                {
                                    label: "Rejected",
                                    value: "REJECTED",
                                },
                            ].map(
                                (filter) => (
                                    <button
                                        key={
                                            filter.value
                                        }
                                        type="button"
                                        onClick={() =>
                                            setStatusFilter(
                                                filter.value
                                            )
                                        }
                                        className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                                            statusFilter ===
                                            filter.value
                                                ? "bg-black text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {
                                            filter.label
                                        }
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                </div>

                {/* ==================================
                    PRODUCTS
                ================================== */}

                <div className="mt-6">

                    {filteredProducts.length ===
                    0 ? (

                        <div className="rounded-2xl border bg-white p-12 text-center">

                            <Package
                                size={55}
                                className="mx-auto text-gray-300"
                            />

                            <h2 className="mt-5 text-2xl font-black">
                                No Products Found
                            </h2>

                            <p className="mt-2 text-gray-500">
                                {products.length ===
                                0
                                    ? "You have not added any products yet."
                                    : "No products match your current search or filter."}
                            </p>

                            {products.length ===
                                0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/producer/products/create"
                                        )
                                    }
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
                                >

                                    <Plus
                                        size={18}
                                    />

                                    Add Your First Product

                                </button>
                            )}

                        </div>

                    ) : (

                        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                            {filteredProducts.map(
                                (
                                    product
                                ) => {

                                    const productId =
                                        product._id ||
                                        product.id;

                                    const image =
                                        getProductImage(
                                            product
                                        );

                                    const verificationStatus =
                                        getVerificationStatus(
                                            product
                                        );

                                    const category =
                                        product
                                            .category
                                            ?.name ||
                                        product.category ||
                                        "Uncategorized";

                                    return (
                                        <div
                                            key={
                                                productId
                                            }
                                            className="overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-md"
                                        >

                                            {/* IMAGE */}

                                            <div className="relative h-56 bg-gray-100">

                                                {image ? (

                                                    <img
                                                        src={
                                                            image
                                                        }
                                                        alt={getProductName(
                                                            product
                                                        )}
                                                        className="h-full w-full object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-full items-center justify-center">

                                                        <Package
                                                            size={
                                                                55
                                                            }
                                                            className="text-gray-300"
                                                        />

                                                    </div>

                                                )}

                                                {/* STATUS */}

                                                <div className="absolute right-3 top-3">

                                                    {verificationStatus ===
                                                    "APPROVED" ? (

                                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">

                                                            <CheckCircle
                                                                size={
                                                                    14
                                                                }
                                                            />

                                                            Approved

                                                        </span>

                                                    ) : verificationStatus ===
                                                      "REJECTED" ? (

                                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700">

                                                            <XCircle
                                                                size={
                                                                    14
                                                                }
                                                            />

                                                            Rejected

                                                        </span>

                                                    ) : (

                                                        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-700">

                                                            <Clock
                                                                size={
                                                                    14
                                                                }
                                                            />

                                                            Pending

                                                        </span>

                                                    )}

                                                </div>

                                            </div>

                                            {/* CONTENT */}

                                            <div className="p-5">

                                                <div className="flex items-start justify-between gap-3">

                                                    <div className="min-w-0">

                                                        <h2 className="truncate text-lg font-black">

                                                            {getProductName(
                                                                product
                                                            )}

                                                        </h2>

                                                        <p className="mt-1 text-sm text-gray-500">

                                                            {
                                                                category
                                                            }

                                                        </p>

                                                    </div>

                                                    <p className="shrink-0 font-black">

                                                        {
                                                            getPrice(
                                                                product
                                                            )
                                                        }

                                                    </p>

                                                </div>

                                                {/* DESCRIPTION */}

                                                {product.description && (
                                                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-gray-500">

                                                        {
                                                            product.description
                                                        }

                                                    </p>
                                                )}

                                                {/* STOCK */}

                                                <div className="mt-5 flex items-center justify-between border-t pt-4">

                                                    <div>

                                                        <p className="text-xs font-medium text-gray-400">
                                                            Stock
                                                        </p>

                                                        <p className="mt-1 font-bold">

                                                            {product.stock ??
                                                                product.quantity ??
                                                                0}

                                                        </p>

                                                    </div>

                                                    <div>

                                                        <p className="text-xs font-medium text-gray-400">
                                                            Status
                                                        </p>

                                                        <p className="mt-1 font-bold">

                                                            {
                                                                formatStatus(
                                                                    verificationStatus
                                                                )
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                                {/* ACTION */}

                                                <div className="mt-5 flex gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/producer/products/${productId}`
                                                            )
                                                        }
                                                        className="flex-1 rounded-xl border px-4 py-3 text-sm font-bold hover:bg-gray-50"
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/producer/products/${productId}/edit`
                                                            )
                                                        }
                                                        className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-600 hover:bg-blue-100"
                                                        title="Edit Product"
                                                    >
                                                        <Edit2 size={16} />
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                productId,
                                                                getProductName(
                                                                    product
                                                                )
                                                            )
                                                        }
                                                        disabled={
                                                            deleting ===
                                                            productId
                                                        }
                                                        className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                                                        title="Delete Product"
                                                    >
                                                        <Trash2 size={16} />
                                                        {deleting ===
                                                        productId
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>

                                                </div>

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

export default ProducerProducts;