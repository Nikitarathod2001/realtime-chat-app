import express from "express";
import { getConversations, startConversation } from "../controllers/conversationController.js";
import {authUser} from "../middlewares/authMiddleware.js";

const conversationRouter = express.Router();

conversationRouter.post("/start", authUser, startConversation);
conversationRouter.get("/", authUser, getConversations);

export default conversationRouter;