const http = require("http");
const express = require("express");
const socketio = require("socket.io");
require("./db/mongoose");

const User = require("./routes/user");

// Create an instance of express app
const app = express();

// Create server so that it can be accessible to socketio
const server = http.createServer(app);

// Integrate socketIo with server
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(User);

io.on("connection", (socket) => {
  console.log("New client connected!");
  socket.on("sendMessage", (msg) => {
    console.log(msg);
  });
});

module.exports = { app, server };
