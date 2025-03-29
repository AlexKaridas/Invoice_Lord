import { motion } from 'framer-motion';

interface checkout_modal_props {
  setSubmit: React.Dispatch<React.SetStateAction<boolean>>
  setCheckout: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Checkout({ setSubmit, setCheckout }: checkout_modal_props) {

  function on_checkout() {
    setSubmit(true);
    setCheckout(false);
  }

  function on_cancel() {
    setCheckout(false);
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center"
      >
        <h2 className="text-xl font-bold text-gray-100 mb-4">Checkout</h2>
        <p className="text-gray-400 mb-6">
          Are you sure you want to proceed with the checkout?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={on_checkout}
            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-400 transition-colors shadow-md"
          >
            Yes, Checkout
          </button>
          <button
            onClick={on_cancel}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-400 transition-colors shadow-md"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};
