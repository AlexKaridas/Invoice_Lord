'use client'
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri'
import Product from '../types';
import ProductPage from '../components/ProductPage';
import EmptyState from '../components/EmptyState';
import cart_product from "../types";
import Checkout from '../components/Chekout';

export default function products_screen() {
  const [result, setResult] = useState<Product[] | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<cart_product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [checkout, setCheckout] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);
  const [edit_submit, setEditSubmit] = useState<boolean>(false);

  useEffect(() => {
    invoke<Product[]>('main_initialize')
      .then(result => setResult(result))
      .catch(console.error)
  }, [edit_submit])

  useEffect(() => {
    update_quantity()
  }, [submit])

  async function update_quantity() {
    try {
      if (submit === true && cart.length > 0) {
        let id = cart[0].product_id;
        let quantity = cart[0].selected_quantity;

        console.log("Hey this works:", id, quantity);

        await invoke<any>('checkout', { productId: id, quantity: quantity })
          .then(result => setResult(result))
          .catch(console.error)

        setSubmit(false);
        setCart([]);
        setIsCartOpen(false);
        setSelected(null);
      }

    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="py-12 min-h-screen 
      px-4 sm:px-6 lg:px-8 
      sm:py-12 lg:py-16 
      max-w-7xl mx-auto bg-black">
      <div className="flex flex-col w-full min-h-screen">
        <h1 className="text-4xl font-extrabold text-center pb-10 text-gray-100">
          Products
        </h1>

        <div className="flex w-full flex-grow z-0">
          <div className="w-1/3 rounded-md overflow-hidden">
            <div className="space-y-0">
              {result &&
                Object.entries(result).map(([key, product]) => (
                  <button
                    onClick={() => setSelected(product)}
                    key={key}
                    className="
                    flex flex-col m-2 z-10 rounded-sm w-full h-34 items-start p-4
                    hover:bg-gray-900
                    active:border-blue-500 active:bg-gray-900 active:ring-1 active:ring-blue-300
                    transition duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-blue-400
                  "
                  >
                    <h3 className="text-lg font-semibold text-gray-100 text-left">
                      {product.name.replace(/[^a-zA-Z0-9\s]/g, "")}
                    </h3>
                    <h3 className="text-lg font-semibold text-gray-100 text-left">
                    </h3>

                    <div className="flex flex-row gap-2">
                      <p className="text-gray-400">Price:
                        <span className="pl-1 text-green-300">${product.price.toFixed(2)}</span>
                      </p>
                      <p className="text-gray-400">Quantity: <span className="text-blue-400">{product.quantity}
                      </span>
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
          <div className="relative w-2/3 h-full relative pl-6">
            {selected ? (
              <ProductPage product={selected} cart={cart} setCart={setCart} setIsCartOpen={setIsCartOpen} isCartOpen={isCartOpen} setCheckout={setCheckout} setEditSubmit={setEditSubmit} edit_submit={edit_submit} />
            ) : (
              <EmptyState />
            )}
          </div>
          {checkout ? <Checkout setSubmit={setSubmit} setCheckout={setCheckout} /> : null}
        </div>
      </div>
    </div>
  )
}
