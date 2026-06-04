import React from 'react'
import { useAuth } from '../context/authContext'
import { useNavigate } from 'react-router-dom';

const ChatPage = () => {

  const navigate = useNavigate();

  const {user, logout} = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
