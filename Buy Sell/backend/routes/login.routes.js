import express from "express";

import { LoginngIn, SigningIn, CASLogin } from "../controllers/login.controller.js";

const router = express.Router();

router.post("/old", LoginngIn);
router.post("/new", SigningIn);
router.post("/CAS",CASLogin);

export default router;
