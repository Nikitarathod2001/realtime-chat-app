import React from 'react';
import {useAuth} from "../context/AuthContext";
import api from "../services/api";
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useSocket } from '../context/SocketContext';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import EmptyChat from '../components/EmptyChat';

const Chat = () => {

  const {user, logout} = useAuth();

  const {
    onlineUsers, messages, sendMessage, loadMessages,
    typingUsers, startTyping, stopTyping, markMessagesRead
  } = useSocket();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  
  const [messageInput, setMessageInput] = useState("");

  const messagesEndRef = useRef(null);

  const typingTimeoutRef = useRef(null);

  const isSelectedUserTyping = selectedUser && typingUsers.has(selectedUser._id);

  // Fetch Users

  useEffect(() => {
    const fetchUsers = async () => {
      try {

        const response = await api.get("/users");

        setUsers(response.data.users);
        
      } catch (error) {
        console.error("Failed to fetch users: ", error);
      }
    };

    fetchUsers();
  }, []);

  // Search Users
  const filteredUsers = users.filter((item) => 
    item.username.toLowerCase().includes(search.toLowerCase())
  );

  // Send message
  const handleSendMessage = () => {
    if(!messageInput.trim() || !selectedUser) {
      return;
    }

    sendMessage(
      selectedUser._id,
      messageInput.trim()
    );

    stopTyping(selectedUser._id);

    if(typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setMessageInput("");
  };

  // Fetch old messages
  const fetchMessages = async () => {
    try {

      const response = await api.get(`/messages/${selectedUser._id}`);

      loadMessages(response.data.messages);

      markMessagesRead(selectedUser._id);
      
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  // Call fetchMessages function
  useEffect(() => {
    if(!selectedUser) {
      return;
    }

    fetchMessages();
  }, [selectedUser]);

  // Conversation Messages
  const conversationMessages = messages.filter((message) => {
    if(!message?.sender || !message?.receiver || !selectedUser) {
      return false;
    }

    const senderId = String(message.sender._id);
    const receiverId = String(message.receiver._id);
    const selectedId = String(selectedUser._id);

    return (
      senderId === selectedId || receiverId === selectedId
    );
  });

  // Scroll Function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Automatically scroll
  useEffect(() => {
    if(!selectedUser) {
      return;
    }

    scrollToBottom();
  }, [conversationMessages, selectedUser]);

  // Handle Typing
  const handleTyping = (e) => {
    const value = e.target.value;

    setMessageInput(value);

    if(!selectedUser) {
      return;
    }

    // If input is empty, immediately stop typing
    if(!value.trim()) {
      if(typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      stopTyping(selectedUser._id);
      return;
    }

    // Tell receiver that user started typing
    startTyping(selectedUser._id);

    // Clear previous timeout
    if(typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Wait before declaring "Stopped typing"
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(selectedUser._id);
    }, 1000);
  };

  // Clean up typing timer
  useEffect(() => {
    return () => {
      if(typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, []);

  // Stop typing when changing users
  useEffect(() => {
    return () => {
      if(selectedUser) {
        stopTyping(selectedUser._id);
      }

      if(typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [selectedUser]);

  // Handle selected user
  const handleSelectedUser = (item) => {
    if(selectedUser) {
      stopTyping(selectedUser._id);
    }

    if(typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setMessageInput("");
    setSelectedUser(item);
  };

  // Mark newly received messages as read
  useEffect(() => {
    if(!selectedUser) {
      return;
    }

    const unreadMessages = conversationMessages.filter((message) => String(message.sender._id) === String(selectedUser._id) && message.status !== "read");

    if(unreadMessages.length > 0) {
      markMessagesRead(selectedUser._id);
    }
  }, [conversationMessages, selectedUser]);

  return (
    <div className='h-screen bg-gray-100 flex overflow-hidden'>

      {/* Sidebar */}
      <Sidebar user={user}
        logout={logout}
        search={search}
        setSearch={setSearch}
        filteredUsers={filteredUsers}
        selectedUser={selectedUser}
        handleSelectedUser={handleSelectedUser}
        onlineUsers={onlineUsers}
      />

      {/* Main Chat Area */}
      <main className={`flex-1 flex flex-col min-w-0 ${selectedUser ? "flex" : "hidden md:flex"}`}>

        {
          selectedUser ? (
            <>
              {/* Chat Header */}
              <ChatHeader selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                isSelectedUserTyping={isSelectedUserTyping}
                onlineUsers={onlineUsers}
              />

              {/* Messages Area */}
              <MessageList conversationMessages={conversationMessages}
                selectedUser={selectedUser}
                user={user}
                isSelectedTyping={isSelectedUserTyping}
                messagesEndRef={messagesEndRef}
              />

              {/* Message Input */}
              <MessageInput messageInput={messageInput}
                handleTyping={handleTyping}
                handleSendMessage={handleSendMessage}
              />
            </>
          ) : (
            // Empty Chat State
            <EmptyChat/>
          )
        }

      </main>

    </div>
  )
}

export default Chat
