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
  currentConversation
) => {

  useEffect(() => {

    if (!user) {
      return;
    }

    const token = localStorage.getItem("chat-token");

    socket.auth = {token};

    // Socket connection
    socket.connect();

    // Join chat after connection
    socket.on("connect", () => {
      console.log(`Connected: ${socket.id}`);
      setConnectionStatus("Connected");

      socket.emit("join-chat");
    });

    // Receive online users
    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    // Remove old conversation
    socket.off("receive-private-message");

    // Receive private messages
    socket.on(
      "receive-private-message",
      (message) => {

        if(currentConversation && message.conversationId === currentConversation._id) {
          setMessages(prev => [...prev, message])
        }
        
      }
    );

    // Receive user-typing event
    socket.on("user-typing", (data) => {
      setTypingUser(data);
    });

    // Receive user-stop-typing event
    socket.on("user-stop-typing", () => {
      setTypingUser(null);
    });

    socket.on("disconnect", () => {
      setConnectionStatus("Disconnected");
    });

    socket.io.on("reconnect", () => {
      setConnectionStatus("Connected");
    });

    socket.on("connect_error", (error) => {
      console.log(error.message);

      if(error.message === "Invalid token") {
        localStorage.removeItem("chat-token");
      }
    });

    return () => {
    socket.off("online-users");
    socket.off("receive-private-message");

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
    
  }, [user, currentConversation]);

};

export default useSocket;
