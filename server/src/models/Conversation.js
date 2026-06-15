import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
    ],

    validate: {
      validator: function(value) {
        return value.length === 2;
      },

      message: "Conversation must contain exactly 2 participants",
    },
  },
}, {timestamps: true});

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);

export default Conversation;