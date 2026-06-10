import React, { useEffect, useRef } from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';
import { useState } from 'react';
import api from '../services/api';

const ChatPage = () => {

  const navigate = useNavigate();

  const {user, logout} = useAuth();

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const[typingUser, setTypingUser] = useState("");

  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

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

  useEffect(() => {
    if(!user) {
      return;
    }
    
    // Socket connection
    socket.connect();

    // Join chat after connection
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

    return () => {
      socket.off("online-users");
      socket.off("receive-message");

      socket.off("user-typing");
      socket.off("user-stop-typing");

      if(typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    loadMessages();
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
        onChange={handleTyping}
        onKeyDown={(e) => {
          if(e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />

      <button onClick={handleSendMessage}>
        Send
      </button>

      <br />
      <br />

      <h2>Messages</h2>

      

      <div style={{
        border: "1px solid black",
        padding: "10px",
        height: "300px",
        overflowY: "auto",
      }}>
        {
          typingUser && (
            <p>
              {typingUser} is typing...
            </p>
          )
        }
        {
          messages.map((msg) => {
            const isOwnMessage = msg.senderId === user._id;

            return (
              <div key={msg._id}
                style={{
                  textAlign: isOwnMessage ? "right" : "left",
                  marginBottom: "15px"
                }}
              >
                <strong>
                  {
                    isOwnMessage ? "You" : msg.senderName
                  }
                </strong>

                <div>
                  {msg.text}
                </div>

                <small>
                  {
                    formatTime(msg.timestamp)
                  }
                </small>
              </div>
            );
          })
        }
      </div>
    </div>
  )
}

export default ChatPage
