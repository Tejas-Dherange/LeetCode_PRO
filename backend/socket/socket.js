
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { getRedisClient } from "../libs/redis.lib.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://yourdomain.com"], // Add production domains
    methods: ["GET", "POST"],
  },
});

// Redis subscriber for leaderboard updates
const setupRedisSubscriber = () => {
  const redis = getRedisClient().duplicate(); // Create a new connection for subscribing

  redis.subscribe("leaderboard_updates", (err, count) => {
    if (err) {
      console.error("Failed to subscribe: %s", err.message);
    } else {
      console.log(
        `[Socket] Subscribed to 'leaderboard_updates' channel. Count: ${count}`
      );
    }
  });

  redis.on("message", (channel, message) => {
    if (channel === "leaderboard_updates") {
      try {
        const { contestId } = JSON.parse(message);
        console.log(`[Socket] V2 RECEIVED REDIS MSG:`, message);
        if (contestId) {
          console.log(`[Socket] Broadcasting update for contest: ${contestId}`);
          io.to(`contest_${contestId}`).emit("leaderboardUpdate", {
            contestId,
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.error("[Socket] Error parsing redis message:", error);
      }
    }
  });
};

setupRedisSubscriber();

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("joinContest", (contestId) => {
    if (contestId) {
      socket.join(`contest_${contestId}`);
      console.log(`User ${socket.id} joined contest room: contest_${contestId}`);
    }
  });

  socket.on("leaveContest", (contestId) => {
    if (contestId) {
      socket.leave(`contest_${contestId}`);
      console.log(`User ${socket.id} left contest room: contest_${contestId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

export { app, io, server };
