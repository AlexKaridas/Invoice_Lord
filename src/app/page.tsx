"use client"
import Products from "./components/Products";
import WelcomeScreen from "./components/WelcomeScreen";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";

export default function Home() {
  const [welcomeShown, setWelcomeShown] = useState<null | number>(null);

  useEffect(() => {
    try {
      invoke<number>("welcome_screen").then(response => setWelcomeShown(response)).catch(console.error);
    } catch (error) {
      console.error(error);
    }
  }, [])

  if (welcomeShown === null) {
    return (
      <div className="flex justify-center items-center gap-5 min-h-screen">
        <div className="w-10 h-10 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
      </div>
    )
  } else if (welcomeShown === 0) {
    return (
      <WelcomeScreen setWelcomeShown={setWelcomeShown} />
    )
  } else {
    return (
      <Products />
    )
  }
}
