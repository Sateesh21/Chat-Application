import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { instrument } from "@socket.io/admin-ui";
import { chatHandler } from "./handlers/chat.handler";

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5501",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  // socket auth middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Unauthorized - no token provided"));
      }

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      ) as { userId: string };

      socket.data.user = { userId: decoded.userId };
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  // handle connections
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.data.user.userId}`);

    // register chat events
    chatHandler(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.data.user.userId}`);
    });
  });

  instrument(io, {
    auth: false,
    mode: "development",
  });

  return io;
};
