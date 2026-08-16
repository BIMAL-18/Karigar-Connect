import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
  getAllProducts,
  approveProduct,
  rejectProduct,
  deleteProduct,
} from "../../services/adminService";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();

      setProducts(
        response?.data?.products ||
          response?.data ||
          response?.products ||
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
      await approveProduct(id);

      alert("Product approved successfully.");

      fetchProducts();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to approve product."
      );
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt(
      "Enter rejection reason:"
    );

    if (!reason) return;

    try {
      await rejectProduct(id, reason);

      alert("Product rejected.");

      fetchProducts();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to reject product."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    try {
      await deleteProduct(id);

      fetchProducts();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete product."
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
            Products
          </h1>

          <div className="overflow-x-auto rounded-xl bg-white shadow">

            {loading ? (
              <p className="p-6">
                Loading products...
              </p>
            ) : (
              <table className="w-full">

                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">
                      Product
                    </th>
                    <th className="p-4 text-left">
                      Producer
                    </th>
                    <th className="p-4 text-left">
                      Price
                    </th>
                    <th className="p-4 text-left">
                      Stock
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

                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-t"
                    >

                      <td className="p-4">
                        {product.name}
                      </td>

                      <td className="p-4">
                        {product.producer?.name ||
                          "N/A"}
                      </td>

                      <td className="p-4">
                        Rs. {product.price}
                      </td>

                      <td className="p-4">
                        {product.stock}
                      </td>

                      <td className="p-4">
                        {product.verificationStatus}
                      </td>

                      <td className="flex gap-2 p-4">

                        <button
                          onClick={() =>
                            handleApprove(
                              product._id
                            )
                          }
                          className="rounded bg-green-600 px-3 py-2 text-sm text-white"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleReject(
                              product._id
                            )
                          }
                          className="rounded bg-yellow-600 px-3 py-2 text-sm text-white"
                        >
                          Reject
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              product._id
                            )
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

export default AdminProducts;