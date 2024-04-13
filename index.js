const express = require("express");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const UserModel = require("./models/userModel");
const jwt = require("jsonwebtoken");

dotenv.config();

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());

app.use("/user", userRoutes);

io.use(async (socket, next) => {
  try {
    const authToken = socket.request.headers.authtoken;
    // console.log(authToken);
    if (!authToken)
      return next(new Error("Authentication error: No token provided"));
    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);
    const user = await UserModel.findById(decodedData._id);
    if (!user) return next(new Error("Authentication error: User not found"));
    socket.user = user;
    return next();
  } catch (error) {
    console.log(error);
    return next(new Error(error.message));
  }
});

io.on("connection", (socket) => {
  console.log(`User ${socket.user.username} connected`);

  socket.on("disconnect", () => {
    console.log(`User ${socket.user.username} disconnected`);
  });
});

app.use((error, req, res, next) => {
  res.status(500).json({
    success: "false",
    message: error.message,
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
