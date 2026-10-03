import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";


const onlineUsers = new Map();

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    }
  });

  // Socket authentication
  io.use((socket, next) => {
    try {

      const token = socket.handshake.auth.token;

      if(!token) {
        return next(new Error("Authentication required"));
      }

      const decodedToken = jwt.verify(
        token, process.env.JWT_SECRET
      );

      socket.userId = decodedToken.userId;

      next();
      
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  // Socket connection
  io.on("connection", (socket) => {
    console.log("Socket connected: ", socket.id);

    const userId = socket.userId;

    const wasOffline = !onlineUsers.has(userId);

    if(!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    // Send currently online users to this user
    socket.emit("online-users", Array.from(onlineUsers.keys()));

    // Tell other users that this user is online
    if(wasOffline) {
      socket.broadcast.emit("user-online", userId);
    }

    console.log("Online user: ", userId);

    // Send message
    socket.on("send-message", async (data) => {
      try {

        const {receiver, content} = data;

        if(!receiver || !content?.trim()) {
          return;
        }

        const message = await Message.create({
          sender: socket.userId,
          receiver,
          content: content.trim(),
        });

        const receiverSockets = onlineUsers.get(receiver);

        if(receiverSockets && receiverSockets.size > 0) {
          message.status = "delivered";
          await message.save();
        }

        const populatedMessage = await message.populate([
          {
            path: "sender",
            select: "username profilePicture",
          },
          {
            path: "receiver",
            select: "username profilePicture",
          }
        ]);

        // Send message to the receiver
        if(receiverSockets && receiverSockets.size > 0) {
          receiverSockets.forEach((socketId) => {
            io.to(socketId).emit(
              "new-message", populatedMessage
            );
          });
        }

        // Send message back to sender
        socket.emit(
          "message-sent", populatedMessage
        );
        
      } catch (error) {
        console.error("Send message error: ", error);
      }
    });

    // Typing event
    socket.on("typing", (receiverId) => {
      const receiverSockets = onlineUsers.get(receiverId);

      if(!receiverSockets) {
        return;
      }

      receiverSockets.forEach((socketId) => {
        io.to(socketId).emit("user-typing", {
          userId: socket.userId,
        });
      });
    });

    // Stop-typing event
    socket.on("stop-typing", (receiverId) => {
      const receiverSockets = onlineUsers.get(receiverId);

      if(!receiverSockets) {
        return;
      }

      receiverSockets.forEach((socketId) => {
        io.to(socketId).emit("user-stop-typing", {
          userId: socket.userId,
        });
      });
    });

    // Mark messages read
    socket.on("mark-messages-read", async (senderId) => {
      try {

        const messages = await Message.find({
          sender: senderId,
          receiver: socket.userId,
          status: {$ne: "read"},
        });

        if(messages.length === 0) {
          return;
        }

        await Message.updateMany(
          {
            sender: senderId,
            receiver: socket.userId,
            status: {$ne: "read"},
          },
          {
            $set: {
              status: "read",
            },
          }
        );

        const senderSockets = onlineUsers.get(senderId);

        if(senderSockets) {
          senderSockets.forEach((socketId) => {
            io.to(socketId).emit("messages-read", {
              readerId: socket.userId,
            })
          });
        }

        console.log(`Messages from ${senderId} marked as read by ${socket.userId}`);
        
      } catch (error) {
        console.error("Mark messages as read error: ", error);
      }
    });

    // Disconnect
    socket.on("disconnet", () => {
      const userSockets = onlineUsers.get(userId);

      if(!userSockets) {
        return;
      }

      userSockets.delete(socket.id);

      if(userSockets.size === 0) {
        onlineUsers.delete(userId);

        socket.broadcast.emit(
          "user-offline", userId
        );
      }

      console.log("User disconnected: ", socket.id);
    });
  });

  return io;
};

export default setupSocket;