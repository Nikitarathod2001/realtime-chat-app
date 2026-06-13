import React from "react";

const MessageList = ({ messages, user, formatTime, messagesEndRef, typingUser }) => {
  return (
    <div className="border rounded-lg p-4 h-[500px] overflow-y-auto bg-gray-50 shadow-sm">

      {
        messages.map((msg) => {
          const isOwnMessage = msg.senderId === user._id;

          return (
            <div
              key={msg._id}
              style={{
                textAlign: isOwnMessage ? "right" : "left",
                marginBottom: "15px",
              }}
            >

              <strong>
                {isOwnMessage ? "You" : msg.senderName}
              </strong>

              <div>{msg.text}</div>

              <small>{formatTime(msg.timestamp)}</small>

            </div>
          );
        })
      }

      {
        typingUser && 
        <p>{typingUser} is typing...</p>
      }

      <div ref={messagesEndRef}></div>

    </div>
  );
};

export default MessageList;
