import Product from "../types";
import { Dispatch, SetStateAction } from 'react';

export default function ProductCard({ product, setSelected, dark_mode }: { product: Product, setSelected: Dispatch<SetStateAction<Product | null>>, dark_mode: boolean }) {
  if (dark_mode) {
    return (
      <button
        onClick={() => setSelected(product)}
        key={product.product_id}
        className="
    group
    relative
    flex flex-col items-center
    max-w-sm
    w-full /* Ensure button takes up width if needed */
    p-4 /* Slightly reduced padding */
    rounded-2xl /* Keep soft, chunky corners */
    bg-gradient-to-br from-zinc-800 to-zinc-900 /* Subtler dark gradient */
    border-4 border-stone-600 /* Muted, thick border */
    shadow-lg shadow-black/40 /* Subtle shadow for depth */
    overflow-hidden
    transition-all duration-300 ease-in-out
    hover:border-stone-500 /* Slightly lighter border on hover */
    hover:shadow-xl /* Increase shadow slightly on hover */
    hover:-translate-y-1.5 /* Keep the lift effect */
  "
      >
        {/* Image Area */}
        <div className="w-full flex justify-center mb-4 relative">
          {/* Very subtle background glow effect */}
          <div
            className="
        absolute inset-0
        rounded-lg
        bg-stone-400 /* Muted glow color */
        opacity-0
        group-hover:opacity-15 /* Reduced glow opacity */
        transition-opacity duration-300
        blur-2xl /* Increased blur for softness */
        pointer-events-none
      "
          ></div>

          {/* Image */}
          <img
            src={product.image}
            alt={product.name}
            className="
        w-32 h-32
        object-cover
        rounded-lg
        border-2 border-stone-700 /* Muted image border */
        relative
        z-10
        transition-transform duration-300 ease-in-out
        group-hover:scale-105
      "
          />
        </div>

        {/* Text Area - Allows wrapping */}
        <div className="w-full text-center px-1 mb-3"> {/* Reduced horizontal padding slightly */}
          {/* Product Name - No longer truncated */}
          <h3
            className="
        text-xl /* Or text-lg if names are very long */
        font-semibold
        text-stone-100 /* Main light text */
        mb-1
        group-hover:text-stone-300 /* Subtle hover brightness */
        transition-colors duration-300
        break-words /* Ensure long words can wrap */
      "
          >
            {product.name.replace(/[^a-zA-Z0-9\s]/g, "")}
          </h3>
          {/* Product ID */}
          <p
            className="
        text-xs
        uppercase
        tracking-wider
        text-zinc-400 /* Secondary muted text */
        mt-1 /* Ensure some space below heading */
      "
          >
            ID: {product.product_id}
          </p>
        </div>

        {/* Divider */}
        <div className="w-11/12 border-t-2 border-stone-700 my-1"></div>

        {/* Price & Quantity Area */}
        <div className="flex flex-row justify-between w-full mt-2 px-3">
          <p className="text-zinc-300 text-sm font-medium">
            Price:
            <span className="pl-1.5 text-teal-500 font-bold"> {/* Subdued teal */}
              ${product.price.toFixed(2)}
            </span>
          </p>
          <p className="text-zinc-300 text-sm font-medium">
            Qty:
            <span className="pl-1.5 text-blue-500 font-bold"> {/* Subdued blue */}
              {product.quantity}
            </span>
          </p>
        </div>
      </button>
    )
  } else {
    return (
      <button
        onClick={() => setSelected(product)}
        key={product.product_id}
        className="
    group
    relative
    flex flex-col items-center
    max-w-sm
    p-5
    rounded-2xl
    bg-gradient-to-br from-amber-100 to-orange-300
    shadow-lg shadow-black/20
    border-4 border-yellow-800
    overflow-hidden
    transition-all duration-300 ease-in-out
    hover:shadow-xl hover:shadow-black/30
    hover:border-yellow-700
    hover:-translate-y-1.5
  "
      >
        <div className="w-full flex justify-center mb-4 relative">
          <div
            className="
        absolute inset-0
        rounded-lg
        bg-yellow-300
        opacity-0
        group-hover:opacity-30
        transition-opacity duration-300
        blur-lg
        pointer-events-none
      "
          ></div>

          <img
            src={product.image}
            alt={product.name}
            className="
        w-32 h-32
        object-cover
        rounded-lg
        border-2 border-yellow-700
        shadow-md shadow-black/15
        relative
        z-10
        transition-transform duration-300 ease-in-out
        group-hover:scale-105
      "
          />
        </div>

        <div className="w-full text-center px-2">
          <h3
            className="
        text-xl
        font-semibold
        text-stone-800
        mb-1
        group-hover:text-orange-700
        transition-colors duration-300
        truncate
      "
          >
            {product.name.replace(/[^a-zA-Z0-9\s]/g, "")}
          </h3>
          <p
            className="
        text-xs
        uppercase
        tracking-wider
        text-stone-600
        mb-3
      "
          >
            ID: {product.product_id}
          </p>
        </div>
        <div className="w-11/12 border-t-2 border-yellow-700 my-1"></div>
        <div className="flex flex-row justify-between w-full mt-2 px-3">
          <p className="text-stone-700 text-sm font-medium">
            Price:
            <span className="pl-1.5 text-emerald-600 font-bold">
              ${product.price.toFixed(2)}
            </span>
          </p>
          <p className="text-stone-700 text-sm font-medium">
            Qty: {/* Shortened label */}
            <span className="pl-1.5 text-sky-600 font-bold">
              {product.quantity}
            </span>
          </p>
        </div>
      </button>
    )
  }
}

