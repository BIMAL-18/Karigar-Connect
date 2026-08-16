import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminStatsCard from "./AdminStatsCard";
import { getAdminDashboard } from "../../services/adminService";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const data = await getAdminDashboard();

      setDashboard(data?.data || data || {});
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminSidebar />

      <div className="ml-64">

        <AdminNavbar />

        <main className="p-6">

          <h1 className="mb-6 text-3xl font-bold">
            Dashboard
          </h1>

          {error && (
            <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center">
              Loading dashboard...
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

              <AdminStatsCard
                title="Total Users"
                value={
                  dashboard.totalUsers ||
                  dashboard.users ||
                  0
                }
                icon="👥"
              />

              <AdminStatsCard
                title="Total Producers"
                value={
                  dashboard.totalProducers ||
                  dashboard.producers ||
                  0
                }
                icon="🧑‍🎨"
              />

              <AdminStatsCard
                title="Total Products"
                value={
                  dashboard.totalProducts ||
                  dashboard.products ||
                  0
                }
                icon="📦"
              />

              <AdminStatsCard
                title="Total Orders"
                value={
                  dashboard.totalOrders ||
                  dashboard.orders ||
                  0
                }
                icon="🛒"
              />

            </div>
          )}

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">
                Pending Products
              </h2>

              <p className="mt-3 text-4xl font-bold">
                {dashboard.pendingProducts || 0}
              </p>

              <p className="mt-2 text-gray-500">
                Products waiting for verification
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">
                Pending Producers
              </h2>

              <p className="mt-3 text-4xl font-bold">
                {dashboard.pendingProducers || 0}
              </p>

              <p className="mt-2 text-gray-500">
                Producer applications waiting for approval
              </p>
            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default AdminDashboard;