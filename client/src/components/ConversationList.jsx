import React from 'react'

const ConversationList = ({conversations, user}) => {
  return (
    <div>
      
      <h2 className='text-lg font-semibold mb-4'>
        Conversations
      </h2>

      {
        conversations.map((conversation) => {
          const otherUser = conversation.participants.find((participant) => participant._id !== user._id);

          return (
            <div key={conversation._id} 
              className='border rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-50'>
              {
                otherUser?.username
              }
            </div>
          );
        })
      }

    </div>
  )
}

export default ConversationList
