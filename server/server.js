import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import authRouter from "./src/routes/authRoute.js";
import socketHandler from "./src/socket/socketHandler.js";
import messageRouter from "./src/routes/messageRoute.js";
import conversationRouter from "./src/routes/conversationRoute.js";
import privateMessageRouter from "./src/routes/privateMessageRoute.js";
import userRouter from "./src/routes/userRoute.js";


connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }
});

socketHandler(io);

const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(express.json());


// API endpoints
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);
app.use("/api/conversations", conversationRouter);
app.use("/api/private-messages", privateMessageRouter);
app.use("/api/users", userRouter);


app.get("/", (req, res) => {
  res.send("Server is running");
});


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});