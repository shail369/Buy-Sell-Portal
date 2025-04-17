import { User } from "../models/users.model.js";
import { verifyRecaptcha } from "../config/authenticate.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const CASLogin = async (req, res) => {
  const { ticket } = req.body;
  const serviceUrl = "http://localhost:5173/login";

  if (!ticket) {
    return res
      .status(400)
      .json({ success: false, message: "CAS ticket is missing" });
  }

  try {
    const casValidationUrl = `https://login.iiit.ac.in/cas/serviceValidate?service=${encodeURIComponent(
      serviceUrl
    )}&ticket=${ticket}`;

    const response = await fetch(casValidationUrl);
    const casData = await response.text();

    const match = casData.match(/<cas:user>(.*?)<\/cas:user>/);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "CAS authentication failed" });
    }

    const email = match[1];

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "First times user need to sign up",
      });
    }
    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "CAS Login successful",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export const LoginngIn = async (req, res) => {
  const captcha = await verifyRecaptcha(req);
  if (captcha.success == false) {
    return res.status(500).json({
      success: false,
      message: captcha.message,
    });
  }
  const person = req.body;
  if (!person || !person.email || !person.password) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the details",
    });
  }
  try {
    const user = await User.findOne({ email: person.email });
    if (user && (await bcrypt.compare(person.password, user.password))) {
      const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error" + error.message,
    });
  }
};

export const SigningIn = async (req, res) => {
  const person = req.body;
  if (
    !person ||
    !person.firstname ||
    !person.lastname ||
    !person.email ||
    !person.password ||
    !person.age ||
    !person.number
  ) {
    return res.status(400).json({
      success: false,
      message: "PLease provide all the details",
    });
  }
  if (!person.email.endsWith(".iiit.ac.in")) {
    return res.status(400).json({
      success: false,
      message: "Email must end with '.iiit.ac.in'",
    });
  }
  try {
    const existingUser = await User.findOne({ email: person.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(person.password, 10);
    person.password = hashedPassword;
    const newUser = new User(person);
    await newUser.save();
    return res.status(200).json({
      success: true,
      message: "Signup successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error " + error.message,
    });
  }
};
