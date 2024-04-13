const router = require("express").Router();
const {
  login,
  followUser,
  unFollowUser,
  getAllUsers,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/jwtMiddleware");

router.post("/login", login);

// for follow
router.post("/:userID/follow", authenticateToken, followUser);
router.delete("/:userID/unfollow", authenticateToken, unFollowUser);

router.get("/", authenticateToken, getAllUsers);

module.exports = router;
