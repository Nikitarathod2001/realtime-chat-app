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

      <ul className='space-y-3'>
        {
          onlineUsers.map((onlineUser) => {
            const isCurrentUser = onlineUser.userId === user._id;

            return (
              <li key={onlineUser.userId}
                className='flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-gray-100 transition'
              >

                <div className='flex items-center gap-3'>

                  <div className='w-3 h-3 rounded-full bg-green-500'></div>

                  <span className={
                    isCurrentUser ?
                    "font-semibold text-blue-600"
                    : "text-gray-700"
                  }>
                    {
                      isCurrentUser ?
                      "You" : onlineUser.username
                    }
                  </span>

                </div>

              </li>
            );
          })
        }
      </ul>
    </>
  )
}

export default OnlineUsers
