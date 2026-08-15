import {
  ArrowRight,
  MapPin,
  Search,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import productService from "../../services/productService";
import categoryService from "../../services/categoryService";

import ProductGrid from "../../components/product/ProductGrid";

const Home = () => {
  const navigate =
    useNavigate();

  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          productData,
          categoryData,
        ] = await Promise.all([
          productService.getProducts({
            page: 1,
            limit: 8,
          }),
          categoryService.getCategories(),
        ]);

        setProducts(
          productData.products ||
            productData.data ||
            []
        );

        setCategories(
          categoryData.categories ||
            categoryData.data ||
            categoryData ||
            []
        );
      } catch (error) {
        console.error(
          "Failed to load marketplace:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        search
      )}`
    );
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white">
        <div className="mx-auto grid min-h-[600px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-gray-300">
              <MapPin size={16} />
              Supporting local Nepal
            </div>

            <h1 className="text-5xl font-black leading-tight sm:text-6xl">
              Discover
              <br />
              <span className="text-gray-400">
                Local.
              </span>
              <br />
              Buy Meaningful.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
              Connect directly with local
              artisans, farmers and home-based
              producers across Nepal.
            </p>

            <form
              onSubmit={handleSearch}
              className="mt-8 flex max-w-xl overflow-hidden rounded-2xl bg-white p-2"
            >
              <Search
                className="ml-3 mt-3 shrink-0 text-gray-400"
                size={22}
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="What are you looking for?"
                className="min-w-0 flex-1 px-4 py-3 text-black outline-none"
              />

              <button
                type="submit"
                className="rounded-xl bg-black px-6 py-3 font-semibold text-white"
              >
                Search
              </button>
            </form>
          </div>

          <div className="hidden lg:block">
            <div className="relative mx-auto h-[450px] max-w-[500px] overflow-hidden rounded-[2rem] bg-gray-900">
              <img
                src="https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d"
                alt="Nepali handmade products"
                className="h-full w-full object-cover opacity-80"
              />

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white p-5 text-black">
                <p className="text-sm text-gray-500">
                  From local hands
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Made with tradition.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gray-100 p-3">
              <Store />
            </div>

            <div>
              <h3 className="font-bold">
                Local Producers
              </h3>
              <p className="text-sm text-gray-500">
                Discover products from Nepal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gray-100 p-3">
              <ShieldCheck />
            </div>

            <div>
              <h3 className="font-bold">
                Verified Products
              </h3>
              <p className="text-sm text-gray-500">
                Quality and trusted producers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gray-100 p-3">
              <Truck />
            </div>

            <div>
              <h3 className="font-bold">
                Local Delivery
              </h3>
              <p className="text-sm text-gray-500">
                Track your delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Explore
            </p>

            <h2 className="text-3xl font-black">
              Shop by Category
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 font-semibold sm:flex"
          >
            View all
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories
            .slice(0, 8)
            .map((category) => (
              <Link
                key={
                  category._id
                }
                to={`/products?category=${category._id}`}
                className="rounded-2xl border bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                  <Store size={22} />
                </div>

                <h3 className="font-bold">
                  {category.name}
                </h3>

                {category.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                    {
                      category.description
                    }
                  </p>
                )}
              </Link>
            ))}
        </div>
      </section>

      {/* Products */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">
                Marketplace
              </p>

              <h2 className="text-3xl font-black">
                Featured Products
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden items-center gap-2 font-semibold sm:flex"
            >
              View all
              <ArrowRight size={18} />
            </Link>
          </div>

          <ProductGrid
            products={products}
            loading={loading}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-4xl font-black">
            Are you a local producer?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Bring your handmade products and
            local goods to customers across
            Nepal.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Become a Producer
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;