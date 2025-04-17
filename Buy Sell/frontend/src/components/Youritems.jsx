import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Tag, 
  DollarSign, 
  PlusCircle,
  ImageIcon,
  AlertCircle,
  RefreshCw 
} from "lucide-react";
import "./Youritems.css";

const ItemsManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    colour: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const shouldFetchCart = await fetchProtectedData();
      if (shouldFetchCart) {
        fetchYourItems();
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

  const fetchYourItems = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/item/your", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });
      const result = await response.json();
      console.log(result);
      if (result.success) {
        setItems(result.items);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error fetching your items:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("http://localhost:5000/api/item/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      fetchYourItems();
      if (result.success) {
        setItems([...items, result.item]);
        setShowAddForm(false);
        setFormData({
          name: "",
          price: "",
          category: "",
          color: "",
          image: "",
          description: "",
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <RefreshCw className="spin-icon" size={24} />
        Loading your items...
      </div>
    );
  }

  return (
    <div className="body">
      <div className="filters">
        <h1>Your Items</h1>
        {!showAddForm && (
          <button className="additem" onClick={() => setShowAddForm(true)}>
            <PlusCircle size={20} /> Add New Item
          </button>
        )}
      </div>

      {showAddForm ? (
        <div className="item-form">
          <h2 className="heading">Add New Item</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Item Name"
              required
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
              required
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              required
            />
            <input
              type="text"
              name="colour"
              value={formData.colour}
              onChange={handleChange}
              placeholder="Colour"
            />
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Image URL"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            />
            <div className="form-actions">
              <button type="submit" className="submit">
                Add Item
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="no-items">
              <AlertCircle size={24} className="no-items-icon" />
              <p>No items found. Add one!</p>
            </div>
          ) : (
            <div className="items">
              {items.map((item) => 
              item ? (  
                <div key={item._id} className="item-card">
                  <div className="item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span><ImageIcon size={48} /> No Image Available</span>
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="price">
                      <DollarSign size={18} strokeWidth={2} /> &#8360;{item.price}
                    </p>
                    <p className="colour">
                      <Tag size={16} strokeWidth={2} /> {item.colour}
                    </p>
                    <p className="category">
                    <Tag size={16} strokeWidth={2} /> {item.category}
                    </p>
                  </div>
                </div>
              ) : null
            )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ItemsManagement;