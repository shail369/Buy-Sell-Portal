import mongoose from "mongoose";

import { connect_with_db_users } from "../config/db.js";

let User = null;

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  reviews: {
    type: String,
    required: false,
  },
});

export const InitializeUsers = async () => {
  try {
    const conn_users = await connect_with_db_users();
    User = conn_users.model("User", userSchema);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { User };
