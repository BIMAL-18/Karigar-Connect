import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  User,
  RefreshCw,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const ProducerDashboard = () => {
  const navigate = useNavigate();

  const [producer, setProducer] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");
  const [partialError, setPartialError] = useState("");

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken")
    );
  };

  const getAuthConfig = () => {
    const token = getToken();
    
    if (!token) {
      throw new Error("NO_AUTH_TOKEN");
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // =========================
  // LOAD PRODUCER
  // =========================
  const loadProducer = async () => {
    try {
      console.log("🔄 Loading producer profile...");
      const config = getAuthConfig();
      
      const response = await axios.get(
        `${API_URL}/producers/me`,
        config
      );

      const data = response.data;
      console.log("✅ Producer loaded:", data);

      setProducer(data?.producer || data?.data || data);
      setAuthError(""); // Clear auth error on success
    } catch (err) {
      console.error("❌ Failed to load producer:", err);
      
      if (err.message === "NO_AUTH_TOKEN") {
        setAuthError("Please log in to view your dashboard");
        throw err;
      }
      
      if (err?.response?.status === 401) {
        setAuthError("Your session has expired. Please log in again.");
        throw err;
      }
      
      if (err?.response?.status === 403) {
        setAuthError("You don't have permission to access this page. Make sure you're logged in as a Producer.");
        throw err;
      }

      // Log the error details
      console.error("Producer API Error:", {
        status: err?.response?.status,
        message: err?.response?.data?.message,
        error: err?.response?.data?.error,
        fullError: err,
      });

      throw err;
    }
  };

  // =========================
  // LOAD PRODUCTS
  // =========================
  const loadProducts = async () => {
    try {
      console.log("🔄 Loading products...");
      const config = getAuthConfig();

      /*
       * Try producer products endpoint first.
       * If your backend uses another endpoint, this can easily
       * be changed without touching the dashboard UI.
       */

      const endpoints = [
        `${API_URL}/products/my-products`,
        `${API_URL}/products/producer`,
        `${API_URL}/products`,
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`📍 Trying endpoint: ${endpoint}`);
          response = await axios.get(endpoint, config);

          if (response?.data) {
            console.log(`✅ Success with ${endpoint}:`, response.data);
            break;
          }
        } catch (err) {
          lastError = err;
          console.log(`⚠️ Endpoint failed: ${endpoint}`, {
            status: err?.response?.status,
            message: err?.response?.data?.message,
          });
        }
      }

      if (!response) {
        console.warn("⚠️ No products endpoint worked. Using empty array.");
        setProducts([]);
        setPartialError("Unable to load products. Please try refreshing.");
        return;
      }

      const data = response.data;

      const productList =
        data?.products ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      console.log("✅ Products loaded:", productList);
      setProducts(productList);
    } catch (err) {
      console.error("❌ Failed to load products:", err);
      
      if (err.message === "NO_AUTH_TOKEN") {
        setAuthError("Please log in to view your dashboard");
      }
      
      setProducts([]);
      
      if (!partialError) {
        setPartialError("Unable to load products.");
      }
    }
  };

  // =========================
  // LOAD ORDERS
  // =========================
  const loadOrders = async () => {
    try {
      console.log("🔄 Loading orders...");
      const config = getAuthConfig();

      const endpoints = [
        `${API_URL}/orders/producer`,
        `${API_URL}/orders/my-orders`,
        `${API_URL}/orders`,
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`📍 Trying endpoint: ${endpoint}`);
          response = await axios.get(endpoint, config);

          if (response?.data) {
            console.log(`✅ Success with ${endpoint}:`, response.data);
            break;
          }
        } catch (err) {
          lastError = err;
          console.log(`⚠️ Order endpoint failed: ${endpoint}`, {
            status: err?.response?.status,
            message: err?.response?.data?.message,
          });
        }
      }

      if (!response) {
        console.warn("⚠️ No orders endpoint worked. Using empty array.");
        setOrders([]);
        setPartialError("Unable to load orders. Please try refreshing.");
        return;
      }

      const data = response.data;

      const orderList =
        data?.orders ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      console.log("✅ Orders loaded:", orderList);
      setOrders(orderList);
    } catch (err) {
      console.error("❌ Failed to load orders:", err);
      
      if (err.message === "NO_AUTH_TOKEN") {
        setAuthError("Please log in to view your dashboard");
      }
      
      setOrders([]);
      
      if (!partialError) {
        setPartialError("Unable to load orders.");
      }
    }
  };

  // =========================
  // LOAD EVERYTHING
  // =========================
  const loadDashboard = async () => {
    try {
      console.log("🚀 Starting dashboard load...");
      
      // Check if user is authenticated
      const token = getToken();
      if (!token) {
        console.error("❌ No authentication token found");
        setAuthError("Please log in to access your dashboard");
        setLoading(false);
        return;
      }

      console.log("✅ Token found, loading data...");
      
      setLoading(true);
      setError("");
      setAuthError("");
      setPartialError("");

      // Try to load all data, but don't fail if one fails
      const results = await Promise.allSettled([
        loadProducer(),
        loadProducts(),
        loadOrders(),
      ]);

      // Check if all failed
      const allFailed = results.every(r => r.status === "rejected");
      if (allFailed) {
        const firstError = results[0].reason;
        
        if (firstError?.message === "NO_AUTH_TOKEN" || firstError?.response?.status === 401) {
          setAuthError("Your session has expired. Please log in again.");
          setError("Authentication failed. Please log in.");
        } else if (firstError?.response?.status === 403) {
          setAuthError("You don't have access to this page.");
          setError("Access denied. Make sure you're logged in as a Producer.");
        } else {
          console.error("Dashboard load error:", firstError);
          setError(
            firstError?.response?.data?.message ||
            firstError?.message ||
            "Unable to load dashboard. Please try again."
          );
        }
      }

      console.log("✅ Dashboard load complete", {
        producer: !!results[0]?.value,
        products: !!results[1]?.value,
        orders: !!results[2]?.value,
      });
    } catch (err) {
      console.error("❌ Dashboard loading error:", err);

      if (err?.message === "NO_AUTH_TOKEN") {
        setAuthError("Please log in to access your dashboard");
      } else if (err?.response?.status === 401) {
        setAuthError("Your session has expired. Please log in again.");
      } else {
        setError(
          err?.response?.data?.message ||
            "Unable to load producer information."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================
  // CALCULATIONS
  // =========================

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) =>
      product.isActive !== false &&
      product.status !== "inactive"
  ).length;

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce((total, order) => {
    const amount =
      order.totalAmount ??
      order.total ??
      order.amount ??
      0;

    return total + Number(amount);
  }, 0);

  const pendingOrders = orders.filter((order) => {
    const status = String(order.status || "").toLowerCase();

    return (
      status === "pending" ||
      status === "processing" ||
      status === "confirmed"
    );
  }).length;

  // =========================
  // HELPERS
  // =========================

  const getProductName = (product) => {
    return (
      product.name ||
      product.productName ||
      product.title ||
      "Unnamed Product"
    );
  };

  const getProductPrice = (product) => {
    return (
      product.price ??
      product.sellingPrice ??
      product.discountPrice ??
      0
    );
  };

  const getProductImage = (product) => {
    return (
      product.image ||
      product.imageUrl ||
      product.images?.[0] ||
      "https://via.placeholder.com/100"
    );
  };

  const getOrderId = (order) => {
    return (
      order.orderNumber ||
      order.orderId ||
      order._id?.slice(-8) ||
      "N/A"
    );
  };

  const getCustomerName = (order) => {
    return (
      order.customer?.name ||
      order.user?.name ||
      order.customerName ||
      order.user?.username ||
      "Customer"
    );
  };

  const getOrderAmount = (order) => {
    return Number(
      order.totalAmount ??
        order.total ??
        order.amount ??
        0
    );
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (value === "delivered" || value === "completed") {
      return "bg-green-100 text-green-700";
    }

    if (value === "cancelled" || value === "rejected") {
      return "bg-red-100 text-red-700";
    }

    if (
      value === "processing" ||
      value === "confirmed"
    ) {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Loading producer dashboard...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // AUTH ERROR
  // =========================

  if (authError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h2>
          
          <p className="text-gray-600 mb-6">
            {authError}
          </p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              <LogIn size={18} />
              Go to Login
            </button>
            
            <button
              onClick={loadDashboard}
              className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Producer Dashboard
              </h1>

              <p className="text-gray-500 mt-1">
                Welcome back,{" "}
                <span className="font-medium text-gray-700">
                  {producer?.businessName ||
                    producer?.name ||
                    producer?.user?.name ||
                    "Producer"}
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadDashboard}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              <button
                onClick={() => navigate("/producer/products/create")}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus size={18} />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* CRITICAL ERROR */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{error}</p>
              <button
                onClick={loadDashboard}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline flex items-center gap-1"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* PARTIAL ERROR (Non-critical) */}
        {partialError && !error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 flex items-start gap-3">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{partialError}</p>
              <button
                onClick={loadDashboard}
                className="mt-2 text-sm font-medium text-yellow-600 hover:text-yellow-700 underline flex items-center gap-1"
              >
                <RefreshCw size={14} />
                Refresh Data
              </button>
            </div>
          </div>
        )}

        {/* PRODUCER PROFILE */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <User
                size={30}
                className="text-green-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {producer?.businessName ||
                  producer?.name ||
                  producer?.user?.name ||
                  "Producer"}
              </h2>

              <p className="text-gray-500">
                {producer?.category ||
                  producer?.businessType ||
                  "Local Producer"}
              </p>

              {producer?.location && (
                <p className="text-sm text-gray-400 mt-1">
                  {producer.location}
                </p>
              )}
            </div>

            <button
              onClick={() =>
                navigate("/producer/profile")
              }
              className="ml-auto flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Edit size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* PRODUCTS */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Total Products
                </p>

                <h3 className="text-3xl font-bold mt-2">
                  {totalProducts}
                </h3>

                <p className="text-green-600 text-sm mt-2">
                  {activeProducts} active
                </p>
              </div>

              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package
                  className="text-blue-600"
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* ORDERS */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Total Orders
                </p>

                <h3 className="text-3xl font-bold mt-2">
                  {totalOrders}
                </h3>

                <p className="text-yellow-600 text-sm mt-2">
                  {pendingOrders} pending
                </p>
              </div>

              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingBag
                  className="text-purple-600"
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* REVENUE */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Total Revenue
                </p>

                <h3 className="text-3xl font-bold mt-2">
                  Rs. {totalRevenue.toLocaleString()}
                </h3>

                <p className="text-green-600 text-sm mt-2">
                  From all orders
                </p>
              </div>

              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign
                  className="text-green-600"
                  size={24}
                />
              </div>
            </div>
          </div>

          {/* PERFORMANCE */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">
                  Performance
                </p>

                <h3 className="text-3xl font-bold mt-2">
                  {totalOrders > 0 ? "Good" : "New"}
                </h3>

                <p className="text-blue-600 text-sm mt-2">
                  Keep growing
                </p>
              </div>

              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp
                  className="text-orange-600"
                  size={24}
                />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* PRODUCTS */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  My Products
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Manage your listed products
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/producer/products")
                }
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View All
              </button>
            </div>

            <div className="divide-y">
              {products.length === 0 ? (
                <div className="p-10 text-center">
                  <Package
                    size={40}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-gray-500">
                    No products found.
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        "/producer/products/create"
                      )
                    }
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
                  >
                    Create Product
                  </button>
                </div>
              ) : (
                products.slice(0, 5).map((product) => (
                  <div
                    key={product._id}
                    className="p-5 flex items-center gap-4"
                  >
                    <img
                      src={getProductImage(product)}
                      alt={getProductName(product)}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {getProductName(product)}
                      </h3>

                      <p className="text-green-600 font-medium">
                        Rs.{" "}
                        {Number(
                          getProductPrice(product)
                        ).toLocaleString()}
                      </p>

                      <p className="text-sm text-gray-400">
                        Stock:{" "}
                        {product.stock ??
                          product.quantity ??
                          0}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate(
                          `/producer/products/${product._id}`
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RECENT ORDERS */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  Recent Orders
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Latest customer orders
                </p>
              </div>

              <button
                onClick={() =>
                  navigate("/producer/orders")
                }
                className="text-green-600 hover:text-green-700 font-medium"
              >
                View All
              </button>
            </div>

            <div className="divide-y">
              {orders.length === 0 ? (
                <div className="p-10 text-center">
                  <ShoppingBag
                    size={40}
                    className="mx-auto text-gray-300"
                  />

                  <p className="mt-3 text-gray-500">
                    No orders found.
                  </p>
                </div>
              ) : (
                orders.slice(0, 5).map((order, index) => (
                  <div
                    key={order._id || index}
                    className="p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          Order #{getOrderId(order)}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {getCustomerName(order)}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>

                    <div className="flex justify-between mt-3 text-sm">
                      <span className="text-gray-500">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString()
                          : "Recent"}
                      </span>

                      <span className="font-semibold">
                        Rs.{" "}
                        {getOrderAmount(
                          order
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-8 bg-white rounded-xl border shadow-sm p-6">
          <h2 className="text-xl font-bold mb-5">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() =>
                navigate("/producer/products/create")
              }
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-green-50 hover:border-green-300 text-left"
            >
              <Plus className="text-green-600" />
              <div>
                <p className="font-semibold">
                  Add Product
                </p>
                <p className="text-sm text-gray-500">
                  List a new product
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                navigate("/producer/products")
              }
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-300 text-left"
            >
              <Package className="text-blue-600" />
              <div>
                <p className="font-semibold">
                  Manage Products
                </p>
                <p className="text-sm text-gray-500">
                  View and edit products
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                navigate("/producer/orders")
              }
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-purple-50 hover:border-purple-300 text-left"
            >
              <ShoppingBag className="text-purple-600" />
              <div>
                <p className="font-semibold">
                  Manage Orders
                </p>
                <p className="text-sm text-gray-500">
                  View customer orders
                </p>
              </div>
            </button>

            <button
              onClick={() =>
                navigate("/producer/profile")
              }
              className="flex items-center gap-3 p-4 border rounded-lg hover:bg-orange-50 hover:border-orange-300 text-left"
            >
              <User className="text-orange-600" />
              <div>
                <p className="font-semibold">
                  My Profile
                </p>
                <p className="text-sm text-gray-500">
                  Manage producer profile
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;