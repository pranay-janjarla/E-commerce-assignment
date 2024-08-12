import { useCart } from "../context/CartContext";
import { useState } from "react";

const CheckoutPage = () => {
  const { cart, removeFromCart, getTotalPrice } = useCart();
  const [discount, setDiscount] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  const discountCodePattern = /^HELLO50$/i;

  const applyDiscount = () => {
    if (discountCodePattern.test(discount)) {
      setDiscountApplied(true);
    } else {
      setDiscountApplied(false);
    }
  };

  const subtotal = getTotalPrice();
  const finalPrice = discountApplied
    ? (subtotal * 0.9).toFixed(2)
    : subtotal.toFixed(2);

  const handleProceedToPayment = () => {
    setShowPaymentGateway(true);
  };

  const closePaymentGateway = () => {
    setShowPaymentGateway(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
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
                ${item.price.toFixed(2)} x {item.quantity}
              </p>
              <p className="text-gray-700">
                Total: ${(item.price * item.quantity).toFixed(2)}
              </p>
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
        <h2 className="text-xl font-bold">Subtotal: ${subtotal.toFixed(2)}</h2>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Discount Code"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={applyDiscount}
            className="ml-2 bg-green-500 text-white py-2 px-4 rounded"
          >
            Apply
          </button>
          {discountApplied && (
            <p className="mt-2 text-green-500">Discount applied!</p>
          )}
        </div>
        <h2 className="text-xl italic mt-4">
          Coupon: HELLO50 to get 10% discount
        </h2>
        <h2 className="text-xl font-bold mt-10">Total: ${finalPrice}</h2>
        <button
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={handleProceedToPayment}
        >
          Proceed to the Payment
        </button>
      </div>

      {showPaymentGateway && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between">
              <img
                src="https://cdn.razorpay.com/logo.png"
                alt="Razorpay"
                className="h-8"
              />
              <button
                onClick={closePaymentGateway}
                className="text-black-500 hover:text-black-700"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Pay with Razorpay</h2>

              {/* Payment Details Section */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <div className="flex-grow space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="block w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={closePaymentGateway}
                className="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
              >
                Pay ₹{finalPrice}
              </button>

              {/* Cancel Button */}
              <button
                onClick={closePaymentGateway}
                className="mt-4 w-full text-black underline"
              >
                Cancel Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
