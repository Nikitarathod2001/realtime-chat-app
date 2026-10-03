import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import UserProfile from '../components/UserProfile';
import EditProfile from '../components/EditProfile';

const Profile = () => {

  const navigate = useNavigate();
  const {user, setUser} = useAuth();

  const {userId} = useParams();
  const isOwnProfile = !userId;

  const fileInputRef = useRef(null);

  const [profileUser, setProfileUser] = useState(user);
  const [profileLoading, setProfileLoading] = useState(false);

  const [firstName, setFirstName] = useState(profileUser?.firstName || "");
  const [lastName, setLastName] = useState(profileUser?.lastName || "");
  const [bio, setBio] = useState(profileUser?.bio || "");

  const [profilePicture, setProfilePicture] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const[loading, setLoading] = useState(false);


  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      if(!userId) {
        setProfileUser(user);
        return;
      }

      try {

        setProfileLoading(true);

        const response = await api.get(`/users/${userId}`);

        setProfileUser(response.data.user);
        
      } catch (error) {
        console.error("Get profile error: ", error);

        toast.error(error.response?.data?.message || "Failed to load profile");

        navigate("/chat");
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [userId, user, navigate]);

  // Set Profile Data
  useEffect(() => {
    setFirstName(profileUser?.firstName || "");
    setLastName(profileUser?.lastName || "");
    setBio(profileUser?.bio || "");
    setProfilePicture(profileUser?.profilePicture || "");
  }, [profileUser]);

  // Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Check file size
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Store file for upload
    setSelectedFile(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setProfilePicture(previewUrl);
  };

  // Save own profile
  const handleSave = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("bio", bio);

      if(selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      const response = await api.patch("/users/profile", formData);

      setUser(response.data.user);
      setProfileUser(response.data.user);
      setSelectedFile(null);

      toast.success("Profile updated successfully");
      navigate("/chat");
      
    } catch (error) {
      console.error("Update profile error: ", error);

      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if(profileLoading) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>

        <p className='text-gray-500'>
          Loading profile...
        </p>

      </div>
    );
  }

  // Other user profile
  if(!isOwnProfile) {
    return <UserProfile profileUser={profileUser}/>
  }

  return (
    <EditProfile profileUser={profileUser}
      profilePicture={profilePicture}
      fileInputRef={fileInputRef}
      handleImageChange={handleImageChange}
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      bio={bio}
      setBio={setBio}
      handleSave={handleSave}
      loading={loading}
    />
  )
}

export default Profile
