import ProductCard from "./ProductCard";

const ProductGrid = ({
  products,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({
          length: 8,
        }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-2xl border bg-white"
          >
            <div className="h-56 bg-gray-200" />

            <div className="space-y-3 p-5">
              <div className="h-5 rounded bg-gray-200" />
              <div className="h-4 rounded bg-gray-200" />
              <div className="h-10 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="rounded-2xl border bg-white p-12 text-center">
        <h3 className="text-xl font-bold">
          No products found
        </h3>

        <p className="mt-2 text-gray-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;