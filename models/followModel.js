const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  followingID: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Follow", followSchema);
