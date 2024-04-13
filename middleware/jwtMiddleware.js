const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

module.exports.authenticateToken = async (req, res, next) => {
  try {
    const authToken = req.headers.authtoken;
    if (!authToken) {
      return res
        .status(400)
        .json({ success: "false", message: "No token provided" });
    }

    jwt.verify(authToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(400)
          .json({ success: "false", message: "Invalid token" });
      }

      const user = await UserModel.findById(decoded._id);
      if (!user) {
        return res.status(400).json({
          success: "false",
          message: "User with this token is not found",
        });
      }

      req.userID = decoded._id;
      next();
    });
  } catch (error) {
    return res
      .status(400)
      .json({ success: "false", message: "Internal server error" });
  }
};
