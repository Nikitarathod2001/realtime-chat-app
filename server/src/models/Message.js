import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  content: {
    type: String,
    required: true,
    trim: true,
  },

  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  },
}, {timestamps: true});

messageSchema.index({
  sender: 1,
  receiver: 1,
  creatdAt: 1,
});

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;