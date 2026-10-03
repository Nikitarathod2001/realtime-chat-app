import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import UserList from "./UserList";

const Sidebar = ({
  user,
  logout,
  search,
  setSearch,
  filteredUsers,
  selectedUser,
  handleSelectedUser,
  onlineUsers,
}) => {
  const navigate = useNavigate();

  return (
    <aside
      className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col ${selectedUser ? "hidden md:flex" : "flex"}`}
    >

      {/* Logged-in User */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center gap-3">

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 min-w-0 cursor-pointer hover:bg-gray-50 rounded-xl p-2 -ml-2 transition"
        >

          {/* Profile Picture */}
          <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-gray-200">

            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-gray-500" />
              </div>
            )}

          </div>

          {/* Username */}
          <div className="min-w-0 text-left">

            <h1 className="text-base font-semibold truncate">
              @{user?.username}
            </h1>

            <p className="text-xs text-green-500">Online</p>

          </div>

        </button>

        {/* Logout */}
        <button
          onClick={logout}
          title="Logout"
          className="shrink-0 w-9 h-9 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition cursor-pointer"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>

      </div>

      {/* User Search */}
      <div className="p-4 mb-3">

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-full px-4 py-2 outline-none text-sm"
        />
        
      </div>

      {/* User List */}
      <UserList filteredUsers={filteredUsers}
        selectedUser={selectedUser}
        handleSelectedUser={handleSelectedUser}
        onlineUsers={onlineUsers}
      />
    </aside>
  );
};

export default Sidebar;
