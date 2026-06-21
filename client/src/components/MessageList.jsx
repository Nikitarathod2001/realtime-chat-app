import React from "react";

const MessageList = ({ messages, user, formatTime, messagesEndRef, typingUser, activeUser }) => {

  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, msg) => {
      const dateKey = new Date(msg.createdAt).toDateString();

      if(!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(msg);
      return groups;
    }, {});
  };

  const getDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();

    const isToday = date.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();

    if(isToday) {
      return "Today";
    }

    if(isYesterday) {
      return "Yesterday";
    }

    return date.toLocaleDateString();
  };

  return (
    <div className="border border-slate-100 rounded-xl p-4 h-[400px] md:h-[500px] overflow-y-auto bg-slate-50 shadow-lg">

      {
        Object.entries(groupMessagesByDate(messages)).map(([date, msgs]) => (

          <div key={date}>

            <div className="flex justify-center my-3">

              <span className="text-xs bg-slate-200 text-slate-600 px-6 py-2 rounded-full">
                {getDateLabel(date)}
              </span>

            </div>

            {
              msgs.map((msg) => {
                const isOwnMessage = msg.sender?._id === user._id;

                return (
                  <div key={msg._id}
                    className={`flex mb-4 ${
                      isOwnMessage ? "justify-end" 
                      : "justify-start"
                    }`}
                  >

                    <div className={`max-w-[85%] md:max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                      isOwnMessage ?
                      "bg-emerald-600 text-white"
                      : "bg-slate-800 border border-slate-700 text-slate-100"
                    }`}>

                      {
                        !isOwnMessage && (
                          <p className="text-xs font-semibold text-emerald-400 mb-1">
                            {msg.sender.username}
                          </p>
                        )
                      }

                      <p className="text-sm">
                        {msg.text}
                      </p>

                      <p className={`text-[11px] mt-2 text-right ${
                        isOwnMessage ? "text-emerald-100"
                        : "text-slate-400"
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

          </div>

        ))
      }

      {
        typingUser?.userId === activeUser?._id && (
        <div className="flex justify-start mb-2 animate-pulse">

          <div className="bg-white border px-4 py-2 rounded-2xl shadow-sm">
            
            <div className="flex items-center gap-1">

              <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></span>

            </div>

          </div>

        </div>
      )}

      <div ref={messagesEndRef}></div>

    </div>
  );
};

export default MessageList;
