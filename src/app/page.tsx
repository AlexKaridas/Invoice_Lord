"use client"
import Products from "./components/Products";
import WelcomeScreen from "./components/WelcomeScreen";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

export default function Home() {
  const [welcomeShown, setWelcomeShown] = useState<number | null>(null);

  useEffect(() => {
    async function fetchWelcome() {
      try {
        const response = await invoke<number>("welcome_screen");
        setWelcomeShown(response);
      } catch (error) {
        console.error(error);
      }
    }
    fetchWelcome();
  }, []);

  if (welcomeShown != null) {
    return (
      <>
        {welcomeShown == 0 ? <WelcomeScreen setWelcomeShown={setWelcomeShown} /> : <Products />}
      </>
    )
  } else {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  }
}
