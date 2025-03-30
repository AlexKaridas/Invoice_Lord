import { useState } from "react";

export default function Input({ category, placeholder }: { category: string, placeholder: string }) {
  const [input_value, setInputValue] = useState('');
  const [price, setPrice] = useState(0);

  function handle_change(event) {
    setInputValue(event.target.value);
  }

  function handle_submit(event) {
    event.preventDefault();
    console.log("Submited value: ", input_value);
  }

  function increment() {
    setPrice((prev) => prev + 1);
  }
  function decrement() {
    setPrice((prev) => (prev > 0 ? prev - 1 : 0));
  }


  if (category == "title" || "description") {
    return (
      <div className="absolute inset-0 flex items-start justify-start w-full h-full z-50 backdrop-blur-lg">
        <form onSubmit={handle_submit} className="flex flex-row gap-1 bg-gray-900 shadow-xl w-full max-w-xl h-full">
          <input
            type="text"
            maxLength={1000}
            placeholder={placeholder}
            value={input_value}
            onChange={handle_change}
            className="w-full mr-5 px-4 pt-2 pb-0 text-lg text-white bg-gray-900 bg-transparent border-none border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-transparent placeholder-gray-400 transition-all duration-300"
          />
        </form>
      </div>
    )
  } else {
    <div className="absolute inset-0 flex items-center justify-center w-1/2 h-full z-50 backdrop-blur-lg">
      <form
        onSubmit={handle_submit}
        className="flex flex-row gap-2 bg-gray-900 shadow-xl p-4 rounded-lg max-w-xl"
      >
        <button
          type="button"
          onClick={decrement}
          className="px-3 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition"
        >
          -
        </button>
        <input
          type="number"
          value={price}
          onChange={handle_change}
          className="w-24 px-4 py-2 text-lg text-white bg-gray-800 border-none focus:outline-none text-center"
        />
        <button
          type="button"
          onClick={increment}
          className="px-3 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition"
        >
          +
        </button>
      </form>
    </div>
  }
}
