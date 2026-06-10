import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },

  senderId: {
    type: String,
    required: true,
  },

  senderName: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now
  },
}, {timestamps: true});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;