import React from 'react'
import { useAuth } from '../context/authContext'

const ChatPage = () => {

  const {user} = useAuth();

  return (
    <div>
      Chat Page

      <p>
        {
          user && user.username
        }
      </p>
    </div>
  )
}

export default ChatPage
