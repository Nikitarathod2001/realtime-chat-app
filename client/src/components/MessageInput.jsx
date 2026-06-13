import React from 'react'

const MessageInput = ({message, handleTyping, handleSendMessage}) => {
  return (
    <>
      <input type="text" 
        placeholder='Type message...'
        value={message}
        onChange={handleTyping}
        onKeyDown={(e) => {
          if(e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />

      <button onClick={handleSendMessage}>
        Send
      </button>
    </>
  )
}

export default MessageInput
