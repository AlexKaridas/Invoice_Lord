'use client'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FetchProducts from "../hooks/FetchProducts";
import { ProductType } from "./Products";

export default function AddProducts(setProducts) {
  const [filePath, setFilePath] = useState<string>('');
  const [submit, setSubmit] = useState<boolean>(false);

  // const handleSubmit = () => {
  //   setSubmit(!submit);
  // };

  useEffect(() => {
    try {
      submit && filePath.length > 0 && FetchProducts(setProducts, filePath);
    } catch (error) {
      console.error("\nError trying to fetch products in AddProducts:\n", error);
    }
  }, [submit != false])

  function onClose() {
  }

  return (
    <div className="h-full fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-lg shadow-xl w-96"
      >
        <h2 className="text-xl font-semibold text-center mb-4">Enter File Path</h2>
        <input
          type="text"
          placeholder="Enter path to products.txt"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => setSubmit(!submit)}
            disabled={!filePath?.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
}
