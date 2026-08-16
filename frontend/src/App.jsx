import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";

// ==========================================
// Authentication
// ==========================================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ==========================================
// Layout
// ==========================================

import MainLayout from "./layout/MainLayout";

// ==========================================
// Customer Pages
// ==========================================

import Home from "./pages/customer/Home";
import Products from "./pages/customer/Products";
import ProductDetails from "./pages/customer/ProductDetails";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Orders from "./pages/customer/Orders";
import OrderDetails from "./pages/customer/OrderDetails";
import DeliveryTracking from "./pages/customer/DeliveryTracking";

// ==========================================
// Delivery Pages
// ==========================================

import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import DeliveryAssignment from "./pages/delivery/DeliveryAssignment";
import DeliveryRoute from "./pages/delivery/DeliveryRoute";
import DeliveryQR from "./pages/delivery/DeliveryQR";
import DeliveryLiveLocation
    from "./pages/delivery/DeliveryLiveLocation";

import TrackDelivery
    from "./pages/orders/TrackDelivery";
import ProducerDashboard from "./pages/producer/ProducerDashboard";
import ProducerProfile from "./pages/producer/ProducerProfile";
import ProducerProducts from "./pages/producer/ProducerProducts";
import CreateProduct from "./pages/producer/CreateProduct";
import EditProduct from "./pages/producer/EditProduct";
import ProducerOrders from "./pages/producer/ProducerOrders";
import ProducerOrderDetails from "./pages/producer/ProducerOrderDetails";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducers from "./pages/admin/AdminProducers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCategories from "./pages/admin/AdminCategories";
// import AddProduct from "./pages/producer/AddProduct";

// ==========================================
// Customer Dashboard
// ==========================================

const CustomerDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Customer Dashboard
      </h1>
    </div>
  );
};
// ==========================================
// Unauthorized
// ==========================================

const Unauthorized = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-black">
          403
        </h1>

        <p className="mt-3 text-2xl font-bold">
          Unauthorized
        </p>

        <p className="mt-2 text-gray-500">
          You do not have permission to access
          this page.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// App
// ==========================================

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>

        <Routes>

          {/* =================================
              AUTHENTICATION
          ================================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* =================================
              MAIN LAYOUT
          ================================= */}

          <Route element={<MainLayout />}>

            {/* =================================
                PUBLIC
            ================================= */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />

            {/* =================================
                CUSTOMER
            ================================= */}

            <Route
              element={
                <ProtectedRoute
                  roles={["CUSTOMER"]}
                />
              }
            >

              <Route
                path="/customer"
                element={
                  <CustomerDashboard />
                }
              />

              <Route
                path="/cart"
                element={<Cart />}
              />

              <Route
                path="/checkout"
                element={<Checkout />}
              />

              <Route
                path="/orders"
                element={<Orders />}
              />

              <Route
                path="/orders/:id"
                element={<OrderDetails />}
              />

              <Route
                path="/orders/:id/tracking"
                element={
                  <DeliveryTracking />
                }
              />

            </Route>

            {/* =================================
                PRODUCER
            ================================= */}

            <Route
              element={
                <ProtectedRoute
                  roles={["PRODUCER"]}
                />
              }
            >

              <Route
                path="/producer"
                element={
                  <ProducerDashboard />
                }
              />
              <Route
    path="/producer/profile"
    element={
        <ProtectedRoute allowedRoles={["PRODUCER"]}>
            <ProducerProfile />
        </ProtectedRoute>
    }
/>
<Route
    path="/producer/products"
    element={
        <ProtectedRoute allowedRoles={["PRODUCER"]}>
            <ProducerProducts />
        </ProtectedRoute>
    }
/>
<Route
  path="/producer/products/create"
  element={<CreateProduct />}
/>
<Route
    path="/producer/products/:id/edit"
    element={
        <ProtectedRoute allowedRoles={["PRODUCER"]}>
            <EditProduct />
        </ProtectedRoute>
    }
/>


{/* <Route
  path="/producer/add-product"
  element={<AddProduct />}
/> */}
<Route
    path="/producer/orders"
    element={
        <ProtectedRoute allowedRoles={["PRODUCER"]}>
            <ProducerOrders />
        </ProtectedRoute>
    }
/>
<Route
    path="/producer/orders/:id"
    element={
        <ProtectedRoute allowedRoles={["PRODUCER"]}>
            <ProducerOrderDetails />
        </ProtectedRoute>
    }
/>
            </Route>

            {/* =================================
                DELIVERY PERSON
            ================================= */}

            <Route
              element={
                <ProtectedRoute
                  roles={["DELIVERY"]}
                />
              }
            >

              {/* Delivery Dashboard */}

              <Route
                path="/delivery"
                element={
                  <DeliveryDashboard />
                }
              />

              {/* Assignment Details */}
              <Route
  path="/delivery/assignments/:id"
  element={<DeliveryAssignment />}
/>
<Route
    path="/delivery/routes"
    element={<DeliveryRoute />}
  />
 <Route
    path="/delivery/qr"
    element={<DeliveryQR />}
  />
  <Route
    path="/delivery/live-location"
    element={
        <DeliveryLiveLocation />
    }
/>
<Route
    path="/orders/:assignmentId/track"
    element={
        <TrackDelivery />
    }
/>

             
            </Route>

            {/* =================================
                ADMIN
            ================================= */}

            <Route path="/admin" element={<AdminDashboard />} />

<Route
  path="/admin/users"
  element={<AdminUsers />}
/>

<Route
  path="/admin/producers"
  element={<AdminProducers />}
/>

<Route
  path="/admin/products"
  element={<AdminProducts />}
/>

<Route
  path="/admin/orders"
  element={<AdminOrders />}
/>

<Route
  path="/admin/categories"
  element={<AdminCategories />}
/>
          </Route>

          {/* =================================
              UNAUTHORIZED
          ================================= */}

          <Route
            path="/unauthorized"
            element={
              <Unauthorized />
            }
          />

          {/* =================================
              404
          ================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;