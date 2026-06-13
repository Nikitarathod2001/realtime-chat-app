import React, { useEffect, useRef } from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';
import { useState } from 'react';
import api from '../services/api';
import ConnectionStatus from '../components/ConnectionStatus';
import OnlineUsers from '../components/OnlineUsers';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

const ChatPage = () => {

  const navigate = useNavigate();

  const {user, logout} = useAuth();

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const[typingUser, setTypingUser] = useState("");

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const messagesEndRef = useRef(null);

  const [connectionStatus, setConnectionStatus] = useState("Connecting...");

  // Handler Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Handle Sending messages
  const handleSendMessage = () => {
    if(!message.trim()) {
      return;
    }

    socket.emit("send-message", {
      text: message,
      senderId: user._id,
      senderName: user.username
    });

    setMessage("");
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp)
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
  };

  // Handle typing event
  const handleTyping = (e) => {
    setMessage(e.target.value);

    if(!isTypingRef.current) {
      socket.emit(
        "typing",
        user.username
      );

      isTypingRef.current = true;
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(
        "stop-typing",
        user.username
      );

      isTypingRef.current = false;
    }, 1000);
  };

  // Load messages
  const loadMessages = async () => {
    try {

      const response = await api.get("/messages");

      setMessages(response.data.messages);
      
    } catch (error) {
      console.log(error);
    }
  };

  // Scroll Function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if(!user) {
      return;
    }
    
    // Socket connection
    socket.connect();

    // Join chat after connection
    socket.on("connect", () => {
      console.log(`Connected: ${socket.id}`);
      setConnectionStatus("Connected");

      socket.emit(
        "join-chat",
        {
          userId: user._id,
          username: user.username,
        }
      );
    });

    // Receive online users
    socket.on(
      "online-users",
      (users) => {
        setOnlineUsers(users);
      }
    );

    // Receive messages
    socket.on("receive-message", (newMessage) => {
      setMessages((prev) => [
        ...prev,
        newMessage
      ]);
    });

    // Receive user-typing event
    socket.on(
      "user-typing",
      (username) => {
        setTypingUser(username);
      }
    );

    // Receive user-stop-typing event
    socket.on(
      "user-stop-typing",
      () => {
        setTypingUser("");
      }
    );

    socket.on("disconnect", () => {
      setConnectionStatus("Disconnected");
    });

    socket.io.on("reconnect", () => {
      setConnectionStatus("Connected");
    });

    return () => {
      socket.off("online-users");
      socket.off("receive-message");

      socket.off("user-typing");
      socket.off("user-stop-typing");

      if(typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      socket.off("connect");
      socket.off("disconnect");
      socket.off("reconnect");
      socket.disconnect();
    };
  }, [user]);

  // Load messages 
  useEffect(() => {
    loadMessages();
  }, []);

  // Scroll Into View
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      <h1>Chat Page</h1>

      <button onClick={handleLogout}>
        Logout
      </button>

      <ConnectionStatus connectionStatus={connectionStatus}/>

      <OnlineUsers onlineUsers={onlineUsers} user={user}/>   

      <MessageList messages={messages}
        user={user}
        formatTime={formatTime}
        messagesEndRef={messagesEndRef}
        typingUser={typingUser}
      />

      <br />
      <MessageInput message={message}
        handleTyping={handleTyping}
        handleSendMessage={handleSendMessage}
      />
    </div>
  )
}

export default ChatPage
