import onlineUsers from "./onlineUsers.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

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