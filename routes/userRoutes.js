const router = require("express").Router();
const {
  login,
  followUser,
  unFollowUser,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/jwtMiddleware");

router.post("/login", login);

// for follow
router.post("/:userID/follow", authenticateToken, followUser);
router.delete("/:userID/unfollow", authenticateToken, unFollowUser);

module.exports = router;
