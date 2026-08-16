import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
  getAllUsers,
  updateUserStatus,
  deleteUser,
} from "../../services/adminService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();

      setUsers(
        response?.data?.users ||
          response?.data ||
          response?.users ||
          []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (user) => {
    try {
      await updateUserStatus(
        user._id,
        !user.isActive
      );

      fetchUsers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update user."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);

      fetchUsers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete user."
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
            Users
          </h1>

          <div className="overflow-x-auto rounded-xl bg-white shadow">

            {loading ? (
              <p className="p-6">Loading users...</p>
            ) : (
              <table className="w-full">

                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Role</th>
                    <th className="p-4 text-left">Status</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t"
                    >

                      <td className="p-4">
                        {user.name}
                      </td>

                      <td className="p-4">
                        {user.email}
                      </td>

                      <td className="p-4 capitalize">
                        {user.role}
                      </td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm ${
                            user.isActive !== false
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.isActive !== false
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="flex gap-2 p-4">

                        <button
                          onClick={() =>
                            handleStatus(user)
                          }
                          className="rounded bg-blue-600 px-3 py-2 text-sm text-white"
                        >
                          {user.isActive !== false
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(user._id)
                          }
                          className="rounded bg-red-600 px-3 py-2 text-sm text-white"
                        >
                          Delete
                        </button>

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

export default AdminUsers;