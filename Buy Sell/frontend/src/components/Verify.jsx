import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Bell,
  CheckCircle,
  ClipboardList,
  DollarSign,
  User,
  AlertCircle,
  RefreshCcw,
  Lock
} from "lucide-react";
import "./Verify.css"

const Notification = ({ message }) => {
  if (!message) return null;
  return (
    <div className="notification show">
      <CheckCircle className="notification-icon" size={20} /> {message}
    </div>
  );
};

const DeliveryCard = ({ order, onVerify }) => {
  const [enteredOtp, setEnteredOtp] = useState("");

  return (
    <div className="order-card">
      <div className="order-details">
        <h3>
          <ClipboardList className="inline-icon" size={18} />
          Order ID: {order._id}
        </h3>
        <p>
          <DollarSign className="inline-icon" size={18} />
          Total: ₹{order.total}
        </p>
        <p>
          <User className="inline-icon" size={18} />
          Buyer: {order.buyername}
        </p>
        <p>
          <AlertCircle className="inline-icon" size={18} />
          Status: {order.status}
        </p>
      </div>
      <div className="otp-section">
        <div className="input-wrapper">
          <Lock className="input-icon" size={18} />
          <input
            type="text"
            placeholder="Enter OTP"
            className="otp-input"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            maxLength="6"
          />
        </div>
        <button
          className="verify-otp-btn"
          onClick={() => onVerify(order._id, enteredOtp)}
        >
          <CheckCircle className="btn-icon" size={18} />
          Verify Order
        </button>
      </div>
    </div>
  );
};

const PendingDeliveries = () => {
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const shouldFetchCart = await fetchProtectedData();
      if (shouldFetchCart) {
        fetchPendingDeliveries();
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

  const fetchPendingDeliveries = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/order/yourpending",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setPendingDeliveries(result.orders);
      } else {
        showNotification(result.message);
      }
    } catch (error) {
      console.error("Error fetching pending deliveries:", error);
      showNotification("Failed to fetch pending deliveries.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOrder = async (orderId, enteredOtp) => {
    if (!enteredOtp) {
      showNotification("Please enter OTP");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/order/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ orderId, otp: enteredOtp }),
      });

      const result = await response.json();
      if (result.success == true) {
        showNotification("Order verified successfully.");
        fetchPendingDeliveries();
      } else {
        showNotification(result.message);
      }
    } catch (error) {
      console.error("Error verifying order:", error);
      showNotification("Failed to verify order.");
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <motion.div
      className="pending-deliveries-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Notification message={notification} />
      <h2>
        <Bell className="page-title-icon" size={24} />
          Pending Deliveries
      </h2>
      {loading ? (
        <p className="loading">
          <RefreshCcw className="spin-icon" size={24} />
          Loading...
        </p>
      ) : pendingDeliveries.length > 0 ? (
        <div className="orders">
          {pendingDeliveries.map((order) => (
            <DeliveryCard
              key={order._id}
              order={order}
              onVerify={verifyOrder}
            />
          ))}
        </div>
      ) : (
        <p className="no-item">
          <AlertCircle size={24} className="no-item-icon" />
          No pending deliveries found.
        </p>
      )}
    </motion.div>
  );
};

export default PendingDeliveries;