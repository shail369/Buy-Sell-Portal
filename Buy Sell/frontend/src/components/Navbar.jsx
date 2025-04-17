import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const NavBar = ({ toggleChatbot, showChatbot }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-logo">
          <NavLink to="/profile">MyApp</NavLink>
        </div>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-links active" : "nav-links"}>
              Profile
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/items" className={({ isActive }) => isActive ? "nav-links active" : "nav-links"}>
              Items
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/your" className={({ isActive }) => isActive ? "nav-links active" : "nav-links"}>
              Your Items
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/verify" className={({ isActive }) => isActive ? "nav-links active" : "nav-links"}>
              Verify Orders
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/cart" className={({ isActive }) => isActive ? "nav-links active" : "nav-links"}>
              Cart
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-links active" : "nav-links"}>
              Orders
            </NavLink>
          </li>
          <li className="nav-item">
            <button className={`nav-links ${showChatbot ? "active" : ""}`} onClick={toggleChatbot}>
              Chatbot
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
