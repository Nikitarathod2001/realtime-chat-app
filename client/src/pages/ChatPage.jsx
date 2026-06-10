import React, { useEffect } from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';
import { useState } from 'react';

const ChatPage = () => {

  const navigate = useNavigate();

  const {user, logout} = useAuth();

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

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

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log(`Connected: ${socket.id}`);

      socket.emit(
        "join-chat",
        {
          userId: user._id,
          username: user.username,
        }
      );
    });

    socket.on(
      "online-users",
      (users) => {
        setOnlineUsers(users);
      }
    );

    socket.on("receive-message", (newMessage) => {
      setMessages((prev) => [
        ...prev,
        newMessage
      ]);
    });

    return () => {
      socket.off("online-users");
      socket.off("receive-message");
      
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Chat Page</h1>

      <h2>
        {user?.username}
      </h2>

      <button onClick={handleLogout}>
        Logout
      </button>

      <br />
      <br />

      <h2>Online Users</h2>

      <ul>
        {
          onlineUsers.map((onlineUser) => (
            <li key={onlineUser.userId}>
              {onlineUser.username}
            </li>
          ))
        }
      </ul>

      <br />
      <br />

      <input type="text" 
        placeholder='Type message...'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={handleSendMessage}>
        Send
      </button>

      <br />
      <br />

      <h2>Messages</h2>

      <div>
        {
          messages.map((msg, index) => (
            <div key={index}>
              <strong>
                {msg.senderName}
              </strong>
              : {msg.text}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ChatPage
