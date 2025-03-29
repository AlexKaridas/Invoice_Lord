import Products from "./components/Products";

export default function Home() {
  return (
    <div className="py-12 min-h-screen 
      px-4 sm:px-6 lg:px-8 
      sm:py-12 lg:py-16 
      max-w-7xl mx-auto bg-black">
      <Products />
    </div>
  );
};
