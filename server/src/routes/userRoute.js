import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import {authUser} from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/", authUser, getAllUsers);

export default userRouter;