import { useState, SetStateAction, Dispatch, FormEvent, ChangeEvent } from "react";

export default function Input({ category, placeholder, setValue }: { category: string, placeholder: string, setValue: Dispatch<SetStateAction<number | string>> }) {
  const [input_value, setInputValue] = useState<string>('');

  function handle_change(event: ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handle_submit(event: FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      setValue(input_value);
      console.log("\nValue for:", category, ":", input_value, ' submitted');
    } catch (err) {
      console.error(err);
    }
  }

  const OkButton = () => {
    return (
      <button
        type="submit"
        className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm transition font-medium active:bg-blue-700 active:scale-95 whitespace-nowrap"
      >
        OK
      </button>
    );
  };

  return (
    <div className="absolute inset-0 flex items-start justify-start w-full h-full z-50 backdrop-blur-lg">
      <form onSubmit={handle_submit} className="flex flex-row gap-2 bg-gray-900 shadow-xl w-full max-w-xl h-full">
        <input
          type="text"
          maxLength={1000}
          placeholder={placeholder}
          value={input_value}
          onChange={handle_change}
          className="w-full mr-5 px-2 py-4 text-2xl text-white bg-gray-900 bg-transparent border-none border-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:border-transparent placeholder-gray-400 transition-all duration-300"
        />
        <OkButton />
      </form>
    </div>
  )
}
