import React from 'react'

const MessageInput = ({message, handleTyping, handleSendMessage}) => {
  return (
    <div className="flex gap-3 mt-3">

      <input type="text" 
        placeholder='Type message...'
        value={message}
        onChange={handleTyping}
        onKeyDown={(e) => {
          if(e.key === "Enter") {
            handleSendMessage();
          }
        }}
        className='flex-1 border rounded-lg px-4 py-2 outline-none'
      />

      <button onClick={handleSendMessage}
        className='bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600'
      >
        Send
      </button>

    </div>
  )
}

export default MessageInput
