import React from "react";

const MessageList = ({ messages, user, formatTime, messagesEndRef, typingUser }) => {
  return (
    <div
      style={{
        border: "1px solid black",
        padding: "10px",
        height: "300px",
        overflowY: "auto",
      }}
    >
      {messages.map((msg) => {
        const isOwnMessage = msg.senderId === user._id;

        return (
          <div
            key={msg._id}
            style={{
              textAlign: isOwnMessage ? "right" : "left",
              marginBottom: "15px",
            }}
          >
            <strong>{isOwnMessage ? "You" : msg.senderName}</strong>

            <div>{msg.text}</div>

            <small>{formatTime(msg.timestamp)}</small>
          </div>
        );
      })}
      {typingUser && <p>{typingUser} is typing...</p>}

      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default MessageList;
