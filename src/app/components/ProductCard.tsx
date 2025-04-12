import { Product } from "../types";
import { Dispatch, SetStateAction } from 'react';

export default function ProductCard({ product, setSelected, dark_mode }: { product: Product, setSelected: Dispatch<SetStateAction<Product | null>>, dark_mode: boolean }) {
  if (dark_mode) {
    return (
      <button
        onClick={() => setSelected(product)}
        key={product.product_id}
        className="h-80 relative flex flex-col items-center max-w-sm w-full p-4 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border-4 border-stone-600 shadow-lg shadow-black/40 overflow-hidden transition-all duration-300 ease-in-out hover:border-stone-500 hover:shadow-xl hover:-translate-y-1.5 ">
        {/* Image Area */}
        <div className="w-full flex justify-center mb-4 relative">
          {/* Background glow effect */}
          <div
            className="absolute inset-0 rounded-lg bg-stone-400 opacity-0 transition-opacity duration-300 blur-2xl pointer-events-none"></div>
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
      "
          />
        </div>

        {/* Text Area */}
        <div className="w-full text-center px-1 mb-3">
          {/* Product Name */}
          <h3
            className="
        text-xl 
        font-semibold
        text-stone-100 
        mb-1
        transition-colors duration-300
        break-words 
        tracking-wider
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

