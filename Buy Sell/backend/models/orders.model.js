import mongoose from "mongoose";

import { connect_with_db_orders } from "../config/db.js";

let Order = null;

const ordersSchema = new mongoose.Schema({
    total: {
        type: Number,
        required: true,
    },
    buyerid: {
        type: String,
        required: true,
    },
    itemid: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Pending",
    }, 
});

export const InitializeOrders = async () => {
  try {
    const conn_orders = await connect_with_db_orders();
    Order = conn_orders.model("Orders", ordersSchema);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { Order };
