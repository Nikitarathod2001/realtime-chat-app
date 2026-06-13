import React from 'react'

const OnlineUsers = ({onlineUsers, user}) => {
  return (
    <>
      <h2 className='text-lg font-semibold mb-2'>
        Online Users
      </h2>

      <p className='text-sm text-gray-500 mb-4'>
        {onlineUsers.length} users online
      </p>

      <ul className='space-y-2'>
        {
          onlineUsers.map((onlineUser) => (
            <li key={onlineUser.userId}
              className='border rounded-md px-3 py-2'
            >
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
