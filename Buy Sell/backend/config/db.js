import mongoose from "mongoose";

let conn_users = null;
let conn_items = null;
let conn_cart = null;
let conn_orders = null;
let conn_reviews = null;

export const connect_with_db_users = async () => {
  try {
    conn_users = await mongoose.createConnection(process.env.MONGO_URI_USERS);
    return conn_users;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export const connect_with_db_items = async () => {
  try {
    conn_items = await mongoose.createConnection(process.env.MONGO_URI_ITEMS);
    return conn_items;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export const connect_with_db_cart = async () => {
  try {
    conn_cart = await mongoose.createConnection(process.env.MONGO_URI_CART);
    return conn_cart;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export const connect_with_db_orders = async () => {
  try {
    conn_orders = await mongoose.createConnection(process.env.MONGO_URI_ORDERS);
    return conn_orders;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export const connect_with_db_reviews = async () => {
  try {
    conn_reviews = await mongoose.createConnection(process.env.MONGO_URI_REVIEWS);
    return conn_reviews;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { conn_users, conn_items, conn_cart, conn_orders, conn_reviews };
