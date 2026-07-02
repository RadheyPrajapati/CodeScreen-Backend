import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import redisClient, { connectRedis } from "./config/redis.js";
import { socketHandler } from "./socket/room.socket.js";
import { videoSocket } from "./videoSocket.js";

const PORT: number = Number(process.env.PORT) || 5000;

/* ---------------- HTTP + IO Setup ---------------- */

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* ---------------- SOCKET REGISTRATION ---------------- */

socketHandler(io);

/* 🔥 ONLY ADD THIS VIDEO SOCKET WRAPPER */
io.on("connection", (socket) => {
  videoSocket(socket, io);
});

/* ---------------- Server Start ---------------- */

const startServer = async (): Promise<void> => {
  try {
    await connectRedis();

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error: unknown) {
    console.error("❌ Server Startup Error:", error);
    process.exit(1);
  }
};

/* ---------------- Graceful Shutdown ---------------- */

const gracefulShutdown = async (): Promise<void> => {
  console.log("\n🛑 Shutting down server...");

  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log("✅ Redis disconnected");
    }

    server.close(() => {
      console.log("✅ HTTP server closed");
      process.exit(0);
    });
  } catch (error: unknown) {
    console.error("❌ Shutdown Error:", error);
    process.exit(1);
  }
};

startServer();

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);