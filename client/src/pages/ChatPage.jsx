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
    <div className='max-w-7xl mx-auto px-3 md:px-5 py-5'>

      <div className='flex justify-between items-center mb-5'>

        <div>

          <h1 className='text-2xl font-bold text-hray-800'>
            Global Chat Room
          </h1>

          <p className='text-sm text-gray-500'>
            Welcome, {user?.username}
          </p>

        </div>

        <button onClick={handleLogout}
          className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition'
        >
          Logout
        </button>

      </div>

      <ConnectionStatus connectionStatus={connectionStatus}/>

      <div className='flex flex-col md:flex-row gap-5 mt-5'>

        <div className='w-full md:w-72 border rounded-lg p-4 bg-white shadow-md'>

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
