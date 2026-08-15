import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/common/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Products from "./pages/customer/Products";
import Home from "./pages/customer/Home";
import MainLayout from "./layout/MainLayout";
import ProductDetails from "./pages/customer/ProductDetails";
import Cart from "./pages/customer/Cart";

const CustomerDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">
      Customer Dashboard
    </h1>
  </div>
);

const ProducerDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">
      Producer Dashboard
    </h1>
  </div>
);

const DeliveryDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">
      Delivery Dashboard
    </h1>
  </div>
);

const AdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">
      Admin Dashboard
    </h1>
  </div>
);

const Unauthorized = () => (
  <div className="flex min-h-screen items-center justify-center">
    <h1 className="text-2xl font-bold">
      403 - Unauthorized
    </h1>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

         
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route element={<MainLayout />}>

            {/* Home */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* Products */}
            <Route
  path="/products"
  element={<Products />}
/>

            {/* Product Details */}
           <Route
  path="/products/:id"
  element={<ProductDetails />}
/>

            {/* Cart */}
           <Route
  path="/cart"
  element={<Cart />}
/>

          </Route>

          {/* =========================
              CUSTOMER
          ========================== */}

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
          </Route>

          {/* =========================
              PRODUCER
          ========================== */}

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
          </Route>

          {/* =========================
              DELIVERY
          ========================== */}

          <Route
            element={
              <ProtectedRoute
                roles={["DELIVERY"]}
              />
            }
          >
            <Route
              path="/delivery"
              element={
                <DeliveryDashboard />
              }
            />
          </Route>

          {/* =========================
              ADMIN
          ========================== */}

          <Route
            element={
              <ProtectedRoute
                roles={["ADMIN"]}
              />
            }
          >
            <Route
              path="/admin"
              element={
                <AdminDashboard />
              }
            />
          </Route>

          {/* =========================
              UNAUTHORIZED
          ========================== */}

          <Route
            path="/unauthorized"
            element={
              <Unauthorized />
            }
          />

          {/* =========================
              404
          ========================== */}

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