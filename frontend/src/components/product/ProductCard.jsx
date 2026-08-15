import {
  MapPin,
  ShoppingCart,
} from "lucide-react";

import { Link } from "react-router-dom";

const ProductCard = ({
  product,
}) => {
  const image =
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30";

  return (
    <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={`/products/${product._id}`}
      >
        <div className="h-56 overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-lg font-bold">
            {product.name}
          </h3>

          <span className="whitespace-nowrap text-lg font-bold">
            Rs. {product.price}
          </span>
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-gray-500">
          {product.description}
        </p>

        {product.category && (
          <span className="mb-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
            {product.category.name}
          </span>
        )}

        <div className="mb-4 flex items-center gap-1 text-sm text-gray-500">
          <MapPin size={15} />

          <span>
            {product.district ||
              product.province ||
              "Nepal"}
          </span>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800"
        >
          <ShoppingCart size={18} />
          View Product
        </button>
      </div>
    </div>
  );
};

export default ProductCard;