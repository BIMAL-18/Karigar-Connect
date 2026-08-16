import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../../services/producerService";
import api from "../../services/api";

const CreateProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    province: "",
    district: "",
    municipality: "",
    ward: "",
    originAddress: "",
    materials: "",
    tags: "",
    productionMethod: "",
  });

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET CATEGORIES
  // ==========================================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);

        const response = await api.get("/categories");

        console.log("Categories:", response.data);

        // Supports different possible backend response formats
        const categoryData =
          response.data?.categories ||
          response.data?.data ||
          response.data ||
          [];

        setCategories(
          Array.isArray(categoryData) ? categoryData : []
        );
      } catch (error) {
        console.error(
          "Error fetching categories:",
          error.response?.data || error.message
        );

        setError("Unable to load categories.");
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // HANDLE IMAGE
  // ==========================================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic frontend validation
    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Product description is required.");
      return;
    }

    if (!formData.price || Number(formData.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.stock || Number(formData.stock) < 0) {
      setError("Please enter a valid stock quantity.");
      return;
    }

    if (!formData.province.trim()) {
      setError("Province is required.");
      return;
    }

    if (!formData.district.trim()) {
      setError("District is required.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // Required fields
      data.append("name", formData.name.trim());
      data.append("description", formData.description.trim());
      data.append("price", Number(formData.price));
      data.append("category", formData.category);
      data.append("stock", Number(formData.stock));

      // Required location fields
      data.append("province", formData.province.trim());
      data.append("district", formData.district.trim());

      // Optional location fields
      if (formData.municipality.trim()) {
        data.append(
          "municipality",
          formData.municipality.trim()
        );
      }

      if (formData.ward.trim()) {
        data.append("ward", formData.ward.trim());
      }

      if (formData.originAddress.trim()) {
        data.append(
          "originAddress",
          formData.originAddress.trim()
        );
      }

      // Optional materials
      if (formData.materials.trim()) {
        const materials = formData.materials
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        materials.forEach((material) => {
          data.append("materials", material);
        });
      }

      // Optional tags
      if (formData.tags.trim()) {
        const tags = formData.tags
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        tags.forEach((tag) => {
          data.append("tags", tag);
        });
      }

      // Optional production method
      if (formData.productionMethod.trim()) {
        data.append(
          "productionMethod",
          formData.productionMethod.trim()
        );
      }

      // Image
      if (image) {
        data.append("image", image);
      }

      // Debug FormData
      console.log("========== PRODUCT DATA ==========");

      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }

      console.log("==================================");

      await addProduct(data);

      alert("Product added successfully!");

      navigate("/producer/products");
    } catch (error) {
      console.error("Add product error:", error);

      const backendError = error.response?.data;

      console.error("Backend response:", backendError);

      // Handle validation errors
      if (Array.isArray(backendError?.errors)) {
        const messages = backendError.errors
          .map((err) => {
            if (typeof err === "string") {
              return err;
            }

            return (
              err.message ||
              err.msg ||
              `${err.path || err.field || "Field"} is invalid`
            );
          })
          .join(" ");

        setError(messages);
      } else {
        setError(
          backendError?.message ||
            "Failed to add product. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-8 shadow">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Add New Product
          </h1>

          <p className="mt-1 text-gray-500">
            Add your local product to Karigar Connect.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-medium">Error</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ================= PRODUCT INFORMATION ================= */}

          <div>
            <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
              Product Information
            </h2>

            {/* PRODUCT NAME */}
            <div className="mb-4">
              <label className="mb-1 block font-medium text-gray-700">
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Traditional Nepali Dhaka Topi"
                required
                maxLength={200}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-4">
              <label className="mb-1 block font-medium text-gray-700">
                Description *
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product..."
                rows={5}
                maxLength={3000}
                required
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
              />

              <p className="mt-1 text-right text-xs text-gray-500">
                {formData.description.length}/3000
              </p>
            </div>

            {/* PRICE + STOCK */}
            <div className="grid gap-4 md:grid-cols-2">

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Price (NPR) *
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Stock *
                </label>

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  min="0"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                />
              </div>

            </div>

            {/* CATEGORY */}
            <div className="mt-4">
              <label className="mb-1 block font-medium text-gray-700">
                Category *
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                // required
                disabled={categoryLoading}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-black"
              >
                <option value="">
                  {categoryLoading
                    ? "Loading categories..."
                    : "Select Category"}
                </option>

                {categories.map((category) => (
                  <option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              {!categoryLoading &&
                categories.length === 0 && (
                  <p className="mt-1 text-sm text-red-500">
                    No categories found. Please create categories
                    from the admin panel.
                  </p>
                )}
            </div>
          </div>

          {/* ================= LOCATION ================= */}

          <div>
            <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
              Product Origin
            </h2>

            <div className="grid gap-4 md:grid-cols-2">

              {/* PROVINCE */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Province *
                </label>

                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  placeholder="e.g. Lumbini Province"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                />
              </div>

              {/* DISTRICT */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  District *
                </label>

                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="e.g. Gulmi"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                />
              </div>

              {/* MUNICIPALITY */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Municipality
                </label>

                <input
                  type="text"
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleChange}
                  placeholder="e.g. Resunga Municipality"
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                />
              </div>

              {/* WARD */}
              <div>
                <label className="mb-1 block font-medium text-gray-700">
                  Ward
                </label>

                <input
                  type="text"
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
                />
              </div>

            </div>

            {/* ADDRESS */}
            <div className="mt-4">
              <label className="mb-1 block font-medium text-gray-700">
                Origin Address
              </label>

              <input
                type="text"
                name="originAddress"
                value={formData.originAddress}
                onChange={handleChange}
                placeholder="Enter detailed origin address"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
              />
            </div>
          </div>

          {/* ================= PRODUCT DETAILS ================= */}

          <div>
            <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
              Additional Details
            </h2>

            {/* MATERIALS */}
            <div className="mb-4">
              <label className="mb-1 block font-medium text-gray-700">
                Materials
              </label>

              <input
                type="text"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                placeholder="e.g. Cotton, Wool, Wood"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
              />

              <p className="mt-1 text-xs text-gray-500">
                Separate multiple materials with commas.
              </p>
            </div>

            {/* TAGS */}
            <div className="mb-4">
              <label className="mb-1 block font-medium text-gray-700">
                Tags
              </label>

              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. handmade, nepali, traditional"
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
              />

              <p className="mt-1 text-xs text-gray-500">
                Separate tags with commas.
              </p>
            </div>

            {/* PRODUCTION METHOD */}
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Production Method
              </label>

              <textarea
                name="productionMethod"
                value={formData.productionMethod}
                onChange={handleChange}
                placeholder="Describe how the product is made..."
                rows={4}
                maxLength={1000}
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
              />
            </div>
          </div>

          {/* ================= IMAGE ================= */}

          <div>
            <h2 className="mb-4 border-b pb-2 text-xl font-semibold">
              Product Image
            </h2>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full rounded-lg border border-gray-300 p-3"
            />

            {image && (
              <div className="mt-3 rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-medium">
                  Selected image:
                </p>

                <p className="text-sm text-gray-600">
                  {image.name}
                </p>
              </div>
            )}
          </div>

          {/* ================= BUTTONS ================= */}

          <div className="flex gap-3 border-t pt-6">

            <button
              type="button"
              onClick={() =>
                navigate("/producer/products")
              }
              disabled={loading}
              className="rounded-lg bg-gray-500 px-6 py-3 font-medium text-white hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                categoryLoading ||
                categories.length === 0
              }
              className="rounded-lg bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;