import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {

    const users = await User.find({
      _id: {
        $ne: req.user._id
      }
    }).select("_id username");

    res.status(200).json({
      success: true,
      users,
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};