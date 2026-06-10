import React, { useEffect } from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';
import { useState } from 'react';

const ChatPage = () => {

  const navigate = useNavigate();

  const {user, logout} = useAuth();

  const [onlineUsers, setOnlineUsers] = useState([]);

  const handleLogout = () => {
    logout();
    navigate("/login");
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

    return () => {
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
    </div>
  )
}

export default ChatPage
