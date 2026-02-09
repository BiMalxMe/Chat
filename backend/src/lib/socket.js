import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [ENV.CLIENT_URL],
    credentials: true,
  },
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  console.log("Getting socket ID for user:", userId);
  console.log("Current userSocketMap:", userSocketMap);
  const socketId = userSocketMap[userId];
  console.log("Found socket ID:", socketId);
  return socketId;
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("=== SOCKET CONNECTION ===");
  console.log("A user connected", socket.user.fullName);
  console.log("Socket ID:", socket.id);
  console.log("User ID:", socket.userId);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;
  
  console.log("Updated userSocketMap:", userSocketMap);

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("=== SOCKET DISCONNECTION ===");
    console.log("A user disconnected", socket.user.fullName);
    console.log("Removing socket ID:", socket.id, "for user:", userId);
    delete userSocketMap[userId];
    console.log("Updated userSocketMap after disconnect:", userSocketMap);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // WebRTC signaling events
  socket.on("call-user", ({ targetUserId, signalData }) => {
    console.log("Call initiated from", userId, "to", targetUserId);
    const targetSocketId = userSocketMap[targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming-call", {
        callerId: userId,
        callerName: socket.user.fullName,
        signalData
      });
    }
  });

  socket.on("answer-call", ({ callerId, signalData }) => {
    console.log("Call answered by", userId, "for", callerId);
    const callerSocketId = userSocketMap[callerId];
    if (callerSocketId) {
      io.to(callerSocketId).emit("call-answered", {
        answererId: userId,
        answererName: socket.user.fullName,
        signalData
      });
    }
  });

  socket.on("end-call", ({ targetUserId }) => {
    console.log("Call ended by", userId, "for", targetUserId);
    const targetSocketId = userSocketMap[targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("call-ended", {
        callerId: userId
      });
    }
  });

  socket.on("ice-candidate", ({ targetUserId, candidate }) => {
    const targetSocketId = userSocketMap[targetUserId];
    if (targetSocketId) {
      io.to(targetSocketId).emit("ice-candidate", {
        candidate,
        senderId: userId
      });
    }
  });
});

export { io, app, server };
