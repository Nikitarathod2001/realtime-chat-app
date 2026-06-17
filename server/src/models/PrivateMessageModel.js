import mongoose, { mongo } from "mongoose";

const privateMessageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    red: "User",
    required: true,
  },

  text: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500,
  },

  isRead: {
    type: Boolean,
    default: false,
  },
}, {timestamps: true});

privateMessageSchema.index({
  conversationId: 1,
  createdAt: 1,
});

const PrivateMessage = mongoose.models.PrivateMessage || mongoose.model("PrivateMessage", privateMessageSchema);

export default PrivateMessage;