import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

const CURRENCIES = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  JPY: "¥",
};

const ProductList = ({ products }) => {
  const [selectedCurrency, setSelectedCurrency] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("preferredCurrency") || "INR"
      : "INR"
  );
  const [exchangeRates, setExchangeRates] = useState({});
  const { addToCart } = useCart();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    if (typeof window !== "undefined") {
      fetchExchangeRates();
    }
  }, []);

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      console.error("Invalid price:", price);
      return `${CURRENCIES[selectedCurrency] || "€"}0.00`;
    }

    const currencySymbol = CURRENCIES[selectedCurrency] || "€";
    const exchangeRate = exchangeRates[selectedCurrency] || 1;

    const convertedPrice = price * exchangeRate;

    return `${currencySymbol}${convertedPrice.toFixed(2)}`;
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredCurrency", newCurrency); // this code will store preference of the user
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification(`Added ${product.name} to the cart!`);
    setTimeout(() => setNotification(""), 3000); // After 3 seconds removal of notification
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="mb-4">
        <label htmlFor="currency" className="mr-2">
          Choose Currency:
        </label>
        <select
          id="currency"
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          className="border p-2 rounded"
        >
          {Object.keys(CURRENCIES).map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      {notification && (
        <div className="bg-green-500 text-white p-2 rounded mb-4">
          {notification}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded shadow-lg hover:shadow-xl transition-shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover mb-4"
            />
            <h2 className="text-lg font-bold mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-4">{formatPrice(product.price)}</p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
