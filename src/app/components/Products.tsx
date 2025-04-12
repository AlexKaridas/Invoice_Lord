'use client'
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core'
import { Product } from '../types';
import ProductPage from './ProductPage';
import { cart_product } from "../types";
import Checkout from '../components/Chekout';
import ProductCard from './ProductCard';
import ProductHeader from './ProductHeader';
import AddNewProductCard from './AddNewProductCard';

export default function Products() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<cart_product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [checkout, setCheckout] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);
  const [add_new_product, setAddNewProduct] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    console.log("\nRefresh");
    invoke<Product[]>('pagination', { page: page })
      .then(products => setProducts(products))
      .catch(console.error)
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    if (submit === true) {
      update_quantity()
    }
  }, [submit])

  async function update_quantity(): Promise<void> {
    try {
      if (submit == true && cart.length > 0) {
        const id = cart[0].product_id;
        const quantity = cart[0].selected_quantity;

        await invoke<any>('checkout', { productId: id, quantity: quantity })
          .catch(console.error)

        setRefresh(true);
        setSubmit(false);
        setCart([]);
        setIsCartOpen(false);
        setSelected(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  //TODO
  // When the user clicks twice the sorting must change order
  // Send 9 products at a time to improve loading speeds
  // Pagination
  // Handle the sorting from Rust sqlite

  function sort_products(sorting: number): void {
    let times_hit: number = 0;
    if (products !== null) {
      switch (sorting) {
        case 0: {
          console.log("\nSorting by name");
          times_hit += 1;
          if (times_hit === 1) {
            console.log("\nAscending");
            const products_array: Product[] | null = Object.values(products).sort((a, b) => a.name.localeCompare(b.name));
            setProducts(products_array);
            break;
          }
          else if (times_hit === 2) {
            console.log("\nDescending");
            break;
          } else if (times_hit > 2) {
            times_hit = 0;
            break;
          } else {
            console.log("\nSomething else happened:", times_hit);
          }
        }
        case 1: {
          console.log("\nSorting by price");
          const products_array: Product[] | null = Object.values(products).sort((a, b) => a.price - b.price);
          setProducts(products_array);
          break;
        }
        case 2: {
          console.log("\nSorting by quantity");
          const products_array: Product[] | null = Object.values(products).sort((a, b) => a.quantity - b.quantity);
          setProducts(products_array);
        }
      };
    } else {
      console.error("\nProducts_array is null, cannot sort");
    }
  }

  // JavaScript doesn't have a dedicated type for arrays; 
  // Instead, it uses objects with numeric keys and a length property to simulate array behavior. 
  // This is a reliable way to know if something is an array
  // console.log("type:", Array.isArray(products_array));

  return (
    <div className="py-12 min-h-screen 
      px-4 sm:px-6 lg:px-8 
      sm:py-12 lg:py-16 
      max-w-7xl mx-auto">
      <div className="flex flex-col w-full min-h-screen">
        <ProductHeader productCount={products && products.length} />
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
            <div className="flex flex-row w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
              <button
                onClick={() => setAddNewProduct(true)}
                className="flex w-full text-center ease-in-out duration-200 items-center justify-center py-3 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-l border-stone-700"
              >
                <h1 className="text-lg font-semibold text-stone-200">Add New Product</h1>
              </button>
              {add_new_product && <button
                onClick={() => setAddNewProduct(!add_new_product)}
                className="flex w-full text-center ease-in-out duration-200 items-center justify-center py-3 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 border-l border-stone-700"
              >
                <h1 className="text-lg font-semibold text-stone-200">Cancel</h1>
              </button>
              }
            </div>
          </div>

          <div className="w-full grid grid-cols-3 gap-5">
            {/*Add New Product Card */}
            {add_new_product && <AddNewProductCard products_length={Number(products?.length)} setAddNewProduct={setAddNewProduct} setRefresh={setRefresh} />
            }
            {products?.map((product, key) => (
              <ProductCard product={product} setSelected={setSelected} dark_mode={true} key={key} />
            ))}
          </div>
          <div className={`z-10 fixed top-0 right-0 h-screen w-full md:max-w-md bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${selected ? 'translate-x-0' : 'translate-x-full'}`}>
            {selected ? (
              <ProductPage product={selected} cart={cart} setCart={setCart} setIsCartOpen={setIsCartOpen} isCartOpen={isCartOpen} setCheckout={setCheckout} setSelected={setSelected} setRefresh={setRefresh} />
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



