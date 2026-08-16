import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  MapPin,
  Package,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import productService from "../../services/productService";

const Products = () => {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [province, setProvince] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(1);

  const [showFilters, setShowFilters] =
    useState(false);


  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: 12,
      };

      if (search.trim()) {
        params.search =
          search.trim();
      }

      if (category) {
        params.category =
          category;
      }

      if (province) {
        params.province =
          province;
      }

      const response =
        await productService.getProducts(
          params
        );

      const data =
        response.data || response;

      setProducts(
        data.products || []
      );

      setPages(
        data.pages || 1
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data
          ?.message ||
          "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadProducts();
  }, [
    page,
    category,
    province,
  ]);


  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    loadProducts();
  };


  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setProvince("");
    setPage(1);
  };


  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="text-center">

          <Package
            size={45}
            className="mx-auto text-gray-400"
          />

          <h1 className="mt-4 text-2xl font-black">
            Unable to Load Products
          </h1>

          <p className="mt-2 text-gray-500">
            {error}
          </p>

          <button
            onClick={loadProducts}
            className="mt-6 rounded-xl bg-black px-5 py-3 font-semibold text-white"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Karigar Connect
            </p>

            <h1 className="mt-1 text-4xl font-black">
              Explore Products
            </h1>

            <p className="mt-2 text-gray-500">
              Discover handmade products
              from local Nepali producers.
            </p>
          </div>


          <Link
            to="/cart"
            className="flex w-fit items-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white"
          >
            <ShoppingCart size={18} />
            Cart
          </Link>

        </div>


        {/* Search */}

        <form
          onSubmit={handleSearch}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >

          <div className="relative flex-1">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search handmade products..."
              className="w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 outline-none focus:border-black"
            />

          </div>


          <button
            type="submit"
            className="rounded-xl bg-black px-7 py-3 font-semibold text-white"
          >
            Search
          </button>


          <button
            type="button"
            onClick={() =>
              setShowFilters(
                !showFilters
              )
            }
            className="flex items-center justify-center gap-2 rounded-xl border bg-white px-5 py-3 font-semibold"
          >
            <SlidersHorizontal
              size={18}
            />
            Filters
          </button>

        </form>


        {/* Filters */}

        {showFilters && (
          <div className="mt-5 rounded-2xl border bg-white p-5">

            <div className="grid gap-4 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) => {
                    setCategory(
                      e.target.value
                    );
                    setPage(1);
                  }}
                  placeholder="Category ID"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                />
              </div>


              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Province
                </label>

                <select
                  value={province}
                  onChange={(e) => {
                    setProvince(
                      e.target.value
                    );
                    setPage(1);
                  }}
                  className="w-full rounded-xl border bg-white px-4 py-3 outline-none focus:border-black"
                >
                  <option value="">
                    All Provinces
                  </option>

                  <option value="Bagmati">
                    Bagmati
                  </option>

                  <option value="Gandaki">
                    Gandaki
                  </option>

                  <option value="Lumbini">
                    Lumbini
                  </option>

                  <option value="Koshi">
                    Koshi
                  </option>

                  <option value="Madhesh">
                    Madhesh
                  </option>

                  <option value="Karnali">
                    Karnali
                  </option>

                  <option value="Sudurpashchim">
                    Sudurpashchim
                  </option>
                </select>
              </div>


              <div className="flex items-end">
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="w-full rounded-xl border px-4 py-3 font-semibold hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>

            </div>

          </div>
        )}


        {/* Products */}

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {Array.from({
              length: 8,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className="animate-pulse overflow-hidden rounded-2xl border bg-white"
                >
                  <div className="h-56 bg-gray-200" />

                  <div className="space-y-3 p-5">
                    <div className="h-5 rounded bg-gray-200" />

                    <div className="h-4 w-2/3 rounded bg-gray-200" />

                    <div className="h-6 w-1/3 rounded bg-gray-200" />
                  </div>
                </div>
              )
            )}

          </div>
        ) : products.length === 0 ? (

          <div className="mt-12 rounded-2xl border bg-white py-20 text-center">

            <Package
              size={45}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-5 text-2xl font-black">
              No Products Found
            </h2>

            <p className="mt-2 text-gray-500">
              Try another search or
              change your filters.
            </p>

          </div>

        ) : (

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {products.map(
              (product) => {

                const image =
                  product.images?.[0];

                return (
                  <Link
                    key={
                      product._id
                    }
                    to={`/products/${product._id}`}
                    className="group overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* Image */}

                    <div className="relative h-56 overflow-hidden bg-gray-100">

                      {image ? (
                        <img
                          src={image}
                          alt={
                            product.name
                          }
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package
                            size={45}
                            className="text-gray-300"
                          />
                        </div>
                      )}

                    </div>


                    {/* Content */}

                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <h2 className="line-clamp-2 text-lg font-bold">
                          {product.name}
                        </h2>

                        <span className="shrink-0 text-lg font-black">
                          Rs.{" "}
                          {Number(
                            product.price ||
                              0
                          ).toLocaleString()}
                        </span>

                      </div>


                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {product.description}
                      </p>


                      <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">

                        <MapPin
                          size={14}
                        />

                        <span>
                          {product.district ||
                            "Nepal"}
                          {product.province &&
                            `, ${product.province}`}
                        </span>

                      </div>


                      <div className="mt-4 flex items-center justify-between border-t pt-4">

                        <span className="text-sm font-medium text-gray-500">
                          {product.stock >
                          0
                            ? `${product.stock} available`
                            : "Out of stock"}
                        </span>

                        <span className="text-sm font-bold">
                          View Product →
                        </span>

                      </div>

                    </div>

                  </Link>
                );
              }
            )}

          </div>
        )}


        {/* Pagination */}

        {!loading &&
          products.length > 0 &&
          pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">

              <button
                disabled={
                  page === 1
                }
                onClick={() =>
                  setPage(
                    page - 1
                  )
                }
                className="rounded-xl border bg-white px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>


              <span className="px-4 text-sm font-semibold">
                Page {page} of{" "}
                {pages}
              </span>


              <button
                disabled={
                  page === pages
                }
                onClick={() =>
                  setPage(
                    page + 1
                  )
                }
                className="rounded-xl border bg-white px-4 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>
          )}

      </div>

    </div>
  );
};

export default Products;