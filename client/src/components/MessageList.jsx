import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { formatMessageDate, formatMessageTime } from "../utils/dateUtils";

const MessageList = ({
  conversationMessages,
  selectedUser,
  user,
  isSelectedUserTyping,
  messagesEndRef,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">

      <div className="flex flex-col gap-2">

        {conversationMessages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-gray-400">

            <p className="text-sm sm:text-base">
              Start Chatting with {selectedUser.username}
            </p>

          </div>
        ) : (
          conversationMessages.map((message, index) => {
            const currentDate = formatMessageDate(message.createdAt);

            const previousDate = index > 0 ? formatMessageDate(conversationMessages[index - 1].createdAt) : null;

            const showDateSeparator = currentDate !== previousDate;

            const isMine = String(message.sender._id) === String(user.id);

            return (
              <div key={message._id}>

                {/* Date Separator */}
                {showDateSeparator && (
                  <div className="flex justify-center my-4">

                    <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                      {currentDate}
                    </span>

                  </div>
                )}

                {/* Message */}
                <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>

                  <div className={`max-w-[70%] rounded-4xl px-4 py-2 ${isMine ? "bg-teal-800 text-white" : "bg-white text-gray-900"}`}>

                    <div className="flex items-end gap-1">
                      <span>{message.content}</span>

                      <span className={`text-[10px] sm:text-[9px] whitespace-nowrap ${isMine ? "text-gray-300" :"text-gray-600"}`}>
                        {formatMessageTime(message.createdAt)}
                      </span>

                      {isMine && (
                        <>
                          {message.status === "sent" && (
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-[11px] text-gray-300 ml-1"
                            />
                          )}

                          {message.status === "delivered" && (
                            <FontAwesomeIcon
                              icon={faCheckDouble}
                              className="text-[11px] text-gray-300 ml-1"
                            />
                          )}

                          {message.status === "read" && (
                            <FontAwesomeIcon
                              icon={faCheckDouble}
                              className="text-[11px] text-blue-300 ml-1"
                            />
                          )}
                        </>
                      )}

                    </div>

                  </div>

                </div>

              </div>
            );
          })
        )}

        {/* Typing Indicator */}
        {isSelectedUserTyping && (
          <div className="flex justify-start mt-3">

            <div className="bg-white text-gray-500 px-4 py-2 rounded-4xl shadow-sm">

              <span className="animate-pulse">typing...</span>

            </div>

          </div>
        )}

        {/* Scroll target */}
        <div ref={messagesEndRef} />

      </div>
      
    </div>
  );
};

export default MessageList;
