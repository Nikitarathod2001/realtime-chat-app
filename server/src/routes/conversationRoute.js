import express from "express";
import { startConversation } from "../controllers/conversationController.js";
import {authUser} from "../middlewares/authMiddleware.js";

const conversationRouter = express.Router();

conversationRouter.post("/start", authUser, startConversation);

export default conversationRouter;