import express from "express";
import { getPrivateMessages } from "../controllers/privateMessageController.js";
import {authUser} from "../middlewares/authMiddleware.js";

const privateMessageRouter = express.Router();

privateMessageRouter.get("/:conversationId", authUser, getPrivateMessages);

export default privateMessageRouter;