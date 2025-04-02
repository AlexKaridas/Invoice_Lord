'use client'
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri'
import Product from '../types';
import ProductPage from './ProductPage';
import EmptyState from './EmptyState';
import cart_product from "../types";
import Checkout from '../components/Chekout';
import ProductCard from './ProductCard';

export default function Products() {
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
  };

  function sort_products(sorting: number) {
    if (result !== null) {
      switch (sorting) {
        case 0: {
          console.log("\nSorting by name");
          const products_array: Product[] | null = Object.values(result).sort((a, b) => a.name.localeCompare(b.name));
          setResult(products_array);
          break;
        }
        case 1: {
          console.log("\nSorting by price");
          const products_array: Product[] | null = Object.values(result).sort((a, b) => a.price - b.price);
          setResult(products_array);
          break;
        }
        case 2: {
          console.log("\nSorting by quantity");
          const products_array: Product[] | null = Object.values(result).sort((a, b) => a.quantity - b.quantity);
          setResult(products_array);
        }
      };
    } else {
      console.error("\nProducts_array is null, cannot sort");
    }
  }

  // JavaScript doesn't have a dedicated type for arrays; instead, it uses objects with numeric keys and a length property to simulate array behavior. 
  // console.log("type:", Array.isArray(products_array));

  return (
    <div className="py-12 min-h-screen 
      px-4 sm:px-6 lg:px-8 
      sm:py-12 lg:py-16 
      max-w-7xl mx-auto">
      <div className="flex flex-col w-full min-h-screen">
        <h1 className="text-4xl font-extrabold text-center pb-10 text-gray-100">
          Products
        </h1>
        <div className="flex flex-col w-full flex-grow z-0">
          <div className="flex flex-row justify-between rounded-lg border-2 border-stone-700 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden rounded-lg mb-5 overflow-hidden shadow-md dark:shadow-none dark:bg-gray-800">
            <button
              onClick={() => sort_products(0)}
              className="flex w-full text-center ease-in-out duration-200 items-center justify-center z-10 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
            >
              <h1 className="text-lg font-semibold text-stone-200">Name</h1>
            </button>
            <button
              onClick={() => sort_products(1)}
              className="flex w-full text-center ease-in-out duration-200 items-center justify-center py-3 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-l border-stone-700 border-r"
            >
              <h1 className="text-lg font-semibold text-stone-200">Price</h1>
            </button>
            <button
              onClick={() => sort_products(2)}
              className="flex w-full text-center ease-in-out duration-200 items-center justify-center py-3 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <h1 className="text-lg font-semibold text-stone-200">Quantity</h1>
            </button>
          </div>

          <div className="w-full grid grid-cols-3 gap-5">
            {result?.map((product) => (
              <ProductCard product={product} setSelected={setSelected} dark_mode={true} />
            ))}
          </div>
          <div className={`z-10 fixed top-0 right-0 h-screen w-full md:max-w-md bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${selected ? 'translate-x-0' : 'translate-x-full'
            }`}>
            {selected ? (
              <ProductPage product={selected} cart={cart} setCart={setCart} setIsCartOpen={setIsCartOpen} isCartOpen={isCartOpen} setCheckout={setCheckout} setEditSubmit={setEditSubmit} edit_submit={edit_submit} setSelected={setSelected} />
            ) : (
              <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          {checkout ? <Checkout setSubmit={setSubmit} setCheckout={setCheckout} /> : null}
        </div>
      </div>
    </div>
  )
}



