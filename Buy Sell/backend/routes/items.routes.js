import express from "express";

import { AddItem, GetItems, YourItems, SingleItem } from "../controllers/items.controller.js";

const router = express.Router();

router.post("/add", AddItem);
router.get("/get", GetItems);
router.get("/your", YourItems);
router.get("/:id", SingleItem);

export default router;