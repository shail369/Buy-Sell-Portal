import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
  Package,
  CheckCircle,
  Truck,
  RefreshCcw,
  AlertCircle,
  DollarSign,
  User,
  ClipboardList,
} from "lucide-react";
import "./Orders.css";

const Notification = ({ message }) => {
  if (!message) return null;
  return (
    <div className={`notification ${message ? "show" : ""}`}>
      <CheckCircle className="notification-icon" size={20} /> {message}
    </div>
  );
};

const OrderCard = ({ order, showChangeOtp = false, onChangeOtp }) => (
  <div key={order._id} className="order-card">
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
        {order.sellername
          ? `Seller: ${order.sellername}`
          : `Buyer: ${order.buyername}`}
      </p>
      <p>
        <AlertCircle className="inline-icon" size={18} />
        Status: {order.status}
      </p>
    </div>
    {showChangeOtp && (
      <button className="change-otp-btn" onClick={() => onChangeOtp(order._id)}>
        <RefreshCcw className="btn-icon" size={18} />
        Change OTP
      </button>
    )}
  </div>
);

const Orders = () => {
  const [placedOrders, setPlacedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [leftOrders, setLeftOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const shouldFetchCart = await fetchProtectedData();
      if (shouldFetchCart) {
        Promise.all([
          fetchPlacedOrders(),
          fetchDeliveredOrders(),
          fetchLeftOrders(),
        ]).finally(() => setLoading(false));
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
  };

  const fetchPlacedOrders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/order/left", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const result = await response.json();
      if (result.success) {
        setPlacedOrders(result.orders);
      } else {
        showNotification(result.message);
      }
    } catch (error) {
      console.error("Error fetching placed orders:", error);
      showNotification("Failed to fetch placed orders.");
    }
  };

  const changeOtp = async (orderId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `http://localhost:5000/api/order/changeotp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ orderId }),
        }
      );
      const result = await response.json();
      if (result.success) {
        showNotification("OTP changed successfully. New OTP is " + result.otp);
        fetchPlacedOrders();
      } else {
        showNotification(result.message);
      }
    } catch (error) {
      console.error("Error changing OTP:", error);
      showNotification("Failed to change OTP.");
    }
  };

  const fetchDeliveredOrders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/order/delivered",
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
        setDeliveredOrders(result.orders);
      } else {
        showNotification(result.message);
      }
    } catch (error) {
      console.error("Error fetching orders delivered by you:", error);
      showNotification("Failed to fetch orders delivered by you.");
    }
  };

  const fetchLeftOrders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "http://localhost:5000/api/order/yourdelivered",
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
        setLeftOrders(result.orders);
      } else {
        showNotification(result.message);
      }
    } catch (error) {
      console.error("Error fetching orders delivered by you:", error);
      showNotification("Failed to fetch orders delivered by you.");
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const tabData = [
    {
      icon: <Package size={20} />,
      label: "Placed Orders",
      content: placedOrders,
      showChangeOtp: true,
    },
    {
      icon: <CheckCircle size={20} />,
      label: "Delivered Orders",
      content: deliveredOrders,
      showChangeOtp: false,
    },
    {
      icon: <Truck size={20} />,
      label: "Items Delivered by You",
      content: leftOrders,
      showChangeOtp: false,
    },
  ];

  return (
    <motion.div
      className="orders-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <Notification message={notification} />
      <h2>Orders</h2>
      <Tabs>
        <TabList>
          {tabData.map((tab, index) => (
            <Tab key={index}>
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </Tab>
          ))}
        </TabList>

        {tabData.map((tab, index) => (
          <TabPanel key={index}>
            <h2>{tab.label}</h2>
            {loading ? (
              <p className="loading">
                <RefreshCcw className="spin-icon" size={24} />
                Loading...
              </p>
            ) : tab.content.length > 0 ? (
              <div className="orders">
                {tab.content.map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    showChangeOtp={tab.showChangeOtp}
                    onChangeOtp={changeOtp}
                  />
                ))}
              </div>
            ) : (
              <p className="no-item">
                <AlertCircle size={24} className="no-item-icon" />
                No {tab.label.toLowerCase()} found.
              </p>
            )}
          </TabPanel>
        ))}
      </Tabs>
    </motion.div>
  );
};

export default Orders;
