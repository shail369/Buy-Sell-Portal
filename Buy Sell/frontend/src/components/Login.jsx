import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import "./Login.css";

function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    age: "",
    number: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ticket = urlParams.get("ticket");

    if (ticket) {
      verifyCASTicket(ticket);
    }
  }, []);

  const verifyCASTicket = async (ticket) => {
    try {
      const response = await fetch("http://localhost:5000/api/login/cas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket }),
      });

      const data = await response.json();
      if (data.success == true) {
        localStorage.setItem("authToken", data.token);
        navigate("/profile");
      } else if (data.message == "First times user need to sign up") {
        alert("First times user need to sign up");
      }
    } catch (error) {
      console.error("Error verifying CAS ticket:", error);
    }
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    setErrorMessage("");
    const endpoint = isSignup
      ? "http://localhost:5000/api/login/new"
      : "http://localhost:5000/api/login/old";

    if (!isSignup) {
      if (!recaptchaToken) {
        setErrorMessage("Please complete the reCAPTCHA.");
        return;
      }
    }

    const body = isSignup
      ? {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          age: user.age,
          number: user.number,
          password: user.password,
        }
      : {
          email: user.email,
          password: user.password,
          recaptchaToken,
        };
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success == true) {
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
          setRecaptchaToken(null);
        }
        if (isSignup) {
          navigate("/login");
        } else {
          localStorage.setItem("authToken", data.token);
          navigate("/profile");
        }
      } else {
        setErrorMessage(
          data.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage(
        "Unable to connect to the server. Please try again later."
      );
    }
  };

  const handleCASlogin = () => {
    const serviceUrl = "http://localhost:5173/login";
    const casLoginUrl = `https://login.iiit.ac.in/cas/login?service=${serviceUrl}`;
    window.location.href = casLoginUrl;
  };

  const handleSwitch = () => {
    setIsTransitioning(true);
    setErrorMessage("");
    setTimeout(() => {
      setIsSignup((prev) => !prev);
      setIsTransitioning(false);
      setUser({
        firstname: "",
        lastname: "",
        email: "",
        age: "",
        number: "",
        password: "",
      });
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div
        className={`form ${isSignup ? "signup" : ""} ${
          isTransitioning ? "transitioning" : ""
        }`}
      >
        {!isTransitioning && (
          <>
            <h2 className={`title ${isSignup ? "signup" : ""}`}>
              {isSignup ? "Signup" : "Login"}
            </h2>
            {isSignup && (
              <>
                <input
                  type="text"
                  name="firstname"
                  placeholder="First name"
                  value={user.firstname}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last name"
                  value={user.lastname}
                  onChange={handleInputChange}
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
                  placeholder="Number"
                  value={user.number}
                  onChange={handleInputChange}
                />
              </>
            )}
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleInputChange}
            />
            {!isSignup && (
              <div className="recaptcha-container">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LcL2csqAAAAAJSKNfmQsw9Rdg_y2Ui0zz5oHDff"
                  onChange={handleRecaptchaChange}
                />
              </div>
            )}

            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="submit" onClick={handleLogin}>
              {isSignup ? "Signup" : "Login"}
            </button>
            {!isSignup && (
              <button className="submit cas-login" onClick={handleCASlogin}>
                Login with CAS
              </button>
            )}
            <p>
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button className="switch" onClick={handleSwitch}>
                {isSignup ? "Login" : "Signup"}
              </button>
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Login;
