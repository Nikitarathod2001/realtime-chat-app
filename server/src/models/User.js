import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
    lowercase: true,
    match: /^[a-z0-9_-]+$/
  },

  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    minLength: 6,
  },

  profilePicture: {
    type: String,
    default: "",
  },

  bio: {
    type: String,
    default: "",
    maxLength: 150,
  },
}, {timestamps: true});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;