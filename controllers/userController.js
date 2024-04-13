const UserModel = require("../models/userModel");
const FollowModel = require("../models/followModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: "false",
        message: "No username or password provided",
      });
    }

    const user = await UserModel.findOne({ username, password });

    if (!user) {
      return res.status(400).json({
        success: "false",
        message: "No username or password provided",
      });
    }

    const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res.status(200).json({ message: "login successfully", authToken });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports.followUser = async (req, res) => {
  try {
    let followingID = req.params.userID;

    // trim the value if it's present or set empty string
    followingID = followingID ? followingID.trim() : "";

    // Check if the followingID is passed or not
    if (!followingID) {
      return res
        .status(400)
        .json({ success: "false", message: "followingID is required" });
    }

    // Check if the user id passed in url param is valid or not
    if (!mongoose.isValidObjectId(followingID)) {
      return res
        .status(400)
        .json({ success: "false", message: "followingID is not valid" });
    }

    // Check if the user is trying to follow himself
    if (req.userID === followingID) {
      return res
        .status(400)
        .json({ success: "false", message: "you can't follow yourself" });
    }

    // Check if current user already follows the target user or not
    if (await FollowModel.findOne({ userID: req.userID, followingID })) {
      return res
        .status(400)
        .json({ success: "false", message: "Already followed" });
    }

    // Create the new relation in follow collection
    const follow = new FollowModel({ userID: req.userID, followingID });

    // save the follow relation
    await follow.save();

    return res
      .status(200)
      .json({ status: "Success", message: "User successfully followed" });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports.unFollowUser = async (req, res) => {
  try {
    let followingID = req.params.userID;

    // trim the value if it's present or set empty string
    followingID = followingID ? followingID.trim() : "";

    // Check if the followingID is passed or not
    if (!followingID) {
      return res
        .status(400)
        .json({ success: "false", message: "followingID is required" });
    }

    // Check if the user id passed in url param is valid or not
    if (!mongoose.isValidObjectId(followingID)) {
      return res
        .status(400)
        .json({ success: "false", message: "followingID is not valid" });
    }

    // Check if the user is trying to unfollow himself
    if (req.userID === followingID) {
      return res.status(400).json({
        success: "false",
        message: "you can't unfollow yourself",
      });
    }

    // Find the follow relation document in follow model
    const followerToRemove = await FollowModel.findOne({
      userID: req.userID,
      followingID,
    });

    if (!followerToRemove) {
      return res
        .status(400)
        .json({ success: "false", message: "Already unfollowed" });
    }

    // Delete the follow relation
    await followerToRemove.deleteOne();

    return res
      .status(200)
      .json({ status: "success", message: "User successfully unfollowed" });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({ _id: { $ne: req.userID } }).select(
      "-password -canRecieveMessageFromEveryone"
    );
    return res.status(200).json({ status: "success", users });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID).select(
      "-password"
    );
    return res.status(200).json({ status: "success", user });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports.doIFollowThisUser = async (req, res) => {
  try {
    const followingID = req.params.userID;
    const followRelation = Boolean(
      await FollowModel.findOne({ userID: req.userID, followingID })
    );

    return res.status(200).json({ success: "true", followRelation });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports.doesHeFollowMe = async (req, res) => {
  try {
    const followerID = req.params.userID;
    const followRelation = Boolean(
      await FollowModel.findOne({ userID: followerID, followingID: req.userID })
    );

    return res.status(200).json({ success: "true", followRelation });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};
