const express = require("express");
const dotenv = require("dotenv");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

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

io.use((socket, next) => {});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
