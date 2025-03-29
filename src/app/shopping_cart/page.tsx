import BackArrow from "../components/BackArrow";

export default function ShoppingCart() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <BackArrow href="/" />
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

        {/* Product List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Product 1 */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        className="w-full h-full object-cover rounded"
                        src="/images/product1.jpg"
                        alt="Product 1"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Product 1</div>
                      <div className="text-sm text-gray-500">Category</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$29.99</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$29.99</td>
              </tr>
              {/* Product 2 */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        className="w-full h-full object-cover rounded"
                        src="/images/product2.jpg"
                        alt="Product 2"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Product 2</div>
                      <div className="text-sm text-gray-500">Category</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$49.99</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$99.98</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="mt-10 flex flex-col lg:flex-row justify-between">
          <div className="w-full lg:w-2/3">
            {/* Additional content can go here if needed */}
          </div>
          <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="flex justify-between text-gray-700 text-sm mb-2">
                <span>Subtotal</span>
                <span>$129.97</span>
              </div>
              <div className="flex justify-between text-gray-700 text-sm mb-2">
                <span>Shipping</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between text-gray-700 text-sm mb-2">
                <span>Tax</span>
                <span>$8.50</span>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>$148.47</span>
              </div>
              <button className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded hover:bg-indigo-700 transition-colors">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
