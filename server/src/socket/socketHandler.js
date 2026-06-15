import Message from "../models/Message.js";
import onlineUsers from "./onlineUsers.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const socketHandler = (io) => {

  io.use(async (socket, next) => {
    try {

      const token = socket.handshake.auth?.token;
      if(!token) {
        return next(
          new Error("Authentication required")
        );
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if(!user) {
        return next(
          new Error("User not found")
        );
      }

      socket.user = user;
      next();
      
    } catch (error) {
      next(
        new Error("Invalid token")
      );
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join Chat
    socket.on("join-chat", () => {
      const userData = {
        userId: socket.user._id,
        username: socket.user.username
      };
      
      onlineUsers.set(
        socket.id,
        userData
      );

      io.emit(
        "online-users",
        Array.from(onlineUsers.values())
      );

      console.log(`${userData.username} joined chat`);
    });

    // Receive messages and broadcast them
    socket.on("send-message", async (messageData) => {
      try {

        const savedMessage = await Message.create({
          text: messageData.text,
          senderId: messageData.senderId,
          senderName: messageData.senderName,
          timestamp: new Date(),
        });

        io.emit(
          "receive-message",
          savedMessage
        );
        
      } catch (error) {
        console.log(error);
      }
    });

    // Typing event
    socket.on("typing", (username) => {
      socket.broadcast.emit(
        "user-typing",
        username
      );
    });

    // Stop-typing event
    socket.on("stop-typing", (username) => {
      socket.broadcast.emit(
        "user-stop-typing",
        username
      );
    });

    // Disconnect
    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);

      io.emit(
        "online-users",
        Array.from(onlineUsers.values())
      );

      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default socketHandler;