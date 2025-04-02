"use client"
import { useState, useEffect } from "react"
import { invoke } from "@tauri-apps/api/tauri";

export default function Welcome() {
  const [welcome_shown, setWelcomeShown] = useState(0);

  useEffect(() => {
    welcome();
  }, [])

  async function welcome() {
    try {
      const response = await invoke<number>('welcome_screen');
      setWelcomeShown(response);
    } catch (error) {
      console.error(error);
    }
  };

  return welcome_shown
}
