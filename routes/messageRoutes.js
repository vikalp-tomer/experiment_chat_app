const { getAllMessages } = require("../controllers/messageController");
const { authenticateToken } = require("../middleware/jwtMiddleware");

const router = require("express").Router();

router.get("/:conversationID", authenticateToken, getAllMessages);

module.exports = router;
