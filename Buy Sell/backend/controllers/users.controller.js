import bcrypt from "bcrypt";

import { User } from "../models/users.model.js";
import { Protected } from "../config/authenticate.js";

export const GetDetails = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }
  try {
    const user = await User.findOne({ email: verify.user.email });
    if (user) {
      return res.status(200).json({
        success: true,
        message: "Details fetched successfully",
        user: user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

export const ChangePassword = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }
  const person = req.body;
  if (!person || !person.email || !person.password || !person.newpassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the details",
    });
  }
  try {
    const user = await User.findOne({ email: person.email });
    if (user && (await bcrypt.compare(person.password, user.password))) {
      const hashedPassword = await bcrypt.hash(person.newpassword, 10);
      await User.updateOne(
        { email: person.email },
        { password: hashedPassword }
      );
      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
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

export const ChangeDetails = async (req, res) => {
  const verify = await Protected(req);
  if (verify.success === false) {
    return res.status(verify.status).json({
      success: false,
      message: verify.message,
    });
  }
  const person = req.body;

  if (!person || !person.email) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the details",
    });
  }

  try {
    const updateFields = {};
    if (person.firstname) {
      updateFields.firstname = person.firstname;
    }
    if (person.lastname) {
      updateFields.lastname = person.lastname;
    }
    if (person.age) {
      updateFields.age = person.age;
    }
    if (person.number) {
      updateFields.number = person.number;
    }

    await User.updateOne({ email: person.email }, { $set: updateFields });

    return res.status(200).json({
      success: true,
      message: "Details changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};
