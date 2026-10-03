import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ profileUser }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">

      <div className="mt-8 w-full max-w-xl h-150 bg-white rounded-3xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-4 px-5 py-4 border-b">

          <button
            onClick={() => navigate("/chat")}
            className="text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <h1 className="text-lg font-semibold">Profile</h1>

        </div>

        {/* Profile */}
        <div className="flex flex-col items-center px-6 py-10">

          {/* Profile picture */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm">

            {
              profileUser?.profilePicture ? (
                <img
                  src={profileUser.profilePicture}
                  alt={profileUser.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-4xl text-gray-400"
                  />
                </div>
              )
            }

          </div>

          {/* Name */}
          <h2 className="text-xl font-semibold mt-5">
            {
              profileUser?.firstName || profileUser?.lastName
              ? `${profileUser?.firstName || ""} ${profileUser?.lastName || ""}`.trim()
              : "User"
            }
          </h2>

          {/* Username */}
          <p className="text-gray-500 mt-1">
            @{profileUser?.username}
          </p>

          {/* About */}
          <div className="w-full mt-8">

            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              About
            </h3>

            <div className="bg-gray-50 border border-zinc-400 rounded-xl p-4">

              <p className="text-gray-600 text-sm leading-relaxed">
                {
                  profileUser?.bio || "This user hasn't added a bio yet."
                }
              </p>

            </div>

          </div>

        </div>

      </div>
      
    </div>
  );
};

export default UserProfile;
