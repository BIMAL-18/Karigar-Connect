import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const {
    user,
    logout,
    isAuthenticated,
  } = useAuth();

  const navigate =
    useNavigate();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [cartCount, setCartCount] =
    useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart =
        JSON.parse(
          localStorage.getItem(
            "cart"
          ) || "[]"
        );

      const count =
        cart.reduce(
          (total, item) =>
            total +
            Number(item.quantity || 0),
          0
        );

      setCartCount(count);
    };

    updateCartCount();

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        search
      )}`
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="shrink-0 text-2xl font-black tracking-tight"
        >
          Karigar
          <span className="text-gray-500">
            Connect
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden max-w-xl flex-1 md:flex"
        >
          <div className="flex w-full items-center rounded-xl border bg-gray-50 px-4">
            <Search
              size={19}
              className="text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search local products..."
              className="w-full bg-transparent px-3 py-3 outline-none"
            />
          </div>
        </form>

        <nav className="ml-auto hidden items-center gap-5 md:flex">
          <Link
            to="/products"
            className="font-medium hover:text-gray-500"
          >
            Products
          </Link>

          <Link
            to="/cart"
            className="relative"
          >
            <ShoppingCart size={22} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={
                  user?.role ===
                  "PRODUCER"
                    ? "/producer"
                    : user?.role ===
                      "DELIVERY"
                    ? "/delivery"
                    : user?.role ===
                      "ADMIN"
                    ? "/admin"
                    : "/customer"
                }
                className="flex items-center gap-2"
              >
                <User size={20} />

                <span>
                  {user?.name ||
                    "Account"}
                </span>
              </Link>

              <button
                onClick={
                  handleLogout
                }
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-black px-5 py-2.5 font-semibold text-white hover:bg-gray-800"
            >
              Login
            </Link>
          )}
        </nav>

        <button
          onClick={() =>
            setMobileOpen(
              !mobileOpen
            )
          }
          className="ml-auto md:hidden"
        >
          {mobileOpen ? (
            <X />
          ) : (
            <Menu />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-white p-4 md:hidden">
          <form
            onSubmit={handleSearch}
            className="mb-4 flex items-center rounded-xl border bg-gray-50 px-3"
          >
            <Search
              size={18}
              className="text-gray-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search products..."
              className="w-full bg-transparent px-3 py-3 outline-none"
            />
          </form>

          <div className="flex flex-col gap-4">
            <Link
              to="/"
              onClick={() =>
                setMobileOpen(
                  false
                )
              }
            >
              Home
            </Link>

            <Link
              to="/products"
              onClick={() =>
                setMobileOpen(
                  false
                )
              }
            >
              Products
            </Link>

            <Link
              to="/cart"
              onClick={() =>
                setMobileOpen(
                  false
                )
              }
            >
              Cart
              {cartCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className="rounded-lg bg-black px-4 py-3 text-center font-semibold text-white"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
