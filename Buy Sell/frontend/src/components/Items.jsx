import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Tag,
  DollarSign,
  User,
  Grid,
  X,
  CheckCircle,
  List,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import "./Items.css";

const Notification = ({ message, onClose }) => {
  return (
    <div className={`notification ${message ? "show" : ""}`}>
      <CheckCircle className="notification-icon" size={24} />
      {message}
      <button onClick={onClose} className="notification-close">
        <X size={16} />
      </button>
    </div>
  );
};

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [filters, setFilters] = useState({
    tag: "",
    categories: [],
    min: 0,
    max: 100,
  });
  const navigate = useNavigate();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const shouldFetchCart = await fetchProtectedData();
      if (shouldFetchCart) {
        fetchItems();
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, filters]);

  const fetchProtectedData = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const fetchItems = async () => {
    console.log("1");
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/item/get", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      console.log("2");
      const result = await response.json();
      if (result.success == true) {
        setItems(result.items);
        const uniqueCategories = [
          ...new Set(result.items.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);

        const prices = result.items.map((item) => item.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        setPriceRange({ min: minPrice, max: maxPrice });
        setFilters((prev) => ({
          ...prev,
          min: minPrice,
          max: maxPrice,
        }));
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    if (filters.tag) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(filters.tag.toLowerCase())
      );
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter((item) =>
        filters.categories.includes(item.category)
      );
    }

    filtered = filtered.filter(
      (item) => item.price >= filters.min && item.price <= filters.max
    );

    setFilteredItems(filtered);
  };

  const handlePriceChange = (type, value) => {
    value = Number(value);
    if (type === "min") {
      value = Math.min(value, filters.max);
      setFilters((prev) => ({ ...prev, min: value }));
    } else {
      value = Math.max(value, filters.min);
      setFilters((prev) => ({ ...prev, max: value }));
    }
  };

  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleItemClick = (id) => {
    navigate(`/item/${id}`);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  if (loading)
    return (
      <div className="loading">
        <RefreshCw className="spin-icon" size={24} />
        Loading items...
      </div>
    );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <Notification
          message={notification}
          onClose={() => setNotification("")}
        />
        <div className="main">
          <div className="filters">
            <div className="searchbar">
              <input
                type="text"
                placeholder="Search items..."
                value={filters.tag}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, tag: e.target.value }))
                }
              />
            </div>
            <h3>
              <DollarSign size={20} strokeWidth={2} /> Price Filters
            </h3>
            <div className="slider-container">
              <div className="slider-wrapper">
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={filters.min}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                />
                <input
                  type="range"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={filters.max}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                />
              </div>

              <div className="price-values">
                <span
                  style={{
                    left: `${
                      ((filters.min - priceRange.min) /
                        (priceRange.max - priceRange.min)) *
                        100 +
                      49.3
                    }%`,
                  }}
                >
                  {filters.min}
                </span>
                <span
                  style={{
                    left: `${
                      ((filters.max - priceRange.min) /
                        (priceRange.max - priceRange.min)) *
                        100 +
                      49.3
                    }%`,
                  }}
                >
                  {filters.max}
                </span>
              </div>
            </div>

            <div className="category-filters">
              <h3>
                <List size={20} strokeWidth={2} /> Categories
              </h3>
              <div className="category-buttons">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`category-btn ${
                      filters.categories.includes(category) ? "active" : ""
                    }`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    <Tag size={16} strokeWidth={2} /> {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="no-item">
              <AlertCircle size={24} className="no-item-icon" />
              No items found matching your criteria
            </div>
          ) : (
            <div className="items">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="item-card"
                  onClick={() => handleItemClick(item._id)}
                >
                  <div className="item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span>No Image Available</span>
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="price">
                      <DollarSign size={18} strokeWidth={2} /> ₹{item.price}
                    </p>
                    <p className="colour">
                      <Tag size={16} strokeWidth={2} /> {item.colour}
                    </p>
                    <p className="category">
                      <Tag size={16} strokeWidth={2} /> {item.category}
                    </p>
                    <p className="seller">
                      <User className="inline-icon" size={18} /> Sold by:{" "}
                      {item.sellername}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ItemList;
