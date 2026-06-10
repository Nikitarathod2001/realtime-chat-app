import onlineUsers from "./onlineUsers.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join Chat
    socket.on("join-chat", (userData) => {
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
    socket.on("send-message", (messageData) => {
      const message = {
        ...messageData,
        timestamp: new Date().toISOString(),
      };

      io.emit("receive-message", message);
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