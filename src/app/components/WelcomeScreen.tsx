"use client"
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function WelcomeScreen({ setWelcomeShown }: { setWelcomeShown: React.Dispatch<React.SetStateAction<null | number>> }) {

  useEffect(() => {
    invoke('main_initialize')
      .catch(console.error)
    console.log("\nMain main_initialize");
  }, [])

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500 opacity-20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-700 opacity-20 rounded-full filter blur-2xl" />
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg">
          Invoice Lord
        </h1>
        <p className="mb-8 mt-4 text-xl md:text-2xl text-gray-300">
          Welcome to the ultimate product management experience.
        </p>
        <button
          onClick={() => setWelcomeShown(1)}
          className="mt-10 px-8 py-4 rounded-full font-semibold text-lg focus:outline-none focus:ring-4 focus:ring-blue-400 bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white shadow-xl"
        >
          <span>Enter the Realm</span>
        </button>
      </div>
    </div>
  );
};
