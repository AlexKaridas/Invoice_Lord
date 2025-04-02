"use client"
import Products from "./components/Products";
import Welcome from "./components/Welcome";
import WelcomeScreen from "./components/WelcomeScreen";

export default function Home() {
  const welcome = Welcome();
  return (
    <>
      {welcome === 0 ? <WelcomeScreen /> : <Products />}
    </>
  )
}
