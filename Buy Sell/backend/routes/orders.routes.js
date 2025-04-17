import express from "express";

import {
  PlaceOrder,
  GetYourPendingOrders,
  GetYourDeliveredOrders,
  GetLeftOrders,
  GetDeliveredOrders,
  VerifyOrder,
  ChangeOTP
} from "../controllers/orders.controller.js";

const router = express.Router();

router.post("/place", PlaceOrder);
router.get("/yourdelivered", GetYourDeliveredOrders);
router.get("/yourpending", GetYourPendingOrders);
router.get("/left", GetLeftOrders);
router.get("/delivered", GetDeliveredOrders);
router.post("/verify", VerifyOrder);
router.post("/changeotp", ChangeOTP);

export default router;
