import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// Register User
export const registerUser = async (req, res) => {
  try {

    const {username, firstName, lastName, email, password} = req.body;

    if(!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({email});

    if(existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exist",
      });
    }

    const isUsernameExist = await User.findOne({username});

    if(isUsernameExist) {
      return res.status(409).json({
        success: false,
        message: "User with this username already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
    
  } catch (error) {
    console.error("Registration error: ", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
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
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({email});

    if(!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if(!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
    
  } catch (error) {
    console.error("Login error: ", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};