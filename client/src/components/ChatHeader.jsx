import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({
  selectedUser,
  setSelectedUser,
  isSelectedUserTyping,
  onlineUsers,
}) => {
  const navigate = useNavigate();

  if (!selectedUser) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">

      {/* Mobile Back Button */}
      <button
        onClick={() => setSelectedUser(null)}
        className="text-sm md:hidden bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      <div className="min-w-0">

        <div
          onClick={() => navigate(`/profile/${selectedUser._id}`)}
          className="flex items-center gap-2 cursor-pointer"
        >

          {selectedUser?.profilePicture ? (
            <img
              src={selectedUser.profilePicture}
              alt={selectedUser.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full">
              <FontAwesomeIcon icon={faUser} className="text-gray-500" />
            </div>
          )}

          <button>
            <h2 className="text-lg sm:text-xl font-bold truncate cursor-pointer">
              @{selectedUser.username}
            </h2>
          </button>

        </div>

        <p className={`text-sm ${isSelectedUserTyping ? "text-teal-500" : onlineUsers.has(selectedUser._id) ? "text-green-500" : "text-gray-400" }`}
        >

          {isSelectedUserTyping ? "typing..." : onlineUsers.has(selectedUser._id) ? "Online" : "Offline"}

        </p>

      </div>
      
    </header>
  );
};

export default ChatHeader;
