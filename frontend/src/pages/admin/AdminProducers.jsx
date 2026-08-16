import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
  getAllProducers,
  approveProducer,
  rejectProducer,
} from "../../services/adminService";

const AdminProducers = () => {
  const [producers, setProducers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducers();
  }, []);

  const fetchProducers = async () => {
    try {
      const response = await getAllProducers();

      setProducers(
        response?.data?.producers ||
          response?.data ||
          response?.producers ||
          []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveProducer(id);

      alert("Producer approved successfully.");

      fetchProducers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to approve producer."
      );
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt(
      "Enter rejection reason:"
    );

    if (!reason) return;

    try {
      await rejectProducer(id, reason);

      alert("Producer rejected.");

      fetchProducers();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to reject producer."
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
            Producers
          </h1>

          <div className="overflow-x-auto rounded-xl bg-white shadow">

            {loading ? (
              <p className="p-6">
                Loading producers...
              </p>
            ) : (
              <table className="w-full">

                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">
                      Producer
                    </th>
                    <th className="p-4 text-left">
                      Email
                    </th>
                    <th className="p-4 text-left">
                      Status
                    </th>
                    <th className="p-4 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {producers.map((producer) => (
                    <tr
                      key={producer._id}
                      className="border-t"
                    >

                      <td className="p-4 font-medium">
                        {producer.name ||
                          producer.user?.name ||
                          "N/A"}
                      </td>

                      <td className="p-4">
                        {producer.email ||
                          producer.user?.email ||
                          "N/A"}
                      </td>

                      <td className="p-4">
                        {producer.verificationStatus ||
                          producer.status ||
                          "PENDING"}
                      </td>

                      <td className="flex gap-2 p-4">

                        <button
                          onClick={() =>
                            handleApprove(
                              producer._id
                            )
                          }
                          className="rounded bg-green-600 px-3 py-2 text-white"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleReject(
                              producer._id
                            )
                          }
                          className="rounded bg-red-600 px-3 py-2 text-white"
                        >
                          Reject
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

export default AdminProducers;