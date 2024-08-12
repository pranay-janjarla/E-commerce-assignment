import { useCart } from "../context/CartContext";
import Link from "next/link";
import { motion } from "framer-motion";

const CURRENCIES = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  INR: "₹",
};

const CartPage = () => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalPrice,
    selectedCurrency,
    exchangeRates,
  } = useCart();

  const safeToFixed = (value) => {
    if (typeof value === "number" && isFinite(value)) {
      return value.toFixed(2);
    }
    return "0.00";
  };

  const formatPrice = (priceInUSD) => {
    const currencySymbol = CURRENCIES[selectedCurrency] || "$";
    const exchangeRate = exchangeRates[selectedCurrency] || 1;
    const convertedPrice = priceInUSD * exchangeRate;
    return `${currencySymbol}${safeToFixed(convertedPrice)}`;
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Your Cart
      </h1>
      <div className="space-y-6">
        {cart.length > 0 ? (
          cart.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white border rounded-lg shadow-lg p-4 flex items-center transition-transform transform hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover mr-4"
              />
              <div className="flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-gray-600">{formatPrice(item.price)}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => decreaseQuantity(item.id)}
                    className="bg-gray-300 text-black py-1 px-3 rounded-lg mr-2 hover:bg-gray-400 transition-colors duration-300"
                  >
                    -
                  </button>
                  <span className="text-lg mx-4">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item.id)}
                    className="bg-gray-300 text-black py-1 px-3 rounded-lg ml-2 hover:bg-gray-400 transition-colors duration-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg ml-4 hover:bg-red-600 transition-colors duration-300"
              >
                Remove
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-600">Your cart is empty!</p>
        )}
      </div>
      <div className="mt-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">
          Subtotal: {formatPrice(getTotalPrice())}
        </h2>
        <Link href="/checkout">
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 w-full text-center">
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
