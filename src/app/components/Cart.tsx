import { Dispatch, SetStateAction } from 'react';
import cart_product from "../types";

interface CartPageProps {
  cartItems: cart_product[];
  setCart: Dispatch<SetStateAction<cart_product[]>>;
  onClose: () => void;
  setCheckout: Dispatch<SetStateAction<boolean>>
}

export default function Cart({ cartItems, setCart, onClose, setCheckout }: CartPageProps) {
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.selected_quantity, 0).toFixed(2);

  const removeItem = (id: number) => {
    setCart(cartItems.filter((item) => item.product_id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(
      cartItems.map((item) =>
        item.product_id === id ? { ...item, selected_quantity: newQuantity } : item
      )
    );
  };

  function Checkout() {
    setCheckout(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end p-8 z-50">
      <div
        className="w-100 bg-gray-800/90 backdrop-blur-lg rounded-lg shadow-xl p-4 absolute top-4 right-8 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-100">Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-gray-400 text-center py-6">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-3">
              {cartItems.map((item, key) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-gray-700/50 p-2 rounded-md"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name.replace(/[^a-zA-Z0-9\s]/g, "")}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ) : null}

                  <div className="flex-1 ml-3">
                    <h3 className="text-sm font-semibold text-gray-300">
                      {item.name.replace(/[^a-zA-Z0-9\s]/g, "")}
                    </h3>
                    <p className="text-xs text-gray-400">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.selected_quantity - 1)}
                      className={`w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-gray-300 text-xs 'hover:bg-gray-500'`}
                    >
                      -
                    </button>
                    <span className="text-gray-300 text-sm">
                      {item.selected_quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.selected_quantity + 1)}
                      className={`w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-gray-300 text-xs ${item.selected_quantity < item.quantity ? 'hover:bg-gray-500' : 'pointer-events-none'}`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="ml-2 px-1 rounded-md text-white font-bold hover:text-red-400 text-sm bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-gray-700 pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-100 text-lg">Total:</span>
                <span className="text-lg font-semibold text-gray-100">${totalPrice}</span>
              </div>
            </div>

            <button
              onClick={() => Checkout()}
              className="w-full mt-4 bg-indigo-500 text-white py-2 rounded-md text-sm font-semibold hover:bg-indigo-400 transition-colors"
            >
              Checkout
            </button>
          </>
        )}
      </div>
    </div>

  );
};
