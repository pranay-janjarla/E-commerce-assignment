import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

const CURRENCIES = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  JPY: "¥",
};

const ProductList = ({ products }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  const { addToCart, cart } = useCart();
  const [notification, setNotification] = useState("");

  // Fetch exchange rates on client-side
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

    fetchExchangeRates();
  }, []);

  // Initialize currency from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCurrency = localStorage.getItem("preferredCurrency") || "USD";
      setSelectedCurrency(storedCurrency);
    }
  }, []);

  const handleAddToCart = (product) => {
    addToCart({ ...product, price: product.priceInUSD });
    setNotification(`Added ${product.name} to the cart!`);
    setTimeout(() => setNotification(""), 3000);
  };

  const formatPrice = (priceInUSD) => {
    if (priceInUSD == null || isNaN(priceInUSD)) {
      console.error("Invalid priceInUSD:", priceInUSD);
      return `${CURRENCIES[selectedCurrency] || "$"}0.00`;
    }
    const currencySymbol = CURRENCIES[selectedCurrency] || "$";
    const exchangeRate = exchangeRates[selectedCurrency] || 1;
    const convertedPrice = priceInUSD * exchangeRate;
    return `${currencySymbol}${convertedPrice.toFixed(2)}`;
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferredCurrency", newCurrency);
    }
  };

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <div className="flex justify-between items-center mb-4">
        <div>
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
      </div>

      {notification && (
        <div className="bg-green-500 text-white p-2 rounded mb-4 animate-bounce">
          {notification}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border p-4 rounded transition-transform transform hover:scale-105"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover mb-4"
            />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-gray-700">
              {formatPrice(product.priceInUSD)} ($
              {product.priceInUSD?.toFixed(2) || "0.00"})
            </p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded transition-transform transform hover:scale-105"
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
