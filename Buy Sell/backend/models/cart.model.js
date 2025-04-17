import mongoose from "mongoose";

import { connect_with_db_cart } from "../config/db.js";

let Cart = null;

const cartSchema = new mongoose.Schema({
  itemid: {
    type: String,
    required: true,
  }, 
  buyerid: {
    type: String,
    required: true,
  },
  sellerid: {
    type: String,
    required: true,
  },
});

cartSchema.index({ itemid: 1, buyerid: 1 }, { unique: true });

export const InitializeCart = async () => {
  try {
    const conn_cart = await connect_with_db_cart();
    Cart = conn_cart.model("Cart", cartSchema);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { Cart };
