// ShoppingCart.jsx
import React, { useState } from "react";

const CartPage = () => {
  // Initial cart items
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "Introduction to User Experience Design",
      author: "John Doe",
      rating: 4.6,
      reviews: 250,
      duration: "22 Total Hours",
      lectures: "155 Lectures",
      level: "All levels",
      price: 45.0,
    },
    {
      id: 2,
      title: "Introduction to User Experience Design",
      author: "John Doe",
      rating: 4.6,
      reviews: 250,
      duration: "22 Total Hours",
      lectures: "155 Lectures",
      level: "All levels",
      price: 45.0,
    },
    {
      id: 3,
      title: "Introduction to User Experience Design",
      author: "John Doe",
      rating: 4.6,
      reviews: 250,
      duration: "22 Total Hours",
      lectures: "155 Lectures",
      level: "All levels",
      price: 45.0,
    },
  ]);

  // Order details calculation
  const calculateOrderDetails = () => {
    const price = cartItems.reduce((acc, item) => acc + item.price, 0);
    const discount = 10.0; // Flat discount
    const tax = 20.0; // Flat tax
    const total = price - discount + tax;
    return { price, discount, tax, total };
  };

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const { price, discount, tax, total } = calculateOrderDetails();

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-8">
      {/* Cart Items */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/100"
                  alt={item.title}
                  className="w-24 h-24 rounded-md object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.title}</h2>
                  <p className="text-gray-500">By {item.author}</p>
                  <p className="text-sm text-gray-500">
                    {item.rating} ⭐ ({item.reviews} ratings)
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.duration}. {item.lectures}. {item.level}
                  </p>
                  <div className="flex gap-2 mt-2 text-blue-500">
                    <button className="hover:underline">Save for later</button>
                    <button
                      className="hover:underline"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="space-y-2 bg-white p-6 rounded-lg shadow-md w-full lg:w-96">
          <div className="flex justify-between">
            <p>Price</p>
            <p>${price.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Discount</p>
            <p className="text-red-500">-${discount.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Tax</p>
            <p>${tax.toFixed(2)}</p>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold">
            <p>Total</p>
            <p>${total.toFixed(2)}</p>
          </div>
        </div>
        <button className="w-full bg-black text-white py-2 mt-4 rounded-lg hover:bg-gray-800">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
