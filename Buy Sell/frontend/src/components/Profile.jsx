import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Calendar, 
  Phone, 
  LogOut, 
  Edit, 
  Key, 
  CheckCircle,
  Star,
  RefreshCw
} from "lucide-react";
import "./Profile.css";

const Notification = ({ message, onClose }) => {
  return (
    <div className={`notification ${message ? "show" : ""}`}>
      <span className="notification-icon">✓</span>
      {message}
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    number: "",
    photo: "src/assets/profile.jpg",
  });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [userReviews, setUserReviews] = useState([]);
  const [groupedReviews, setGroupedReviews] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editingType, setEditingType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const shouldFetchCart = await fetchProtectedData();
      if (shouldFetchCart) {
        fetchDetails();
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

  const fetchDetails = async () => {
    const token = localStorage.getItem("authToken");
    try {
      setLoading(true);
      const [userResponse, reviewsResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/user/me`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
        fetch(`http://localhost:5000/api/review/user`, {
          headers: {
            Authorization: `${token}`,
          },
        }),
      ]);

      const userResult = await userResponse.json();
      const reviewsResult = await reviewsResponse.json();

      if (userResult.success == true) {
        setUser((prev) => ({
          ...prev,
          ...userResult.user,
        }));
      } else {
        throw new Error(userResult.message || "Failed to fetch user data");
      }

      if (reviewsResult.success) {
        setUserReviews(reviewsResult.reviews || []);
        const grouped = reviewsResult.reviews.reduce((acc, review) => {
          if (!acc[review.item]) {
            acc[review.item] = [];
          }
          acc[review.item].push(review);
          return acc;
        }, {});
        setGroupedReviews(grouped);
      } else {
        throw new Error(reviewsResult.message || "Failed to fetch reviews");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingType === "details") {
      setUser((prev) => ({ ...prev, [name]: value }));
    } else if (editingType === "password") {
      setPassword((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    console.log(user);
    const token = localStorage.getItem("authToken");
    try {
      if (editingType === "details") {
        const response = await fetch("http://localhost:5000/api/user/details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify(user),
        });

        const result = await response.json();
        if (result.success == true) {
          showNotification(result.message);
          setIsEditing(false);
        } else {
          throw new Error(result.message || "Failed to update details");
        }
      } else if (editingType === "password") {
        if (password.new !== password.confirm) {
          throw new Error("New passwords don't match");
        }

        const response = await fetch(
          "http://localhost:5000/api/user/password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify({
              email: user.email,
              password: password.current,
              newpassword: password.new,
            }),
          }
        );

        const result = await response.json();
        if (result.success == true) {
          showNotification(result.message);
          setIsEditing(false);
          setPassword({ current: "", new: "", confirm: "" });
        } else {
          throw new Error(result.message || "Failed to update password");
        }
      }
    } catch (error) {
      alert(error.message);
      console.error("Error saving data:", error);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile">
        <div className="loading">
          <RefreshCw className="spin-icon" size={24} />
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile">
        <div className="error">{error}</div>
      </div>
    );
  }

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
        <div className="profile">
          <div className="header">
            <div className="header-left">
              <div className="photo-container">
                <img src={user.photo} alt="Profile" className="photo" />
              </div>
              <div className="header-info">
                <h1 className="name">
                  <User size={24} /> {`${user.firstname} ${user.lastname}`}
                </h1>
                <p className="email">
                  <Mail size={16} /> {user.email}
                </p>
              </div>
            </div>
            <div className="logout">
              {!isEditing && (
                <>
                  <button className="logout-button" onClick={handleLogout}>
                    <LogOut size={20} /> Logout
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="content">
            {!isEditing ? (
              <div className="profile-section">
                <h3>Personal Information</h3>
                <p>
                  <User size={16} /> <strong>First Name:</strong> {user.firstname}
                </p>
                <p>
                  <User size={16} /> <strong>Last Name:</strong> {user.lastname}
                </p>
                <p>
                  <Mail size={16} /> <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <Calendar size={16} /> <strong>Age:</strong> {user.age}
                </p>
                <p>
                  <Phone size={16} /> <strong>Phone Number:</strong> {user.number}
                </p>
                <div className="button-group">
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => {
                      setIsEditing(true);
                      setEditingType("details");
                    }}
                  >
                    <Edit size={16} /> Edit Details
                  </button>
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => {
                      setIsEditing(true);
                      setEditingType("password");
                    }}
                  >
                    <Key size={16} /> Change Password
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-section">
                <h3>
                  {editingType === "details"
                    ? "Edit Profile"
                    : "Change Password"}
                </h3>
                <form onSubmit={(e) => e.preventDefault()}>
                  {editingType === "details" ? (
                    <>
                      <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={user.firstname}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={user.lastname}
                        onChange={handleInputChange}
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={user.email}
                        readOnly
                      />
                      <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={user.age}
                        onChange={handleInputChange}
                      />
                      <input
                        type="text"
                        name="number"
                        placeholder="Phone Number"
                        value={user.number}
                        onChange={handleInputChange}
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="password"
                        name="current"
                        placeholder="Current Password"
                        value={password.current}
                        onChange={handleInputChange}
                      />
                      <input
                        type="password"
                        name="new"
                        placeholder="New Password"
                        value={password.new}
                        onChange={handleInputChange}
                      />
                      <input
                        type="password"
                        name="confirm"
                        placeholder="Confirm New Password"
                        value={password.confirm}
                        onChange={handleInputChange}
                      />
                    </>
                  )}
                  <div className="button-group">
                    <button
                      type="button"
                      className="save-button"
                      onClick={handleSave}
                    >
                      <CheckCircle size={16} /> Save Changes
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={() => {
                        setIsEditing(false);
                        setPassword({ current: "", new: "", confirm: "" });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div className="reviews">
              <h3>Your Reviews</h3>
              {userReviews.length === 0 ? (
                <p>No reviews written yet.</p>
              ) : (
                Object.entries(groupedReviews).map(([item, reviews]) => (
                  <div key={item} className="item-reviews">
                    <h3>{item}</h3>
                    {reviews.map((review) => (
                      <div key={review._id} className="review">
                        <p>
                          <Star size={16} /> <strong>Rating: </strong> {review.rating}/5
                        </p>
                        <p>
                          <strong>Comment: </strong> {review.comment}
                        </p>
                        <p>
                          <User size={16} /> <strong>Reviewer: </strong>
                          {review.reviewer}
                        </p>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Profile;