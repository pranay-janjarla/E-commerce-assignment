import { useState } from "react";
import Navbar from "../components/Navbar";
import ProductList from "../components/ProductList";
import products from "../utils/products";

const Home = () => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <ProductList products={products} addToCart={addToCart} />
      </div>
    </div>
  );
};

export default Home;
