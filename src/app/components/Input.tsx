import { useState } from "react";

export default function Input({ placeholder }: { placeholder: string }) {
  const [input_value, setInputValue] = useState('');

  function handle_change(event) {
    setInputValue(event.target.value);
  }

  function handle_submit(event) {
    event.preventDefault();
    console.log("Submited value: ",input_value);
  }

  return (
    <div className="absolute z-50 inset-0 flex backdrop-blur-lg items-center justify-center w-full">
      <form onSubmit={handle_submit} className="flex flex-row gap-1 relative z-10 bg-gray-900 rounded-full shadow-xl w-full max-w-xl">
        <input
          type="text"
          maxLength={40}
          placeholder={placeholder}
          value={input_value}
          onChange={handle_change}
          className="w-full px-4 py-2 text-lg text-white bg-gray-900 bg-transparent border-2 border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all duration-300"
        />
      </form>
    </div>
  )
}
