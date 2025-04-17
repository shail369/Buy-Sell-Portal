import express from "express";

import { AddReview, ItemReviews, UserReviews } from "../controllers/reviews.controller.js";

const router = express.Router();

router.post("/add", AddReview);
router.get("/user", UserReviews);
router.get("/:id", ItemReviews);

export default router;