import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../services/producerService";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        image: formData.image,
      };

      await addProduct(productData);

      setSuccess("Product added successfully!");

      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        image: "",
      });

      setTimeout(() => {
        navigate("/producer/products");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-bold">
          Add New Product
        </h1>

        <p className="mb-6 text-gray-500">
          Add your product to Karigar-Connect marketplace.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Product Name */}
          <div>
            <label className="mb-1 block font-medium">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product"
              rows="4"
              required
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label className="mb-1 block font-medium">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                required
                className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                min="0"
                required
                className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block font-medium">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-lg border p-3"
            >
              <option value="">Select Category</option>
              <option value="Handicrafts">Handicrafts</option>
              <option value="Clothing">Clothing</option>
              <option value="Food">Food</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Home Decor">Home Decor</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Image */}
          <div>
            <label className="mb-1 block font-medium">
              Product Image URL
            </label>

            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddProduct;