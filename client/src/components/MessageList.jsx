import React from "react";

const MessageList = ({ messages, user, formatTime, messagesEndRef, typingUser }) => {
  return (
    <div className="border rounded-lg p-4 h-[500px] overflow-y-auto bg-gray-100">

      {
        messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-500">
            No messages yrt.
            Start the conversion
          </div>
        )
      }

      {
        messages.map((msg) => {
          const isOwnMessage = msg.senderId === user._id;

          return (
            <div
              key={msg._id}
              className={`flex mb-4 ${
                isOwnMessage ?
                "justify-end" : "justify-start"
              }`}
            >

              <div className={`max-w-[70%] px-4 py-2 rounded-xl shadow-sm ${
                isOwnMessage ?
                "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
              }`}>

                {
                  !isOwnMessage && (
                    <p className="text-xs font-bold mb-1">
                      {msg.senderName}
                    </p>
                  )
                }

                <p>
                  {msg.text}
                </p>

                <p className={`text-[10px] mt-1 text-right ${
                  isOwnMessage ? 
                  "text-blue-100"
                  : "text-gray-500"
                }`}>
                  {
                    formatTime(msg.timestamp)
                  }
                </p>

              </div>

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
