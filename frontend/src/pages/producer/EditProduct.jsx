import {
    ArrowLeft,
    ImagePlus,
    Package,
    Save,
    X,
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    useEffect,
    useState,
} from "react";

import api from "../../services/api";

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // ==========================================
    // STATE
    // ==========================================

    const [categories, setCategories] =
        useState([]);

    const [loadingCategories, setLoadingCategories] =
        useState(true);

    const [loadingProduct, setLoadingProduct] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [images, setImages] =
        useState([]);

    const [existingImages, setExistingImages] =
        useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
    });

    // ==========================================
    // LOAD CATEGORIES
    // ==========================================

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);

            const response = await api.get(
                "/categories"
            );

            const data =
                response.data?.categories ||
                response.data?.data ||
                response.data ||
                [];

            setCategories(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (err) {
            console.error(
                "Failed to load categories:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load categories."
            );
        } finally {
            setLoadingCategories(false);
        }
    };

    // ==========================================
    // LOAD PRODUCT
    // ==========================================

    const loadProduct = async () => {
        try {
            setLoadingProduct(true);

            const response = await api.get(
                `/products/${id}`
            );

            const data = response.data?.product ||
                response.data?.data ||
                response.data;

            if (!data) {
                throw new Error("Product not found");
            }

            setForm({
                name: data.name || "",
                description: data.description || "",
                price: data.price || "",
                stock: data.stock || "",
                category: data.category || "",
            });

            // Set existing images
            if (data.images && Array.isArray(data.images)) {
                setExistingImages(data.images);
            } else if (data.image) {
                setExistingImages([data.image]);
            }
        } catch (err) {
            console.error("Failed to load product:", err);
            setError(
                err.response?.data?.message ||
                "Failed to load product."
            );
        } finally {
            setLoadingProduct(false);
        }
    };

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        loadCategories();
        loadProduct();
    }, [id]);

    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // ==========================================
    // HANDLE IMAGE
    // ==========================================

    const handleImageChange = (event) => {
        const files = Array.from(
            event.target.files || []
        );

        setImages(files);

        setError("");
    };

    // ==========================================
    // REMOVE EXISTING IMAGE
    // ==========================================

    const removeExistingImage = (index) => {
        setExistingImages((previous) =>
            previous.filter(
                (_, imageIndex) =>
                    imageIndex !== index
            )
        );
    };

    // ==========================================
    // REMOVE NEW IMAGE
    // ==========================================

    const removeImage = (index) => {
        setImages((previous) =>
            previous.filter(
                (_, imageIndex) =>
                    imageIndex !== index
            )
        );
    };

    // ==========================================
    // VALIDATION
    // ==========================================

    const validateForm = () => {
        if (!form.name.trim()) {
            return "Product name is required.";
        }

        if (!form.description.trim()) {
            return "Product description is required.";
        }

        if (!form.price) {
            return "Product price is required.";
        }

        if (
            Number(form.price) <= 0
        ) {
            return "Product price must be greater than 0.";
        }

        if (form.stock === "") {
            return "Product stock is required.";
        }

        if (
            Number(form.stock) < 0
        ) {
            return "Stock cannot be negative.";
        }

        if (!form.category) {
            return "Please select a category.";
        }

        return "";
    };

    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError =
            validateForm();

        if (validationError) {
            setError(
                validationError
            );

            return;
        }

        try {
            setSaving(true);

            const formData =
                new FormData();

            formData.append(
                "name",
                form.name.trim()
            );

            formData.append(
                "description",
                form.description.trim()
            );

            formData.append(
                "price",
                Number(form.price)
            );

            formData.append(
                "stock",
                Number(form.stock)
            );

            formData.append(
                "category",
                form.category
            );

            // Append new images only
            images.forEach(
                (image) => {
                    formData.append(
                        "images",
                        image
                    );
                }
            );

            const response =
                await api.put(
                    `/products/${id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );

            console.log(
                "Product updated:",
                response.data
            );

            setSuccess(
                response.data?.message ||
                "Product updated successfully."
            );

            setTimeout(() => {
                navigate(
                    "/producer/products"
                );
            }, 1000);
        } catch (err) {
            console.error(
                "Failed to update product:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update product."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // PAGE
    // ==========================================

    if (loadingProduct || loadingCategories) {
        return (
            <div className="min-h-screen bg-gray-50">

                <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

                    <div className="animate-pulse space-y-6">

                        <div className="h-10 w-64 rounded bg-gray-200" />

                        <div className="h-96 rounded-2xl bg-gray-200" />

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

                {/* ==================================
                    HEADER
                ================================== */}

                <div>

                    <Link
                        to="/producer/products"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
                    >
                        <ArrowLeft
                            size={17}
                        />

                        Back to Products
                    </Link>

                    <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-gray-500">
                        Producer Panel
                    </p>

                    <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                        Edit Product
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Update product details and information.
                    </p>

                </div>

                {/* ==================================
                    ERROR
                ================================== */}

                {error && (
                    <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5">

                        <p className="font-bold text-red-700">
                            Error
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                            {error}
                        </p>

                    </div>
                )}

                {/* ==================================
                    SUCCESS
                ================================== */}

                {success && (
                    <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">

                        <p className="font-bold text-green-700">
                            Success
                        </p>

                        <p className="mt-1 text-sm text-green-600">
                            {success}
                        </p>

                    </div>
                )}

                {/* ==================================
                    FORM
                ================================== */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="mt-8 space-y-6"
                >

                    {/* ==================================
                        BASIC INFORMATION
                    ================================== */}

                    <div className="rounded-2xl border bg-white p-6 sm:p-8">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                                <Package
                                    size={22}
                                />

                            </div>

                            <div>

                                <h2 className="text-xl font-black">
                                    Product Information
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Update the basic details of your product.
                                </p>

                            </div>

                        </div>

                        <div className="mt-8 grid gap-6 md:grid-cols-2">

                            {/* NAME */}

                            <div className="md:col-span-2">

                                <label className="mb-2 block text-sm font-bold">
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        form.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter product name"
                                    className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div className="md:col-span-2">

                                <label className="mb-2 block text-sm font-bold">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows={6}
                                    placeholder="Describe your product..."
                                    className="w-full resize-none rounded-xl border px-4 py-3 outline-none transition focus:border-black"
                                />

                            </div>

                            {/* PRICE */}

                            <div>

                                <label className="mb-2 block text-sm font-bold">
                                    Price
                                </label>

                                <div className="relative">

                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">
                                        Rs.
                                    </span>

                                    <input
                                        type="number"
                                        name="price"
                                        value={
                                            form.price
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="0.01"
                                        placeholder="0"
                                        className="w-full rounded-xl border py-3 pl-12 pr-4 outline-none focus:border-black"
                                    />

                                </div>

                            </div>

                            {/* STOCK */}

                            <div>

                                <label className="mb-2 block text-sm font-bold">
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    name="stock"
                                    value={
                                        form.stock
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    placeholder="0"
                                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                                />

                            </div>

                            {/* CATEGORY */}

                            <div className="md:col-span-2">

                                <label className="mb-2 block text-sm font-bold">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={
                                        form.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map(
                                        (category) => (
                                            <option
                                                key={
                                                    category._id
                                                }
                                                value={
                                                    category._id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                        </div>

                    </div>

                    {/* ==================================
                        EXISTING IMAGES
                    ================================== */}

                    {existingImages.length > 0 && (
                        <div className="rounded-2xl border bg-white p-6 sm:p-8">

                            <div className="flex items-center gap-3 mb-6">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                                    <ImagePlus
                                        size={22}
                                    />

                                </div>

                                <div>

                                    <h2 className="text-xl font-black">
                                        Current Images
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Your product's current images
                                    </p>

                                </div>

                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">

                                {existingImages.map(
                                    (image, index) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="relative group"
                                        >

                                            <img
                                                src={
                                                    image
                                                }
                                                alt={
                                                    `Product ${index}`
                                                }
                                                className="h-40 w-full rounded-xl object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeExistingImage(
                                                        index
                                                    )
                                                }
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                                            >

                                                <X size={16} />

                                            </button>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>
                    )}

                    {/* ==================================
                        UPLOAD IMAGES
                    ================================== */}

                    <div className="rounded-2xl border bg-white p-6 sm:p-8">

                        <div className="flex items-center gap-3 mb-6">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">

                                <ImagePlus
                                    size={22}
                                />

                            </div>

                            <div>

                                <h2 className="text-xl font-black">
                                    {images.length > 0
                                        ? "New Images"
                                        : "Product Images"}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {images.length > 0
                                        ? `You've selected ${images.length} image(s)`
                                        : "Upload new product images"}
                                </p>

                            </div>

                        </div>

                        {images.length === 0 ? (
                            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 transition hover:border-gray-400">

                                <ImagePlus
                                    size={32}
                                    className="text-gray-400"
                                />

                                <div className="text-center">

                                    <p className="font-bold">
                                        Drop files or click
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        PNG, JPG, GIF (max 10MB)
                                    </p>

                                </div>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={
                                        handleImageChange
                                    }
                                    className="hidden"
                                />

                            </label>
                        ) : (
                            <div className="space-y-4">

                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">

                                    {images.map(
                                        (image, index) => (
                                            <div
                                                key={
                                                    index
                                                }
                                                className="relative group"
                                            >

                                                <img
                                                    src={
                                                        URL.createObjectURL(
                                                            image
                                                        )
                                                    }
                                                    alt={
                                                        `Preview ${index}`
                                                    }
                                                    className="h-40 w-full rounded-xl object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeImage(
                                                            index
                                                        )
                                                    }
                                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                                                >

                                                    <X size={16} />

                                                </button>

                                            </div>
                                        )
                                    )}

                                </div>

                                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50">

                                    <Plus size={18} />

                                    <span className="text-sm font-medium">
                                        Add More Images
                                    </span>

                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={
                                            handleImageChange
                                        }
                                        className="hidden"
                                    />

                                </label>

                            </div>
                        )}

                    </div>

                    {/* ==================================
                        ACTIONS
                    ================================== */}

                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/producer/products"
                                )
                            }
                            className="flex-1 rounded-xl border px-6 py-3 font-bold transition hover:bg-gray-100"
                        >

                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3 font-bold text-white transition hover:bg-gray-900 disabled:opacity-50"
                        >

                            <Save size={18} />

                            {saving
                                ? "Saving..."
                                : "Save Changes"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default EditProduct;
