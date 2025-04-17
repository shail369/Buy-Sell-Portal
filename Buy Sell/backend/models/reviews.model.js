import mongoose from "mongoose";

import { connect_with_db_reviews } from "../config/db.js";

let Reviews = null;

const reviewsSchema = new mongoose.Schema({
  itemid: {
    type: String,
    required: true,
  },
  reviewerid: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

reviewsSchema.index({ itemid: 1, reviewerid: 1 }, { unique: true });

export const InitializeReviews = async () => {
  try {
    const conn_reviews = await connect_with_db_reviews();
    Reviews = conn_reviews.model("Reviews", reviewsSchema);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { Reviews };
