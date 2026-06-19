import PrivateMessage from "../models/PrivateMessageModel.js";

export const getPrivateMessages = async (req, res) => {
  try {

    const {conversationId} = req.params;

    const messages = await PrivateMessage.find({conversationId})
    .populate(
      "sender",
      "username"
    ).sort({
      createdAt: 1,
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