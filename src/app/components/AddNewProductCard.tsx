import { FormEvent } from "react";
import { AddNewProductCardProps } from "../types"
import { useState, useEffect } from "react";
import { Product } from "../types";
import { invoke } from "@tauri-apps/api";

export default function AddNewProductCard({ products_length, setAddNewProduct, setRefresh }: AddNewProductCardProps) {
  const [new_product, setNewProduct] = useState<Product>({
    product_id: 1,
    name: "Insert Product Name",
    description: "Insert Product Description",
    price: 0,
    quantity: 0,
    image: "https://karanzi.websites.co.in/obaju-turquoise/img/product-placeholder.png",
  });
  const [submit_new_product, setSubmitNewProduct] = useState<boolean>(false);


  function on_submit(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      console.log("\nEvent: ", event);
      console.log("\nSubmit happened");
      setNewProduct((prev) => ({
        ...prev,
        product_id: products_length + 1,
      }));
      setRefresh(true);
      setAddNewProduct(false);
    } catch (err) {
      console.error(err);
      setSubmitNewProduct(false);
    }
  }

  useEffect(() => {
    if (submit_new_product === true) {
      try {
        console.log("\nAdding new product");
        console.log("\nNew product:", new_product);
        invoke<String>('insert_new_product', { product: new_product })
          .then(result => console.log("\nResult from insert_new_product:", result))
          .catch(console.error)
        setSubmitNewProduct(false);
      } catch (err) {
        console.error(err);
        setSubmitNewProduct(false);
      }
    }
  }, [submit_new_product])


  return (
    <form
      onSubmit={on_submit}
      className="group relative flex flex-col justify-evenly items-center max-w-sm w-full p-4 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border-4 border-stone-600 shadow-lg shadow-black/40 overflow-hidden
    transition-all duration-300 ease-in-out hover:border-stone-500 hover:shadow-xl hover:-translate-y-1.5">
      {/* Image Area */}
      <div className="w-full flex justify-center relative">
        <input type="text" placeholder={"Insert Image Url"}
          onChange={(e) => {
            setNewProduct((prev) => ({
              ...prev,
              image: e.target.value,
            }))
          }}
          required={true}
          className="mb-3 inset-ring inset-ring-blue-300 p-2" />
        {/* Background glow effect */}
        < div
          className="absolute inset-0 rounded-lg bg-stone-400 opacity-0 group-hover:opacity-15 transition-opacity duration-300 blur-2xl pointer-events-none" >
        </div>
      </div>
      {/* Text Area */}
      <div className="w-full text-center px-1 mb-3">
        {/* Product Name */}
        <h3
          className="text-xl font-semibold text-stone-100 mb-1 group-hover:text-stone-300 transition-colors duration-300 break-words tracking-wider">
          <input type="text" placeholder={"Insert Product Name"} onChange={(e) => {
            setNewProduct((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }}
            required={true}
            className="inset-ring inset-ring-blue-300 p-2" />
        </h3>
        {/* Product Description */}
        <p className="text-xs uppercase tracking-wider text-zinc-400 mt-1">
          <textarea placeholder={"Insert Product Description"} onChange={(e) => {
            setNewProduct((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }}
            required={true}
            className="resize-none mt-2 w-full inset-ring inset-ring-blue-300 p-2" />
        </p>
      </div>
      {/* Price & Quantity Area */}
      <div className="flex flex-row justify-between w-full mt-2 px-3">
        <p className="text-zinc-300 text-sm font-medium">
          Price:
          <span className="pl-1.5 text-teal-500 font-bold">
            <input type="number" placeholder={"0"} onChange={(e) => {
              setNewProduct((prev) => ({
                ...prev,
                price: Number(e.target.value),
              }))
            }}
              required={true}
              className="text-lg w-1/3 inset-ring inset-ring-blue-300 p-2 rounded-sm" />
          </span>
        </p>
        <p className="text-zinc-300 text-sm font-medium">
          Qty:
          <span className="pl-1.5 text-blue-500 font-bold">
            <input type="number" placeholder={"0"} onChange={(e) => {
              setNewProduct((prev) => ({
                ...prev,
                quantity: Number(e.target.value),
              }))
            }}
              required={true}
              className="text-lg w-1/3 inset-ring inset-ring-blue-300 p-2 rounded-sm" />
          </span>
        </p>
      </div>

      {/*Add and Cancel buttons*/}
      <div className="w-full flex justify-between mt-5">
        <button onClick={() => setSubmitNewProduct(true)} className="flex items-center justify-center text-center font-bold bg-blue-600 px-4 py-1 rounded-sm">
          <p>Add</p>
        </button>
        <button onClick={() => setAddNewProduct(false)} className="flex items-center justify-center text-center text-black font-bold bg-white px-4 py-1 rounded-sm">
          <p>Cancel</p>
        </button>
      </div>
    </form >
  )
}
