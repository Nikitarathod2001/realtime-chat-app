import React, { useEffect, useRef } from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';
import { useState } from 'react';
import api from '../services/api';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import useSocket from '../hooks/useSocket';
import { getPrivateMessages } from '../services/privateMessageService';
import { getUsers } from '../services/userService';
import UserList from '../components/UserList';
import {startConversation} from "../services/conversationService";

const ChatPage = () => {

  const navigate = useNavigate();

  const {user, logout} = useAuth();

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const[typingUser, setTypingUser] = useState(null);

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  const messagesEndRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);

  // Custom socket hook
  useSocket(
    user, 
    setOnlineUsers,
    setMessages,
    setTypingUser,
    typingTimeoutRef,
    currentConversation
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

    if(!currentConversation || !activeUser) {
      return;
    }

    socket.emit("private-message", {
      conversationId: currentConversation._id,
      receiverId: activeUser._id,
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

    if(!activeUser) {
      return;
    }

    if(!isTypingRef.current) {
      socket.emit(
        "typing",
        {
          username: user.username,
          userId: user._id,
          receiverId: activeUser._id
        }
      );

      isTypingRef.current = true;
    }

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(
        "stop-typing",
        {
          username: user.username,
          receiverId: activeUser._id
        }
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

  // Handle user click
  const handleUserClick = async (selectedUser) => {
    setActiveUser(selectedUser);

    setMessages([]);

    try {

      const data = await startConversation(selectedUser._id);

      setCurrentConversation(data.conversation);
      
    } catch (error) {
      console.log(error);
    }
  };

  // Scroll Into View
  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUser]);

  // Load private messages
  useEffect(() => {

    if(!currentConversation) {
      return;
    }

    const fetchMessages = async () => {

      try {

        const data = await getPrivateMessages(currentConversation._id);

        console.log(data.messages);
        console.log(user._id);

        setMessages(data.messages);
        
      } catch (error) {
        console.log(error);
      }

    };

    fetchMessages();

  }, [currentConversation]);

  // Load users
  useEffect(() => {

    const fetchUsers = async () => {
      try {

        const data = await getUsers();
        setUsers(data.users);
        
      } catch (error) {
        console.log(error);
      }
    };

    fetchUsers();

  }, []);

  return (
    <div className='max-w-7xl mx-auto px-3 md:px-5 py-5 bg-slate-800'>

      <div className='flex justify-between items-center mb-5'>

        <div>

          <p className='text-2xl text-white font-bold'>
            Welcome, 
            <span className='block sm:inline sm:ml-2'>
              {user?.username}
            </span>
          </p>

        </div>

        <button onClick={handleLogout}
          className='bg-rose-700 hover:bg-rose-800 text-white px-4 py-2 rounded-lg transition'
        >
          Logout
        </button>

      </div>

      <div className='flex flex-col md:flex-row gap-5 mt-5'>

        <div className='w-full md:w-72 border border-emerald-800 rounded-lg p-4 bg-emerald-950 shadow-md'>

          <UserList 
            users={users}
            onlineUsers={onlineUsers}
            activeUser={activeUser}
            handleUserClick={handleUserClick}
          />
          
        </div>   

        <div className='flex-1'>

          {
            !activeUser ? (
              <div className='h-[500px] flex items-center justify-center bg-white rounded-lg border-zinc-300'>

                <p className='text-gray-500'>
                  Select a user to start chatting
                </p>

              </div>
            ) : (
              <>

                <MessageList messages={messages}
                  user={user}
                  formatTime={formatTime}
                  messagesEndRef={messagesEndRef}
                  typingUser={typingUser}
                  activeUser={activeUser}
                />
              
                <MessageInput message={message}
                  handleTyping={handleTyping}
                  handleSendMessage={handleSendMessage}
                />

              </>
            )
          }

        </div>

      </div>
    </div>
  )
}

export default ChatPage
