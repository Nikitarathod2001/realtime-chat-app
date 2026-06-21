import React from 'react'

const MessageInput = ({message, handleTyping, handleSendMessage}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-4">

      <input type="text" 
        placeholder='Type a message...'
        value={message}
        onChange={handleTyping}
        onKeyDown={(e) => {
          if(e.key === "Enter") {
            handleSendMessage();
          }
        }}
        className='flex-1 border rounded-xl px-4 py-3 outline-none shadow-sm bg-white'
      />

      <button onClick={handleSendMessage}
      disabled={!message.trim()}
        className='bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700'
      >
        Send
      </button>

    </div>
  )
}

export default MessageInput
