import React, {createContext, useContext, useEffect, useState} from "react";

import { useAuth } from "./AuthContext";
import socket from "../services/socket";


const SocketContext = createContext();

export const SocketProvider = ({children}) => {
  const {token} = useAuth();

  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [messages, setMessages] = useState([]);

  const [typingUsers, setTypingUsers] = useState(new Set());

  useEffect(() => {
    if(!token) {
      return;
    }

    socket.auth = {token};

    socket.connect();

    const handleConnect = () => {
      console.log("Socket connected: ", socket.id);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, [token]);

  // Receive message sent by current user
  useEffect(() => {
    const handleMessageSent = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("message-sent", handleMessageSent);

    return () => {
      socket.off("message-sent", handleMessageSent);
    };
  }, []);

  // Receive message sent by another user
  useEffect(() => {
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, []);

  // Initial online users
  useEffect(() => {
    const handleOnlineUsers = (users) => {
      setOnlineUsers(new Set(users));
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, []);

  // User becomes online
  useEffect(() => {
    const handleUserOnline = (userId) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.add(userId);
        return updated;
      });
    };

    socket.on("user-online", handleUserOnline);

    return () => {
      socket.off("user-online", handleUserOnline);
    };
  }, []);

  // User becomes offline
  useEffect(() => {
    const handleUserOffline = (userId) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    };

    socket.on("user-offline", handleUserOffline);

    return () => {
      socket.off("user-offline", handleUserOffline);
    };
  }, []);

  const sendMessage = (receiver, content) => {
    socket.emit("send-message", {
      receiver, content,
    });
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const loadMessages = (messages) => {
    setMessages(messages);
  };

  // User typing
  useEffect(() => {
    const handleUserTyping = ({userId}) => {
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        updated.add(userId);
        console.log("TYPING USERS AFTER ADD: ", [...updated]);
        return updated;
      });
    };

    socket.on("user-typing", handleUserTyping);

    return () => {
      socket.off("user-typing", handleUserTyping);
    };
  }, []);

  // User stop typing
  useEffect(() => {
    const handleUserStopTyping = ({userId}) => {
      setTypingUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    };

    socket.on("user-stop-typing", handleUserStopTyping);

    return () => {
      socket.off("user-stop-typing", handleUserStopTyping);
    };
  }, []);

  // Typing function
  const startTyping = (receiverId) => {
    socket.emit("typing", receiverId);
  };

  // Stop typing function
  const stopTyping = (receiverId) => {
    socket.emit("stop-typing", receiverId);
  };

  // Mark messages read event
  const markMessagesRead = (senderId) => {
    socket.emit("mark-messages-read", senderId);
  };

  // Handle mark messages
  useEffect(() => {
    const handleMessagesRead = ({readerId}) => {
      setMessages((prev) => 
        prev.map((message) => {
          if(message?.receiver?._id && String(message.receiver._id) === String(readerId)) {
            return {
              ...message,
              status: "read",
            };
          }

          return message;
        })
      );
    };

    socket.on("messages-read", handleMessagesRead);

    return () => {
      socket.off("messages-read", handleMessagesRead);
    };
  }, []);

  return (
    <SocketContext.Provider value={{
      onlineUsers, messages, sendMessage, clearMessages, loadMessages, typingUsers, startTyping, stopTyping, markMessagesRead
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if(!context) {
    throw new Error("useSocket must be used inside SocketProvider");
  }

  return context;
};

