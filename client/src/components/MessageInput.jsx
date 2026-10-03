import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const MessageInput = ({ messageInput, handleTyping, handleSendMessage }) => {
  return (
    <div className="bg-white border-t border-gray-200 p-3 sm:p-4">

      <div className="flex gap-2 sm:gap-3">

        <input
          type="text"
          value={messageInput}
          onChange={handleTyping}
          placeholder="Enter a message..."
          className="flex-1 min-w-0 border border-gray-300 rounded-4xl px-3 sm:px-4 py-3 outline-none"
        />

        <button
          onClick={handleSendMessage}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 sm:px-6 py-3 rounded-full transition shrink-0 cursor-pointer"
        >
          <span className="hidden sm:inline">Send</span>

          <span className="sm:hidden cursor-pointer">
            <FontAwesomeIcon icon={faPaperPlane} />
          </span>

        </button>

      </div>
      
    </div>
  );
};

export default MessageInput;
