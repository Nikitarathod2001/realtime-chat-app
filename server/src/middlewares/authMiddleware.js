import jwt from "jsonwebtoken";
import User from "../models/User.js";


// Authenticate User
export const authUser = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Access denied"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded_token = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded_token.id).select("-password");

    next();
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};