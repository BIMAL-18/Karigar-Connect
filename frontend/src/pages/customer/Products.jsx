import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import productService from "../../services/productService";
import categoryService from "../../services/categoryService";

import ProductGrid from "../../components/product/ProductGrid";

const Products = () => {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [showFilters, setShowFilters] =
    useState(false);

  const [total, setTotal] =
    useState(0);

  const [pages, setPages] =
    useState(1);

  const [form, setForm] =
    useState({
      search:
        searchParams.get(
          "search"
        ) || "",

      category:
        searchParams.get(
          "category"
        ) || "",

      province:
        searchParams.get(
          "province"
        ) || "",

      district:
        searchParams.get(
          "district"
        ) || "",

      minPrice:
        searchParams.get(
          "minPrice"
        ) || "",

      maxPrice:
        searchParams.get(
          "maxPrice"
        ) || "",
    });

  const currentPage =
    Number(
      searchParams.get("page")
    ) || 1;

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  const loadCategories =
    async () => {
      try {
        const data =
          await categoryService.getCategories();

        setCategories(
          data.categories ||
            data.data ||
            data ||
            []
        );
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      }
    };

  const loadProducts =
    async () => {
      setLoading(true);

      try {
        const params = {
          page: currentPage,
          limit: 12,
        };

        const search =
          searchParams.get(
            "search"
          );

        const category =
          searchParams.get(
            "category"
          );

        const province =
          searchParams.get(
            "province"
          );

        const district =
          searchParams.get(
            "district"
          );

        const minPrice =
          searchParams.get(
            "minPrice"
          );

        const maxPrice =
          searchParams.get(
            "maxPrice"
          );

        if (search)
          params.search =
            search;

        if (category)
          params.category =
            category;

        if (province)
          params.province =
            province;

        if (district)
          params.district =
            district;

        if (minPrice)
          params.minPrice =
            minPrice;

        if (maxPrice)
          params.maxPrice =
            maxPrice;

        const data =
          await productService.getProducts(
            params
          );

        setProducts(
          data.products ||
            data.data ||
            []
        );

        setTotal(
          data.total || 0
        );

        setPages(
          data.pages || 1
        );
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const applyFilters = (e) => {
    e.preventDefault();

    const params = {};

    Object.entries(form).forEach(
      ([key, value]) => {
        if (value.trim()) {
          params[key] = value;
        }
      }
    );

    params.page = 1;

    setSearchParams(params);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setForm({
      search: "",
      category: "",
      province: "",
      district: "",
      minPrice: "",
      maxPrice: "",
    });

    setSearchParams({});
  };

  const changePage = (
    page
  ) => {
    if (
      page < 1 ||
      page > pages
    ) {
      return;
    }

    const params =
      Object.fromEntries(
        searchParams.entries()
      );

    params.page = page;

    setSearchParams(params);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Marketplace
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black">
                Discover Local Products
              </h1>

              <p className="mt-2 text-gray-500">
                Find authentic products
                from local producers
                across Nepal.
              </p>
            </div>

            <button
              onClick={() =>
                setShowFilters(
                  !showFilters
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl border bg-white px-5 py-3 font-semibold hover:bg-gray-100 md:hidden"
            >
              <Filter size={18} />

              Filters
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}

          <aside
            className={`${
              showFilters
                ? "block"
                : "hidden"
            } lg:block`}
          >
            <div className="sticky top-28 rounded-2xl border bg-white p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  Filters
                </h2>

                <button
                  onClick={
                    clearFilters
                  }
                  className="text-sm text-gray-500 hover:text-black"
                >
                  Clear
                </button>
              </div>

              <form
                onSubmit={
                  applyFilters
                }
                className="space-y-5"
              >
                {/* Search */}

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Search
                  </label>

                  <div className="flex items-center rounded-lg border px-3">
                    <Search
                      size={17}
                      className="text-gray-400"
                    />

                    <input
                      name="search"
                      value={
                        form.search
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Search..."
                      className="w-full px-2 py-3 outline-none"
                    />
                  </div>
                </div>

                {/* Category */}

                <div>
                  <label className="mb-2 block text-sm font-semibold">
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
                    className="w-full rounded-lg border px-3 py-3 outline-none"
                  >
                    <option value="">
                      All categories
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

                {/* Province */}

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Province
                  </label>

                  <input
                    name="province"
                    value={
                      form.province
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Bagmati"
                    className="w-full rounded-lg border px-3 py-3 outline-none"
                  />
                </div>

                {/* District */}

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    District
                  </label>

                  <input
                    name="district"
                    value={
                      form.district
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Kathmandu"
                    className="w-full rounded-lg border px-3 py-3 outline-none"
                  />
                </div>

                {/* Price */}

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Price Range
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={
                        form.minPrice
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Min"
                      min="0"
                      className="w-full rounded-lg border px-3 py-3 outline-none"
                    />

                    <input
                      type="number"
                      name="maxPrice"
                      value={
                        form.maxPrice
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Max"
                      min="0"
                      className="w-full rounded-lg border px-3 py-3 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          {/* Products */}

          <main>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {loading
                  ? "Loading products..."
                  : `${total} product${
                      total !== 1
                        ? "s"
                        : ""
                    } found`}
              </p>

              {(searchParams.get(
                "search"
              ) ||
                searchParams.get(
                  "category"
                ) ||
                searchParams.get(
                  "province"
                ) ||
                searchParams.get(
                  "district"
                ) ||
                searchParams.get(
                  "minPrice"
                ) ||
                searchParams.get(
                  "maxPrice"
                )) && (
                <button
                  onClick={
                    clearFilters
                  }
                  className="flex items-center gap-1 text-sm font-medium"
                >
                  <X size={15} />
                  Clear filters
                </button>
              )}
            </div>

            <ProductGrid
              products={products}
              loading={loading}
            />

            {/* Pagination */}

            {!loading &&
              pages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={() =>
                      changePage(
                        currentPage -
                          1
                      )
                    }
                    className="rounded-lg border bg-white p-3 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft
                      size={18}
                    />
                  </button>

                  {Array.from(
                    {
                      length: pages,
                    },
                    (_, index) =>
                      index + 1
                  ).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() =>
                          changePage(
                            page
                          )
                        }
                        className={`h-10 w-10 rounded-lg font-medium ${
                          page ===
                          currentPage
                            ? "bg-black text-white"
                            : "border bg-white hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    disabled={
                      currentPage ===
                      pages
                    }
                    onClick={() =>
                      changePage(
                        currentPage +
                          1
                      )
                    }
                    className="rounded-lg border bg-white p-3 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight
                      size={18}
                    />
                  </button>
                </div>
              )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;