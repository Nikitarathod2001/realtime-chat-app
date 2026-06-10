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

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp)
      .toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
  };

  useEffect(() => {
    if(!user) {
      return;
    }
    
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
  }, [user]);

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

      <div>
        {
          messages.map((msg, index) => {
            const isOwnMessage = msg.senderId === user._id;

            return (
              <div key={index}
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
