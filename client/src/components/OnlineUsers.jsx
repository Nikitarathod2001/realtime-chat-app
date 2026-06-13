import React from 'react'

const OnlineUsers = ({onlineUsers, user}) => {
  return (
    <>
      <h2>Online Users</h2>

      <ul>
        {
          onlineUsers.map((onlineUser) => (
            <li key={onlineUser.userId}>
              {
                onlineUser.userId === user._id ?
                "You" : onlineUser.username
              }
            </li>
          ))
        }
      </ul>
    </>
  )
}

export default OnlineUsers
