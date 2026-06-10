import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  try {

    const messages = await Message.find()
                      .sort({
                        timestamp: 1,
                      });

    res.status(200).json({
      success: true,
      messages
    });
    
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};