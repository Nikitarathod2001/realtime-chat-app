import Conversation from "../models/Conversation.js";

export const startConversation = async (req, res) => {
  try {

    const currentUserId = req.user._id;
    const {participantId} = req.body;

    if(currentUserId.toString() === participantId) {
      return res.status(400).json({
        success: false,
        message: "Cannot create conversation with yourself",
      });
    }

    let conversation = await Conversation.findOne({
      participants: {
        $all: [
          currentUserId,
          participantId,
        ],
      },
    });

    if(!conversation) {
      conversation = await Conversation.create({
        participants: [
          currentUserId,
          participantId
        ],
      });
    }

    await conversation.populate(
      "participants",
      "username email",
    );

    res.status(200).json({
      success: true,
      conversation,
    });
    
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getConversations = async (req, res) => {
  try {

    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId
    })
    .populate(
      "participants",
      "username email"
    )
    .sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      conversations
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};