import React from "react";

const MessageList = ({ messages, user, formatTime, messagesEndRef, typingUser, activeUser }) => {
  return (
    <div className="border rounded-xl p-4 h-[400px] md:h-[500px] overflow-y-auto bg-gray-50 shadow-md">

      {
        messages.map((msg) => {

          const isOwnMessage = msg.sender?._id === user._id;

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
                      {msg.sender?.username}
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
                    formatTime(msg.createdAt)
                  }
                </p>

              </div>

            </div>
          );
        })
      }

      {
        typingUser?.userId === activeUser?._id && (
        <div className="flex justify-start mb-2 animate-pulse">

          <div className="bg-white border px-4 py-2 rounded-2xl shadow-sm">
            
            <p className="text-sm text-gray-500 italic">
              {typingUser.username} is typing...
            </p>

          </div>

        </div>
      )}

      <div ref={messagesEndRef}></div>

    </div>
  );
};

export default MessageList;
