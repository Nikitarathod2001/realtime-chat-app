import React from 'react'

const UserList = ({
  users, onlineUsers, activeUser, handleUserClick
}) => {
  return (
    <div>
      
      <h2 className='text-lg font-semibold mb-4'>
        Chats
      </h2>

      {
        users.length === 0 ? (
          <p className='text-gray-400 text-sm'>
            No users found
          </p>
        ) : (
          <div className='space-y-2'>

            {
              users.map((user) => {

                const isOnline = onlineUsers.some((onlineUser) => 
                onlineUser.userId === user._id);

                const isActive = activeUser?._id === user._id;

                return (
                  <div key={user._id}
                    onClick={() => handleUserClick(user)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition ${
                      isActive ?
                      "bg-blue-50 border-blue-500"
                      : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      isOnline ? "bg-green-500" : "bg-gray-300"
                    }`}>
                    </div>

                    <span className='font-medium'>
                      {user.username}
                    </span>

                  </div>
                );

              })
            }

          </div>
        )
      }

    </div>
  )
}

export default UserList
