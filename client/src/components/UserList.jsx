import React from 'react'

const UserList = ({
  users, onlineUsers, activeUser, handleUserClick
}) => {
  return (
    <div>
      
      <h2 className='text-lg font-semibold mb-4 text-white'>
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
                    className={`flex items-center p-3 rounded-xl cursor-pointer border transition ${
                      isActive ?
                      "bg-emerald-600 border-emerald-400"
                      : "bg-emerald-900 border border-emerald-700 hover:bg-emerald-800"
                    }`}
                  >
                    <div className='flex items-center gap-2'>

                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        isOnline ? "bg-green-400" : "bg-emerald-700"
                      }`}>
                      </div>

                      <span className={`text-sm sm:text-base truncate ${
                        isActive ?
                        "text-white font-medium"
                        : "text-emerald-50"
                      }`}>
                        {user.username}
                      </span>

                    </div>

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
