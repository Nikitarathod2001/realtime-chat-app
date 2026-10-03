import express from "express";
import { getMessages, sendMessage } from "../controllers/messageController.js";
import protect from "../middlewares/authMiddleware.js";


const messageRouter = express.Router();

messageRouter.get("/:userId", protect, getMessages);
messageRouter.post("/", protect, sendMessage);

export default messageRouter;