import express from "express";
import { initiateChat, sendMessage} from "../controllers/chatbot.controller.js";

const router = express.Router();

router.get('/initiate', initiateChat);
router.post('/message', sendMessage);
// router.delete('/history', clearHistory);

export default router;