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
import useSocket from '../hooks/useSocket';

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

  // Custom socket hook
  useSocket(
    user, 
    setOnlineUsers,
    setMessages,
    setConnectionStatus,
    setTypingUser,
    typingTimeoutRef
  );

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

  // Load messages 
  useEffect(() => {
    loadMessages();
  }, []);

  // Scroll Into View
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className='max-w-7xl mx-auto p-5'>

      <button onClick={handleLogout}>
        Logout
      </button>

      <ConnectionStatus connectionStatus={connectionStatus}/>

      <div className='flex gap-5 mt-5'>

        <div className='w-64 border rounded-lg p-4 bg-white shadow-sm'>

          <OnlineUsers onlineUsers={onlineUsers} user={user}/>  
          
        </div>   

        <div className='flex-1'>

          <MessageList messages={messages}
            user={user}
            formatTime={formatTime}
            messagesEndRef={messagesEndRef}
            typingUser={typingUser}
          />
        
          <MessageInput message={message}
            handleTyping={handleTyping}
            handleSendMessage={handleSendMessage}
          />

        </div>

      </div>
    </div>
  )
}

export default ChatPage
