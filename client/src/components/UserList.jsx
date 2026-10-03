import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const UserList = ({
  filteredUsers,
  selectedUser,
  handleSelectedUser,
  onlineUsers,
}) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-4">

      <div className="space-y-2">

        {filteredUsers.map((item) => (
          <div
            key={item._id}
            onClick={() => handleSelectedUser(item)}
            className={`px-4 py-2 rounded-2xl cursor-pointer transition ${
              selectedUser?._id === item._id
                ? "bg-teal-700 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">

              {/* Profile Picture + Status */}
              <div className="relative shrink-0">

                <div className="w-10 h-10 rounded-full overflow-hidden">

                  {item.profilePicture ? (
                    <img
                      src={item.profilePicture}
                      alt={item.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        selectedUser?._id === item._id
                          ? "bg-teal-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faUser}
                        className={
                          selectedUser?._id === item._id
                            ? "text-white"
                            : "text-gray-500"
                        }
                      />

                    </div>
                  )}

                </div>

                {/* Online Status */}
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    onlineUsers.has(item._id) ? "bg-green-500" : "bg-gray-400"
                  }`}
                />

              </div>

              {/* User Information */}
              <div className="min-w-0">

                <h3 className="text-sm truncate">@{item.username}</h3>

                {(item.firstName || item.lastName) && (
                  <p
                    className={`text-xs truncate ${
                      selectedUser?._id === item._id
                        ? "text-teal-100"
                        : "text-gray-400"
                    }`}
                  >
                    {`${item.firstName || ""} ${item.lastName || ""}`.trim()}
                  </p>
                )}

              </div>

            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
};

export default UserList;
