const router = require("express").Router();
const {
  login,
  followUser,
  unFollowUser,
  getAllUsers,
  getUser,
  doIFollowThisUser,
  doesHeFollowMe,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/jwtMiddleware");

router.post("/login", login);

// for follow
router.post("/:userID/follow", authenticateToken, followUser);
router.delete("/:userID/unfollow", authenticateToken, unFollowUser);

router.get("/", authenticateToken, getAllUsers);

router.get("/:userID/do-i-follow-him", authenticateToken, doIFollowThisUser);
router.get("/:userID/does-he-follow-me", authenticateToken, doesHeFollowMe);
router.get("/:userID", authenticateToken, getUser);

module.exports = router;
