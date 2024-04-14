const MessageModel = require("../models/messageModel");

module.exports.getAllMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find({
      conversationID: req.params.conversationID,
    });
    return res.status(200).json({ status: "success", messages });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};
