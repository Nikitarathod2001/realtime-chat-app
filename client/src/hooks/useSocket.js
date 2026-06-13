import { useEffect } from "react";
import socket from "../socket/socket";
import React from "react";

const useSocket = (
  user,
  setOnlineUsers,
  setMessages,
  setConnectionStatus,
  setTypingUser,
  typingTimeoutRef,
) => {

  useEffect(() => {

    if (!user) {
      return;
    }

    // Socket connection
    socket.connect();

    // Join chat after connection
    socket.on("connect", () => {
      console.log(`Connected: ${socket.id}`);
      setConnectionStatus("Connected");

      socket.emit("join-chat", {
        userId: user._id,
        username: user.username,
      });
    });

    // Receive online users
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    // Receive messages
    socket.on("receive-message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // Receive user-typing event
    socket.on("user-typing", (username) => {
      setTypingUser(username);
    });

    // Receive user-stop-typing event
    socket.on("user-stop-typing", () => {
      setTypingUser("");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("Disconnected");
    });

    socket.io.on("reconnect", () => {
      setConnectionStatus("Connected");
    });
  }, [user]);

  return () => {
    socket.off("online-users");
    socket.off("receive-message");

    socket.off("user-typing");
    socket.off("user-stop-typing");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.off("connect");
    socket.off("disconnect");
    socket.off("reconnect");
    socket.disconnect();
  };
};

export default useSocket;
