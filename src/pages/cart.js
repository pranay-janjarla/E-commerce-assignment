// src/pages/cart.js
import { useCart } from "../context/CartContext";
import Link from "next/link";

const CURRENCIES = {
  USD: "$",
  EUR: "€",
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="border p-4 rounded flex items-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover mr-4"
            />
            <div className="flex-grow">
              <h2 className="text-lg font-bold">{item.name}</h2>
              <p className="text-gray-700">
                {formatPrice(item.price)}{" "}
                {/* Display price in selected currency */}
              </p>
              <div className="flex items-center">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="bg-gray-300 text-black py-1 px-3 rounded"
                >
                  -
                </button>
                <span className="mx-4">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="bg-gray-300 text-black py-1 px-3 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="ml-4 bg-red-500 text-white py-2 px-4 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">
          Subtotal: {formatPrice(getTotalPrice())}
        </h2>
        <Link href="/checkout">
          <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded w-full text-center">
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
