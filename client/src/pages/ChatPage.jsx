import React, { useEffect } from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';

const ChatPage = () => {

  const navigate = useNavigate();

  const {user, logout} = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log(`Connected: ${socket.id}`);
    });

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
    </div>
  )
}

export default ChatPage
