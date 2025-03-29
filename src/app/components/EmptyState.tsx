import { ShoppingCart } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 transition-transform">
    <ShoppingCart className="h-16 w-16 text-gray-500 mb-4" />
    <h2 className="text-2xl font-bold text-gray-100 mb-2">
    No product selected
    </h2>
    <p className="text-gray-400 mb-6 text-center">
    Please select a product to continue with the checkout process.
      </p>
    </div>
  );
}
