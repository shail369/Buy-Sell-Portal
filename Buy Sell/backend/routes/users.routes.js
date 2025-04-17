import express from "express";

import { GetDetails, ChangePassword, ChangeDetails } from "../controllers/users.controller.js";

const router = express.Router();

router.post("/details", ChangeDetails);
router.post("/password", ChangePassword);
router.get("/me", GetDetails);

export default router;