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
  }, [])

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
          setResult(prevResult => {
            const products_array: Product[] | null = Object.values(prevResult).slice().sort((a, b) => a.name.localeCompare(b.name));
            return products_array;
          });
          break;
        }
        case 1: {
          console.log("\nSorting by price");
          setResult(prevResult => {
            const products_array: Product[] | null = Object.values(prevResult).sort((a, b) => a.price - b.price);
            return products_array;
          });
          break;
        }
        case 2: {
          console.log("\nSorting by quantity");
          setResult(prevResult => {
            const products_array: Product[] | null = Object.values(prevResult).sort((a, b) => a.quantity - b.quantity);
            return products_array;
          })
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
      max-w-7xl mx-auto bg-black">
      <div className="flex flex-col w-full min-h-screen">
        <h1 className="text-4xl font-extrabold text-center pb-10 text-gray-100">
          Products
        </h1>
        <div className="flex w-full flex-grow z-0">
          <div className="w-1/3 rounded-md overflow-hidden">
            <div className="flex flex-row justify-between ease-in-out duration-200 items-center border border-blue-400 rounded-xl">
              <button onClick={() => sort_products(0)} className="flex w-full ease-in-out duration-200 text-center rounded-l-xl items-center justify-center border-r border-blue-400 hover:bg-blue-800">
                <h1>Name</h1>
              </button>
              <button onClick={() => sort_products(1)} className="flex w-full text-center ease-in-out duration-200 items-center justify-center hover:bg-blue-800 border-r border-blue-400">
                <h1>Price</h1>
              </button>
              <button onClick={() => sort_products(2)} className="flex w-full text-center ease-in-out duration-200 rounded-r-xl items-center justify-center hover:bg-blue-800">
                <h1>Quantity</h1>
              </button>
            </div>
            <div className="space-y-0">
              {result?.map((product) => (
                <button
                  onClick={() => setSelected(product)}
                  key={product.product_id}
                  className="
                    flex flex-col m-2 z-10 rounded-sm w-full h-34 items-start p-4
                    hover:bg-gray-900
                    active:border-blue-500 active:bg-gray-900 active:ring-1 active:ring-blue-300
                    transition duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-blue-400
                  "
                >
                  <div className="w-full relative flex flex-row items-start gap-2">
                    <h1 className="text-xl">
                      {product.product_id}.
                    </h1>
                    <h3 className="text-lg font-semibold text-gray-100 text-left">
                      {product.name.replace(/[^a-zA-Z0-9\s]/g, "")}
                    </h3>
                  </div>
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
