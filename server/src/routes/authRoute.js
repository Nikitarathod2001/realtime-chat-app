import express from "express";
import { getProfile, loginUser, registerUser } from "../controllers/authController.js";
import { authUser } from "../middlewares/authMiddleware.js";


const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile", authUser, getProfile);

export default authRouter;