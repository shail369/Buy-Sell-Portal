import express from "express";

import { AddtoCart, RemovefromCart, GetCart, ClearCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add/:id",AddtoCart);
router.post("/remove",RemovefromCart);
router.get("/get",GetCart);
router.get("/clear",ClearCart);

export default router;