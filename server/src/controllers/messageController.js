import Message from "../models/Message.js";

// Get sender-receiver messages
export const getMessages = async (req, res) => {
  try {

    const {userId} = req.params;

    const messages = await Message.find({
      $or: [
        {
          sender: req.userId,
          receiver: userId,
        },
        {
          sender: userId,
          receiver: req.userId,
        }
      ],
    }).sort({createdAt: 1})
      .populate("sender", "username profilePicture")
      .populate("receiver", "username profilePicture");

    res.status(200).json({
      messages,
    });
    
  } catch (error) {
    console.error("Get messages error: ", error);

    res.status(500).json({
      message: "Failed to get messages",
    });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {

    const {receiver, content} = req.body;

    if(!receiver || !content?.trim()) {
      return res.status(400).json({
        message: "Receiver and message content are required",
      });
    }

    const message = await Message.create({
      sender: req.userId,
      receiver,
      content: content.trim(),
    });

    const populatedMessage = await message.populate([
      {
        path: "sender",
        select: "username profilePicture",
      },
      {
        path: "receiver",
        select: "username profilePicture",
      }
    ]);

    res.status(201).json({
      message: populatedMessage,
    });
    
  } catch (error) {
    console.error("Send message error: ", error);

    res.status(500).json({
      message: "Failed to send message",
    });
  }
};