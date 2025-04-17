import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  Tag, 
  User, 
  Trash2, 
  ShoppingBag,
  CheckCircle,
  RefreshCw,
  ImageIcon
} from "lucide-react";
import "./Cart.css";

const Notification = ({ message }) => {
  return (
    <div className={`notification ${message ? "show" : ""}`}>
      <CheckCircle size={20} className="notification-icon" />
      {message}
    </div>
  );
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const shouldFetchCart = await fetchProtectedData();
      if (shouldFetchCart) {
        fetchCartItems();
      }
    };
    fetchData();
  }, []);

  const fetchProtectedData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return false; 
    }
    return true;
  }

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/cart/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      const result = await response.json();
      if (result.success == true) {
        setCartItems(result.items);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (id) => {
    navigate(`/item/${id}`);
  };

  const removeFromCart = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/cart/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ id }),
      });
      const result = await response.json();
      if (result.success == true) {
        showNotification(result.message);
        fetchCartItems();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Failed to remove item from cart.");
    }
  };

  const handlePlaceOrder = async() => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/order/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      });
      const result = await response.json();
      if (result.success == true) {
        showNotification(result.message);
        fetchCartItems();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order", error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  if (loading) {
    return (
      <div className="loading">
        <RefreshCw className="spin-icon" size={24} />
        Loading cart...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <Notification message={notification} />
      <div className="main">
        <div className="heading">
          <h1><ShoppingCart size={24} /> Shopping Cart</h1>
          <p className="cart-count">{cartItems.length} items</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <button 
              onClick={() => navigate("/items")} 
              className="continue-shopping"
            >
              <ShoppingBag size={20} /> Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item">
                  <div
                    className="item-image"
                    onClick={() => handleItemClick(item.id)}
                  >
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span><ImageIcon size={48} /> No Image Available</span>
                    )}
                  </div>
                  <div className="item-details">
                    <h3 onClick={() => handleItemClick(item.id)}>
                      {item.itemname}
                    </h3>
                    <p
                      className="category"
                      onClick={() => handleItemClick(item.id)}
                    >
                      <Tag size={16} strokeWidth={2} /> {item.category}
                    </p>
                    <p
                      className="seller"
                      onClick={() => handleItemClick(item.id)}
                    >
                      <User size={16} /> Sold by: {item.sellername}
                    </p>
                    <div className="price-row">
                      <p
                        className="price"
                        onClick={() => handleItemClick(item.id)}
                      >
                         ₹{item.price}
                      </p>
                      <br />
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary">
              <h2>Order Summary</h2>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>₹{calculateTotal()}</span>
                </div>
                <button onClick={handlePlaceOrder} className="place-order">
                  <ShoppingBag size={20} /> Place Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage;