import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/adminService";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();

      setOrders(
        response?.data?.orders ||
          response?.data ||
          response?.orders ||
          []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      await updateOrderStatus(orderId, status);

      fetchOrders();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update order."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminSidebar />

      <div className="ml-64">

        <AdminNavbar />

        <main className="p-6">

          <h1 className="mb-6 text-3xl font-bold">
            Orders
          </h1>

          <div className="overflow-x-auto rounded-xl bg-white shadow">

            {loading ? (
              <p className="p-6">
                Loading orders...
              </p>
            ) : (
              <table className="w-full">

                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">
                      Order ID
                    </th>
                    <th className="p-4 text-left">
                      Customer
                    </th>
                    <th className="p-4 text-left">
                      Total
                    </th>
                    <th className="p-4 text-left">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t"
                    >

                      <td className="p-4">
                        {order._id}
                      </td>

                      <td className="p-4">
                        {order.user?.name ||
                          order.customer?.name ||
                          "N/A"}
                      </td>

                      <td className="p-4">
                        Rs.{" "}
                        {order.totalAmount ||
                          order.total ||
                          0}
                      </td>

                      <td className="p-4">

                        <select
                          value={
                            order.status || "PENDING"
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              e.target.value
                            )
                          }
                          className="rounded border p-2"
                        >
                          <option value="PENDING">
                            Pending
                          </option>

                          <option value="CONFIRMED">
                            Confirmed
                          </option>

                          <option value="PROCESSING">
                            Processing
                          </option>

                          <option value="SHIPPED">
                            Shipped
                          </option>

                          <option value="DELIVERED">
                            Delivered
                          </option>

                          <option value="CANCELLED">
                            Cancelled
                          </option>
                        </select>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
            )}

          </div>

        </main>

      </div>

    </div>
  );
};

export default AdminOrders;