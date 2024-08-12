import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useCart();

  return (
    <nav className="bg-gray-800 text-white p-4 fixed top-0 left-0 right-0 z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 font-bold text-lg"
        >
          Shop
        </Link>
        <h1 className="text-2xl font-bold">E-Commerce Store</h1>
        <div className="flex items-center space-x-4">
          <Link
            href="/cart"
            className="relative text-blue-600 hover:text-blue-900 flex items-center"
          >
            <FaShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
