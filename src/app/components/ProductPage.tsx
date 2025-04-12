import Cart from "./Cart";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CategoryState, formData, ProductPageProps, cart_product } from "../types";
import { FormEvent } from "react";
import { Product } from "../types";

export default function ProductPage({ product, cart, setCart, setIsCartOpen, isCartOpen, setCheckout, setSelected, setRefresh }: ProductPageProps) {
  const [edit, setEdit] = useState<boolean>(false);
  const [category, setCategory] = useState<CategoryState>({
    name: false,
    description: false,
    price: false,
    quantity: false
  });
  const [input_value, setInputValue] = useState<formData>({
    product_id: product.product_id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    quantity: Number(product.quantity),
  });
  const [edit_submit, setEditSubmit] = useState<boolean>(false);
  const [remove_product, setRemoveProduct] = useState<boolean>(false);

  const name: string = product?.name.replace(/[^a-zA-Z0-9\s]/g, "") as string;

  useEffect(() => {
    console.log("\n\tEdit Product useEffect");
    if (edit_submit === true) {
      edit_product();
      setRefresh(true);
    } else {
      setCategory({
        name: false,
        description: false,
        price: false,
        quantity: false
      });
      setInputValue({
        product_id: product.product_id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        quantity: Number(product.quantity),
      });
    }
  }, [edit_submit, product])

  useEffect(() => {
    console.log("\n\tRemove product useEffect");
    if (remove_product === true && product.product_id != null) {
      console.log("\nRemoving product with product_id", product.product_id);
      invoke<String>('remove_product', { productId: product.product_id })
        .then(result => console.log("\nResult from remove_product:", result))
        .catch(console.error)
      setRemoveProduct(false);
      setSelected(null);
      setRefresh(true);
    } else {
      console.log("\nremove_product is false, but useEffect fired anyway,", product.product_id);
      setRemoveProduct(false);
    }
  }, [remove_product])

  async function edit_product() {
    try {
      if (edit_submit === true) {
        console.log("\nEditing product\n");
        await invoke('edit_product', { product: input_value });
        clean();
      } else if (typeof (!input_value.price) === "number") {
        console.error("\nPrice is not a number, Edit submit:{edit_submit}, type_of_price:{typeof(input_value.price)}");
      };
      setEditSubmit(false);
    } catch (error) {
      console.error("\nError in edit_product:", error);
    }
  }

  function addToCart(product: Product) {
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
      price: false,
      quantity: false
    });
    setInputValue({
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      quantity: Number(product.quantity),
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
              <div className="flex relative w-full h-96 items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="flex relative object-cover rounded-2xl transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-2xl">
                <span className="text-gray-300 text-lg font-semibold">No Image Available</span>
              </div>
            )}
          </div>
        </div>
        {!edit ?
          <div className="p-6 space-y-4">
            <div className="flex flex-row-reverse w-full justify-between">
              <button onClick={() => {
                setEdit(!edit), setCategory({
                  name: false,
                  description: false,
                  price: false,
                  quantity: false
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
            <p className="text-md text-gray-300 leading-relaxed tracking-wide">
              {product?.description}
            </p>
            <div className="flex flex-row items-center justify-between">
              {/*Price*/}
              <p className="flex gap-4 items-center text-xl font-semibold text-green-300">
                ${product?.price}<span className="text-sm text-green-100">Price</span>
              </p>

              {/*Quantity*/}
              <p className="flex gap-4  items-center text-xl font-semibold text-blue-300">
                <span className="text-sm text-blue-100">Quantity</span>{product?.quantity}
              </p>
            </div>

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
          <form onSubmit={handle_submit} className="z-50 top-0 p-4 space-y-5">
            <div className="flex w-full items-center justify-end">
              <button onClick={() => {
                setEdit(!edit), setCategory({
                  name: false,
                  description: false,
                  price: false,
                  quantity: false
                }
                )
              }
              } className="text-white px-6 py-1 rounded-md bg-gray-800 hover:bg-gray-700 active:bg-gray-900 right-0 top-0 z-0">
                <span>Edit</span>
              </button>
            </div>

            {/*Name*/}
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
              className="inset-ring inset-ring-blue-300 rounded-sm w-full mr-5 px-2 py-2 text-2xl text-white bg-gray-900 bg-transparent border-none border-gray-100 focus:outline-none  placeholder-gray-400 transition-all duration-300 focus:inset-ring-purple-400 focus:border-transparent"
            />

            {/*Description*/}
            <div className="flex flex-row inset-ring inset-ring-blue-300 rounded-sm w-full max-w-xl h-auto">
              <textarea
                maxLength={2000}
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
                className="w-full bg-gray-800 z-50 h-20 px-2 py-2 text-md overflow-scroll focus:outline-none text-white bg-gray-900 bg-transparent border-none border-gray-100 focus:inset-ring focus:inset-ring-purple-400 focus:border-transparent placeholder-gray-400 transition-all duration-300"
              />
            </div>

            <div className="w-full relative flex flex-row items-center justify-between">
              <input
                aria-label="price"
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
                className="w-[30%] px-7 rounded-sm text-2xl overflow-scroll text-white bg-gray-900 bg-transparent border-none border-gray-100 inset-ring inset-ring-blue-300 focus:outline-none focus:inset-ring-purple-400 focus:border-transparent placeholder-gray-400 transition-all duration-300"
              />

              <input
                type="number"
                maxLength={1000}
                placeholder={`${product.quantity}`}
                value={input_value.quantity}
                name="quantity"
                onChange={
                  (e) => {
                    setInputValue((prev) => ({
                      ...prev,
                      quantity: Number(e.target.value),
                    }))
                    change_state('quantity')
                  }
                }
                min="0"
                className="w-[30%] px-7 rounded-sm text-2xl overflow-scroll text-white bg-gray-900 bg-transparent border-none border-gray-100 inset-ring inset-ring-blue-300 focus:outline-none focus:inset-ring-purple-400 focus:border-transparent placeholder-gray-400 transition-all duration-300"
              />
            </div>

            {/*Submit cancel buttons */}
            <div className="w-full flex flex-row gap-5">
              <button
                onClick={() => {
                  if (!category.name && !category.description && !category.price && !category.quantity) {
                    return;
                  }
                  setEditSubmit(true);
                }}
                className={`w-full text-white font-medium py-3 rounded-lg 
  shadow-md transition duration-300 ease-in-out 
  hover:bg-green-700 hover:shadow-lg 
  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
  active:bg-green-800 
  ${(!category.name && !category.description && !category.price && !category.quantity)
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
        <div className="w-full flex items-center justify-center">
          <button
            onClick={() => setRemoveProduct(true)}
            className={`
              w-1/2 py-3 rounded-lg shadow-md transition duration-300 ease-in-out active:bg-red-800 bg-white text-black font-bold focus:ring-red-400 hover:text-white hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            Delete Item
          </button>
        </div>
      </div>
    </div >
  );
}
