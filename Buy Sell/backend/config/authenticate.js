import jwt from "jsonwebtoken";

import { User } from "../models/users.model.js";

export const Protected = async (req) => {
  if (!req.headers || !req.headers.authorization) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }
  const token = req.headers.authorization;
  let decodeduser;
  if (!token) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }
  try {
    decodeduser = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return {
      success: false,
      message: "Invalid token",
    };
  }
  try {
    const user = await User.findOne({ email: decodeduser.email });
    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }
    return {
      success: true,
      message: "User found",
      user: user,
    };
  } catch (error) {
    return {
      success: false,
      message: "Internal server error" + error,
    };
  }
};

export const verifyRecaptcha = async (req) => {
  if (req && req.body && req.body.recaptchaToken) {
    const token = req.body.recaptchaToken;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_KEY}&response=${token}`;
    const response = await fetch(url, { method: "POST" });
    const data = await response.json();
    if (data.success == true) {
      return {
        success: true,
        message: "Captcha verified successfully",
      };
    } else {
      return {
        success: false,
        message: "internal server error",
      };
    }
  } else {
    return {
      success: false,
      message: "Missing details",
    };
  }
};
