import { NavLink, useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "📊",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      name: "Producers",
      path: "/admin/producers",
      icon: "🧑‍🎨",
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: "📦",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "🛒",
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: "🏷️",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");

    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-gray-900 text-white">

      <div className="border-b border-gray-700 p-6">
        <h1 className="text-2xl font-bold">
          KarigarConnect
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 space-y-2 p-4">

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-white text-gray-900"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}

      </nav>

      <div className="border-t border-gray-700 p-4">

        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700"
        >
          Logout
        </button>

      </div>

    </aside>
  );
};

export default AdminSidebar;