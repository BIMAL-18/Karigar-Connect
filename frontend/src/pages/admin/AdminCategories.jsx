import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/adminService";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();

      setCategories(
        response?.data?.categories ||
          response?.data ||
          response?.categories ||
          []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    try {
      await createCategory({
        name: name.trim(),
      });

      setName("");

      fetchCategories();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create category."
      );
    }
  };

  const handleEdit = async (category) => {
    const newName = window.prompt(
      "Enter new category name:",
      category.name
    );

    if (!newName || !newName.trim()) {
      return;
    }

    try {
      await updateCategory(category._id, {
        name: newName.trim(),
      });

      fetchCategories();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update category."
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) {
      return;
    }

    try {
      await deleteCategory(id);

      fetchCategories();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete category."
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
            Categories
          </h1>

          <div className="mb-6 rounded-xl bg-white p-6 shadow">

            <h2 className="mb-4 text-xl font-semibold">
              Add Category
            </h2>

            <form
              onSubmit={handleCreate}
              className="flex gap-3"
            >

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Category name"
                className="flex-1 rounded-lg border p-3"
              />

              <button
                type="submit"
                className="rounded-lg bg-gray-900 px-6 py-3 text-white"
              >
                Add
              </button>

            </form>

          </div>

          <div className="rounded-xl bg-white shadow">

            {loading ? (
              <p className="p-6">
                Loading categories...
              </p>
            ) : (
              <div className="divide-y">

                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between p-5"
                  >

                    <div>
                      <h3 className="font-semibold">
                        {category.name}
                      </h3>
                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleEdit(category)
                        }
                        className="rounded bg-blue-600 px-4 py-2 text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(category._id)
                        }
                        className="rounded bg-red-600 px-4 py-2 text-white"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </main>

      </div>

    </div>
  );
};

export default AdminCategories;