import mongoose from "mongoose";

import { connect_with_db_items } from "../config/db.js";

let Item = null;

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  seller: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  colour: {
    type: String,
    required: false,
  },
  reviews: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

export const InitializeItems = async () => {
  try {
    const conn_items = await connect_with_db_items();
    Item = conn_items.model("Item", itemSchema);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { Item };
