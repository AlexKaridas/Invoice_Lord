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
  setEditSubmit: React.Dispatch<React.SetStateAction<boolean>>
  edit_submit: boolean
  setSelected: React.Dispatch<React.SetStateAction<cart_product | null>>
}

type CategoryState = {
  name: boolean,
  description: boolean,
  price: boolean,
}

export default function ProductPage({ product, cart, setCart, setIsCartOpen, isCartOpen, setCheckout, edit_submit, setEditSubmit, setSelected }: ProductPageProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [category, setCategory] = useState<CategoryState>({
    name: false,
    description: false,
    price: false
  });
  const [value, setValue] = useState<string | number>('');

  const name: string = product?.name.replace(/[^a-zA-Z0-9\s]/g, "") as string;

  useEffect(() => {
    edit_submit && edit_product();
  }, [edit_submit])

  async function edit_product() {
    let true_category = find_true_key(category);
    try {
      if (edit_submit == true) {
        const response = await invoke('edit_product', { productId: product.product_id, category: true_category, value: value });
        console.log("Response from Rust:", response);
      }
      console.log("\nCategory:", true_category, " value: ", value, " typeof: ", typeof (value));
      setEditSubmit(false);
      clean();
    } catch (error) {
      console.error(error);
      console.log("\nCategory:", true_category, " Value: ", value, " typeof: ", typeof (value));
    }

  }

  function find_true_key(obj: CategoryState) {
    const entry = Object.entries(obj).find(([key, value]) => value === true);
    return entry ? entry[0] : null;
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
    setCategory((prev) => {
      const new_state = { ...prev, [key]: true };

      Object.keys(new_state).forEach((prop) => {
        if (prop !== key) {
          new_state[prop] = false;
        }
      })
      return new_state;
    })
  };

  function clean() {
    setCategory({
      name: false,
      description: false,
      price: false
    }
    )
    setEdit(false);
  }

  return (
    <div className="relative w-full flex flex-row-reverse items-start justify-center p-4">
      <div className="relative w-full max-w-xl bg-gray-900 rounded-2xl overflow-hidden sticky top-4">
        <div className="bg-gray-800 rounded-2xl overflow-hidden">
          <div className="relative w-full aspect-w-16 aspect-h-9">
            <button
              onClick={() => setSelected(null)} // Replace null with your actual closing logic if needed
              className="absolute z-20 top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {product?.image ? (
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-2xl">
                <span className="text-gray-300 text-lg font-semibold">No Image Available</span>
              </div>
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
                {category.name && <Input category={"price"} placeholder={name} setValue={setValue} />}
              </div>
            }
          </div>
          {edit ?
            <div className="relative flex flex-col gap-5 items-start justify-center ">
              <button onClick={() => change_state('description')} className="ease-in-out duration-100 text-gray-400 text-left leading-relaxed active:bg-gray-900 hover:bg-gray-700">
                `{product?.description}`
              </button>
              {category.description && <Input category={"price"} placeholder={product.description} setValue={setValue} />}
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
              <button onClick={() => change_state('price')} className="my-2 mx-1 ease-in-out duration-100 text-gray-400 leading-relaxed active:bg-gray-900 hover:bg-gray-700">
                `${product?.price.toFixed(2)}`
              </button>
              {category.price && <Input category={"price"} placeholder={product.price.toString()} setValue={setValue} />}
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
                  onClick={() => { setEditSubmit(true) }}
                  type="submit"
                  className={`w-full text-white font-medium py-3 rounded-lg 
  shadow-md transition duration-300 ease-in-out 
  hover:bg-green-700 hover:shadow-lg 
  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
  active:bg-green-800 
  ${(!category.name && !category.description && !category.price)
                      ? "cursor-not-allowed pointer-events-none bg-gray-700"
                      : "cursor-pointer bg-green-600"
                    }`}
                >
                  Ok
                </button>
                <button
                  onClick={() => clean()}
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
