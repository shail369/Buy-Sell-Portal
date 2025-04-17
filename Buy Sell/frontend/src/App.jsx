import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate
} from "react-router-dom";
import Login from "./components/Login";
import NavBar from "./components/Navbar";
import Profile from "./components/Profile";
import Items from "./components/Items";
import Single from "./components/Single";
import YourItem from "./components/Youritems";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import Verify from "./components/Verify";
import Chatbot from "./components/Chatbot";
import "./App.css";

const AppContent = ({ toggleChatbot, showChatbot }) => {
  const location = useLocation();
  const hideNavBar = location.pathname === "/login";

  return (
    <div>
      {!hideNavBar && <NavBar toggleChatbot={toggleChatbot} showChatbot={showChatbot}/>}
      <div
        style={{
          marginTop: !hideNavBar ? "80px" : "50px",
          textAlign: "center",
        }}
      >
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/items" element={<Items />} />
          <Route path="/item/:id" element={<Single />} />
          <Route path="/your" element={<YourItem />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot((prev) => !prev);
  };

  // useEffect(() => {
  //   if (window.location.pathname === "/login") {
  //     setHideNavbar(true);
  //   }
  // }, []);

  return (
    <Router>
      <AppContent toggleChatbot={toggleChatbot} showChatbot={showChatbot}/>
      {!hideNavbar && showChatbot && <Chatbot />}
    </Router>
  );
}

export default App;
