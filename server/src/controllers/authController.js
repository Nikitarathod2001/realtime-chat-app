import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";


// Register User
export const registerUser = async (req, res) => {
  try {

    const {username, email, password} = req.body;

    if(!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({email});
    if(existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create User
    const user = await User.create({
      username, email, password
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Login User
export const loginUser = async (req, res) => {
  try {

    const {email, password} = req.body;
    
    if(!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = await generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Get user profile
export const getProfile = async (req, res) => {
  try {

    const user = req.user;
    
    res.status(200).json({
      success: true,
      user
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};