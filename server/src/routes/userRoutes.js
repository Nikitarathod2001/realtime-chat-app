import express from "express";
import { getCurrentUser, getUsers, getUserProfile, updateProfile } from "../controllers/userController.js";
import protect from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const userRouter = express.Router();

userRouter.get("/profile", protect, getCurrentUser);
userRouter.get("/", protect, getUsers);
userRouter.patch("/profile", protect, upload.single("profilePicture") , updateProfile);
userRouter.get("/:userId", protect, getUserProfile);

export default userRouter;