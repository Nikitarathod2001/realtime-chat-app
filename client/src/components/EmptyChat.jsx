import React from "react";

const EmptyChat = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-6 text-center">

      <div>

        <h2 className="text-xl sm:text-2xl font-bold text-gray-700">
          Welcome to Chat
        </h2>

        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Select a user from the sidebar to start chatting.
        </p>

      </div>
      
    </div>
  );
};

export default EmptyChat;
