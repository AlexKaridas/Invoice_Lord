import Cart from "./Cart";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { CategoryState, formData, ProductPageProps, cart_product } from "../types";
import { FormEvent } from "react";

export default function ProductPage({ product, cart, setCart, setIsCartOpen, isCartOpen, edit_submit, setEditSubmit, setCheckout, setSelected }: ProductPageProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [category, setCategory] = useState<CategoryState>({
    name: false,
    description: false,
    price: false
  });
  const [input_value, setInputValue] = useState<formData>({
    product_id: product.product_id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    quantity: product.quantity,
  });

  const name: string = product?.name.replace(/[^a-zA-Z0-9\s]/g, "") as string;

  useEffect(() => {
    console.log("\nUseEffect fire")
    edit_product();
  }, [edit_submit])

  async function edit_product() {
    try {
      console.log("\nEdit product function");
      if (edit_submit === true) {
        console.log("\n\tSENDING\t\n");
        const response = await invoke('edit_product', { product: input_value });
        console.log("Response from edit_product:", response);
        clean();
      } else if (typeof (!input_value.price) === "number") {
        console.error("\nPrice is not a number, Edit submit:{edit_submit}, type_of_price:{typeof(input_value.price)}");
      } else {
        console.log("\nEdit submit is false, {edit_submit}")
      };
      setEditSubmit(false);
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
      console.error("\nError trying to update setCart state: ", err);
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
      return new_state;
    })
  };

  function clean() {
    setCategory({
      name: false,
      description: false,
      price: false
    });
    setInputValue({
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      quantity: product.quantity,
    });
    setSelected(null);
    setEditSubmit(false);
    setEdit(false);
  }

  function handle_submit(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      console.log("\nEvent: ", event);
      console.log("\nSubmit happened: ", edit_submit);
      setEditSubmit(true);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="relative w-full flex flex-row-reverse items-start justify-center p-4">
      <div className="relative w-full max-w-xl bg-gray-900 rounded-2xl overflow-hidden sticky top-4">
        <div className="bg-gray-800 rounded-2xl overflow-hidden">
          <div className="relative w-full aspect-w-16 aspect-h-9">
            <button
              onClick={() => clean()}
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
        {/* Form Start */}
        {!edit ?
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

              {/*Name*/}
              <h1 className="text-left text-xl font-bold text-gray-100 leading-relaxed tracking-wide">
                {name}
              </h1>
            </div>

            {/*Description*/}
            <div>
              <p className="text-md text-gray-300 leading-relaxed tracking-wide">
                {product?.description}
              </p>
            </div>

            {/*Price*/}
            <p className="text-xl font-semibold text-blue-300">
              ${product?.price.toFixed(2)}
            </p>
            <div className="w-full flex flex-row gap-5">
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
          :
          <form onSubmit={handle_submit} className="p-6 space-y-4">
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

              {/*Name*/}
              <div className="relative w-full">
                <button onClick={() => change_state('name')} className=" ease-in-out duration-100 text-gray-400 leading-relaxed active:bg-gray-900 hover:bg-gray-700 text-2xl font-bold text-gray-100"> {!category.name && name} </button>
                <div className="absolute inset-0 flex items-start justify-start w-full h-full z-50 backdrop-blur-lg">
                  <div className="flex flex-row gap-2 bg-gray-900 shadow-xl w-full max-w-xl h-full">
                    <input
                      type="text"
                      maxLength={1000}
                      placeholder={input_value.name}
                      id="name"
                      value={input_value.name}
                      onChange={(e) => {
                        setInputValue((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                        change_state('name')
                      }}
                      className="w-full mr-5 px-2 py-4 text-2xl text-white bg-gray-900 bg-transparent border-none border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-transparent placeholder-gray-400 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/*Description*/}
            <div className="relative flex flex-col gap-5 items-start justify-center ">
              <button onClick={() => change_state('description')} className="ease-in-out duration-100 text-gray-400 text-left leading-relaxed active:bg-gray-900 hover:bg-gray-700">
                `{product?.description}`
              </button>
              <div className="absolute inset-0 flex items-start justify-start w-full h-full z-50 backdrop-blur-lg">
                <div className="flex flex-row gap-2 bg-gray-900 shadow-xl w-full max-w-xl h-full">
                  <textarea
                    maxLength={1000}
                    placeholder={input_value.description}
                    name="description"
                    value={input_value.description}
                    onChange={
                      (e) => {
                        setInputValue((prev) => ({
                          ...prev,
                          description: e.target.value,
                        })),
                          change_state('description')
                      }
                    }
                    style={{ resize: 'none' }}
                    className="w-full mr-5 bg-gray-800 z-50 px-2 py-2 text-md overflow-scroll text-white bg-gray-900 bg-transparent border-none border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-transparent placeholder-gray-400 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            <div className="relative flex flex-col gap-5 items-start justify-center ">
              <button onClick={() => change_state('price')} className="my-2 mx-1 ease-in-out duration-100 text-gray-400 leading-relaxed active:bg-gray-900 hover:bg-gray-700">
                `${product?.price.toFixed(2)}`
              </button>
              <div className="absolute inset-0 flex items-start justify-start w-32 z-50 backdrop-blur-lg">
                <div className="flex flex-row gap-2 bg-gray-900 shadow-xl w-full text-xl max-w-xl h-full">
                  <input
                    type="number"
                    maxLength={1000}
                    placeholder={`${product.price}`}
                    value={input_value.price}
                    name="price"
                    onChange={
                      (e) => {

                        setInputValue((prev) => ({
                          ...prev,
                          price: Number(e.target.value),
                        }))
                        change_state('price')
                      }
                    }
                    min="1"
                    className="w-full mr-5 px-4 py-2 text-md overflow-scroll text-white bg-gray-900 bg-transparent border-none border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-transparent placeholder-gray-400 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/*Submit cancel buttons */}
            <div className="w-full flex flex-row gap-5">
              <button
                onClick={() => {
                  if (!category.name && !category.description && !category.price) {
                    return;
                  }
                  setEditSubmit(true);
                }}
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
                type="button"
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
          </form>
        }
      </div>
    </div >
  );
}
