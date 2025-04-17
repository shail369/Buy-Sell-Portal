import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import "./Single.css";

const Notification = ({ message, onClose }) => {
  return (
    <div className={`notification ${message ? "show" : ""}`}>
      <span className="notification-icon">✓</span>
      {message}
    </div>
  );
};

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const navigate = useNavigate();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const shouldFetchCart = await fetchProtectedData();
      if (shouldFetchCart) {
        fetchItemDetails();
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

  const fetchItemDetails = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const [itemResponse, reviewsResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/item/${id}`, {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        }),
        fetch(`http://localhost:5000/api/review/${id}`, {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        }),
      ]);

      const itemResult = await itemResponse.json();
      const reviewsResult = await reviewsResponse.json();

      if (itemResult.success == true) {
        setItem(itemResult.item);
      } else {
        alert(itemResult.message);
        navigate("/");
      }

      if (reviewsResult.success == true) {
        setReviews(reviewsResult.reviews);
      } else {
        reviews.length = 0;
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
      alert("Something went wrong. Please try again.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/cart/add/${id}`, {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
      });
      const result = await response.json();
      if (result.success == true) {
        showNotification(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart.");
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5000/api/review/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          itemid: id,
          rating: reviewForm.rating,
          comment: reviewForm.comment,
        }),
      });
      const result = await response.json();
      if (result.success == true) {
        showNotification(result.message);
        fetchItemDetails();
        setReviewForm({ rating: 5, comment: "" });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < rating ? "gold" : "none"}
            stroke="gold"
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <p>Loading item details...</p>;
  }

  if (!item) {
    return <p>Item not found.</p>;
  }

  return (
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
      <div className="item">
        <h1>{item.name}</h1>
        <div className="image">
          {item.image ? (
            <img src={item.image} alt={item.name} />
          ) : (
            <span>No Image Available</span>
          )}
        </div>
        <div className="details">
          <p>
            <strong>Category:</strong> {item.category}
          </p>
          <p>
            <strong>Colour:</strong> {item.colour}
          </p>
          <p>
            <strong>Price:</strong> ₹{item.price}
          </p>
          <p>
            <strong>Description:</strong> {item.description}
          </p>
          <p>
            <strong>Seller:</strong> {item.sellername}
          </p>

          <button onClick={() => navigate("/items")}>Back to Items</button>
          <button onClick={addToCart}>Add to Cart</button>
        </div>

        <div className="reviews">
          <h2>Reviews</h2>
          {reviews.length === 0 ? (
            <p>No reviews yet</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="review">
                <p>
                  <strong>Name:</strong> {review.reviewer}
                </p>
                <p>
                  <strong>Rating:</strong>
                  <StarRating rating={review.rating} />
                </p>
                <p>{review.comment}</p>
              </div>
            ))
          )}

          <form onSubmit={submitReview}>
            <h3>Add a Review</h3>
            <select
              value={reviewForm.rating}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  rating: parseInt(e.target.value),
                })
              }
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <textarea
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({ ...reviewForm, comment: e.target.value })
              }
              placeholder="Write your review"
              required
            />
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemDetails;
