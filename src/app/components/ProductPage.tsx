import Cart from "./Cart";
import cart_product from "../types";
import { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Input from "./Input";

interface ProductPageProps {
  product: cart_product;
  cart: cart_product[];
  setCart: Dispatch<SetStateAction<cart_product[]>>;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>
  isCartOpen: boolean
  setCheckout: React.Dispatch<React.SetStateAction<boolean>>
}

type CategoryState = {
  name: boolean,
  description: boolean,
  price: boolean,
}

export default function ProductPage({ product, cart, setCart, setIsCartOpen, isCartOpen, setCheckout }: ProductPageProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [submit, setSubmit] = useState<boolean>(false);
  const [category, setCategory] = useState<CategoryState>({
    name: false,
    description: false,
    price: false
  });
  const [value, setValue] = useState<String | number>('');

  const name: string = product?.name.replace(/[^a-zA-Z0-9\s]/g, "") as string;

  useEffect(() => {
    edit_product();
  }, [submit])

  async function edit_product() {
    try {
      if (submit == true) {
        await invoke<any>('edit_product', { productId: product.product_id, category: category, value: value })
          .then()
          .catch(console.error)
      }
      setSubmit(false);
    } catch (error) {
      console.error(error);
    }

  }

  function addToCart(product: cart_product) {
    try {
      setCart((prev) => {
        const product_exists = prev.find(item => item.product_id === product.product_id);
        if (product_exists) {
          return prev.map(item => item.product_id === product.product_id ? { ...item, selected_quantity: (item.selected_quantity || 0) + 1 } : item)
        } else {
          return [...prev, { ...product, selected_quantity: 1 }];
        }
      });

    } catch (err) {
      console.error("Error trying to update setCart state:", err);
    }
  }

  function removeFromCart(product_id: cart_product["product_id"]) {
    try {
      setCart((prev) => prev.filter(product => product.product_id !== product_id));
    } catch (error) {
      console.error("Error trying to remove from cart in ProductPage:", error);
    }
  }

  function change_state(key: keyof CategoryState) {
    setCategory((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  };

  function on_cancel() {
    setCategory({
      name: false,
      description: false,
      price: false
    }
    )
    setEdit(false);
  }

  return (
    <div className="relative min-h-[600px] w-full flex items-start justify-center items-start p-4">
      <div className="w-full max-w-xl bg-gray-900 rounded-2xl overflow-hidden sticky top-4">
        <div className="h-[300px] bg-gray-900 flex items-center justify-center rounded-2xl flex-shrink-0">
          <div className="h-[50px] relative w-full object-cover h-full bg-gray-800 mb-5 flex items-center justify-center rounded-2xl overflow-hidden">
            {product?.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-gray-100 text-lg">No Image Available</span>
            )}
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-row-reverse w-full justify-between">
            <button onClick={() => {
              setEdit(!edit), setCategory({
                name: false,
                description: false,
                price: false
              }
              )
            }
            } className="flex items-center justify-center text-white px-6 py-1 rounded-md bg-gray-800 hover:bg-gray-700 active:bg-gray-900 right-0 top-0 z-0">
              <span className="leading-none">Edit</span>
            </button>
            {!edit ?
              <h1 className="text-left text-2xl font-bold text-gray-100">
                {name}
              </h1>
              : <div className="relative w-full">
                <button onClick={() => change_state('name')} className=" ease-in-out duration-100 text-gray-400 leading-relaxed active:bg-gray-900 hover:bg-gray-700 text-2xl font-bold text-gray-100"> {!category.name && name} </button>
                {category.name && <Input category={"price"} placeholder={name} />}
              </div>
            }
          </div>
          {edit ?
            <div className="relative flex flex-col gap-5 items-start justify-center ">
              <button onClick={() => change_state('description')} className="ease-in-out duration-100 text-gray-400 text-left leading-relaxed active:bg-gray-900 hover:bg-gray-700">
                `{product?.description}`
              </button>
              {category.description && <Input category={"price"} placeholder={product.description} />}
            </div>
            :
            <div>
              <p className="text-gray-400 leading-relaxed">
                {product?.description}
              </p>
            </div>
          }
          {!edit ?
            <p className="text-xl font-semibold text-blue-300">
              ${product?.price.toFixed(2)}
            </p>
            :
            <div className="relative flex flex-col gap-5 items-start justify-center ">
              <button onClick={() => change_state('price')}className="my-2 mx-1 ease-in-out duration-100 text-gray-400 leading-relaxed active:bg-gray-900 hover:bg-gray-700">
                `${product?.price.toFixed(2)}`
              </button>
              {category.price && <Input category={"price"} placeholder={product.price.toString()} />}
            </div>
          }
          <div className="w-full flex flex-row gap-5">
            {!edit ?
              <div className="w-full flex flex-row gap-5">
                <button
                  onClick={() => addToCart(product)}
                  className="
          w-full bg-blue-600 text-white font-medium py-3 rounded-lg 
          shadow-md transition duration-300 ease-in-out
              hover:bg-blue-700 hover:shadow-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              active:bg-blue-800
            "
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeFromCart(product.product_id)}
                  className={`
              w-full font-medium py-3 rounded-lg 
              shadow-md transition duration-300 ease-in-out
              ${!
                      cart.find(item => item.product_id === product.product_id)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'active:bg-red-800 bg-red-600 text-white focus:ring-red-400 hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2  focus:ring-offset-2 '
                    }`}
                >
                  Remove from Cart
                </button>
              </div>
              :

              <div className="w-full flex flex-row gap-5">
                <button
                  onClick={() => console.log('click')}
                  type="submit"
                  className="
          w-full bg-green-600 text-white font-medium py-3 rounded-lg 
          shadow-md transition duration-300 ease-in-out
              hover:bg-green-700 hover:shadow-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              active:bg-green-800
            "
                >
                  Ok
                </button>
                <button
                  onClick={() => on_cancel()}
                  className="
          w-full bg-red-600 text-white font-medium py-3 rounded-lg 
          shadow-md transition duration-300 ease-in-out
              hover:bg-red-700 hover:shadow-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              active:bg-red-800
            "
                >
                  Cancel
                </button>
              </div>
            }
          </div>

          {cart.length > 0 &&
            <button
              onClick={() => setIsCartOpen(true)}
              className="
              w-full bg-green-600 text-white font-medium py-3 rounded-lg 
              shadow-md transition duration-300 ease-in-out
              hover:bg-green-700 hover:shadow-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              active:bg-blue-800
            "
            >
              Checkout
            </button>
          }{
            isCartOpen && <Cart cartItems={cart} setCart={setCart} onClose={() => setIsCartOpen(false)} setCheckout={setCheckout} />
          }
        </div>
      </div>
    </div >
  );
}
