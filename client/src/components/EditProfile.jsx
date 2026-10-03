import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCamera,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const EditProfile = ({
  profileUser,
  profilePicture,
  fileInputRef,
  handleImageChange,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  bio,
  setBio,
  handleSave,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">

      <div className="w-full max-w-xl bg-white min-h-screen">

        {/* Header */}
        <div className="flex items-center gap-4 px-5 py-4 border-b">

          <button
            onClick={() => navigate("/chat")}
            className="text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>

          <h1 className="text-lg font-semibold">Edit Profile</h1>

        </div>

        <form onSubmit={handleSave} className="p-6">

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-8">

            <div className="relative">

              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100">

                {
                  profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="text-3xl text-gray-400"
                      />
                    </div>
                  )
                }

              </div>

              {/* Camera */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-teal-800 text-white flex items-center justify-center hover:bg-teal-900"
              >
                <FontAwesomeIcon icon={faCamera} />
              </button>

            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <p className="text-xs text-gray-500 mt-3">
              JPG, PNG or other image Max 5MB
            </p>

          </div>

          {/* First Name */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-1">First Name</label>

            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter first name"
              className="w-full border border-zinc-400 rounded-lg px-3 py-2 text-gray-700 outline-none"
              maxLength={30}
            />

          </div>

          {/* Last Name */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-1">Last Name</label>

            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter last name"
              className="w-full border border-zinc-400 text-gray-700 rounded-lg px-3 py-2 outline-none"
              maxLength={30}
            />

          </div>

          {/* Username */}
          <div className="mb-4">

            <label className="block text-sm font-medium mb-1">Username</label>

            <input
              type="text"
              value={profileUser?.username || ""}
              disabled
              className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
            />

          </div>

          {/* Bio */}
          <div className="mb-6">

            <label className="block text-sm font-medium mb-1">About</label>

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={150}
              placeholder="Tell something about yourself..."
              className="w-full border border-zinc-400 text-gray-700 rounded-lg px-3 py-2 resize-none outline-none"
            />

            <p className="text-xs text-gray-400 text-right mt-1">
              {bio.length}/150
            </p>

          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-800 hover:bg-teal-900 text-white py-2.5 rounded-4xl font-medium disabled:opacity-50 cursor-pointer transition duration-300"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>

      </div>
      
    </div>
  );
};

export default EditProfile;
