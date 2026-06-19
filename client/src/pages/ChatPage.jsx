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
import { getConversations } from '../services/conversationService';
import ConversationList from '../components/ConversationList';
import { getPrivateMessages } from '../services/privateMessageService';

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

  const [conversations, setConversations] = useState([]);

  const [activeConversation, setActiveConversation] = useState(null);

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

    const receiver = activeConversation.participants.find((participant) => participant._id !== user._id);

    socket.emit("private-message", {
      conversationId: activeConversation._id,
      receiverId: receiver._id,
      text: message
    });

    setMessage("");
  };

  // Format time
  const formatTime = (date) => {
    return new Date(date)
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

  // Scroll Function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Scroll Into View
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {

        const data = await getConversations();
        setConversations(data.conversations);
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchConversations();
  }, []);

  // Load private messages
  useEffect(() => {

    if(!activeConversation) {
      return;
    }

    const fetchMessages = async () => {

      try {

        const data = await getPrivateMessages(activeConversation._id);

        setMessages(data.messages);
        
      } catch (error) {
        console.log(error);
      }

    };

    fetchMessages();

  }, [activeConversation]);

  return (
    <div className='max-w-7xl mx-auto px-3 md:px-5 py-5'>

      <div className='flex justify-between items-center mb-5'>

        <div>

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
          <ConversationList 
            conversations={conversations}   
            user={user}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
          />
          
        </div>   

        <div className='flex-1'>

          <MessageList messages={messages}
            user={user}
            formatTime={formatTime}
            messagesEndRef={messagesEndRef}
            typingUser={typingUser}
            activeConversation={activeConversation}
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
