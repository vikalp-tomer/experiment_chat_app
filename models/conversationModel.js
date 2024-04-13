const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    user1: {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      conversationLocation: {
        type: String,
        enum: ["primary", "secondary"],
      },
      hasAcceptedTheConversation: {
        type: Boolean,
        default: false,
      },
      hasMuted: {
        type: Boolean,
        default: false,
      },
    },
    user2: {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      conversationLocation: {
        type: String,
        enum: ["primary", "secondary"],
      },
      hasAcceptedTheConversation: {
        type: Boolean,
        default: false,
      },
      hasMuted: {
        type: Boolean,
        default: false,
      },
    },
    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);
