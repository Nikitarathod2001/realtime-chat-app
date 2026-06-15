import React from "react";

const MessageList = ({ messages, user, formatTime, messagesEndRef, typingUser }) => {
  return (
    <div className="border rounded-xl p-4 h-[400px] md:h-[500px] overflow-y-auto bg-gray-50 shadow-md">

      {
        messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            
            <p className="text-lg font-medium">
              No messages yet
            </p>

            <p className="text-sm">
              Start the conversation
            </p>

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

              <div className={`max-w-[85%] md:max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                isOwnMessage ?
                "bg-blue-500 text-white"
                : "bg-white border"
              }`}>

                {
                  !isOwnMessage && (
                    <p className="text-xs font-semibold text-blue-600 mb-1">
                      {msg.senderName}
                    </p>
                  )
                }

                <p className="text-sm">
                  {msg.text}
                </p>

                <p className={`text-[11px] mt-2 text-right ${
                  isOwnMessage ? 
                  "text-blue-100"
                  : "text-gray-400"
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
        typingUser && (
        <div className="flex justify-start mb-2">

          <div className="bg-white border px-4 py-2 rounded-2xl shadow-sm">
            
            <p className="text-sm text-gray-500 italic">
              {typingUser} is typing...
            </p>

          </div>

        </div>
      )}

      <div ref={messagesEndRef}></div>

    </div>
  );
};

export default MessageList;
