import Message from "../models/Message.js";
import onlineUsers from "./onlineUsers.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import PrivateMessage from "../models/PrivateMessageModel.js";
import Conversation from "../models/Conversation.js";

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
      
      onlineUsers.set(
        socket.user._id.toString(),
        socket.id,
      );

      io.emit(
        "online-users",
        Array.from(onlineUsers.values())
      );

    });

     // Private Message
    socket.on("private-message", async (data) => {

      const newMessage = await PrivateMessage.create({
        conversationId: data.conversationId,
        sender: socket.user._id,
        receiver: data.receiverId,
        text: data.text,
      });

      await Conversation.findByIdAndUpdate(
        data.conversationId,
        {
          updatedAt: new Date(),
        }
      );

      await newMessage.populate(
        "sender",
        "username"
      );

      const receiverSocketId = onlineUsers.get(data.receiverId);

      if(receiverSocketId) {
        io.to(receiverSocketId).emit(
          "receive-private-message",
          newMessage
        );
      }

      socket.emit(
        "receive-private-message",
        newMessage
      );

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
      onlineUsers.delete(
        socket.user._id.toString()
      );

      io.emit(
        "online-users",
        Array.from(onlineUsers.values())
      );

      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export default socketHandler;