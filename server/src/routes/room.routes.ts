import express from "express";
import { createRoom, getMyRooms, getMessages } from "../controllers/room.controller";
import validate from "../middlewares/validate.middleware";
import { createRoomValidator } from "../validators/room.validator";
import { authMiddleware } from "../middlewares/auth.middleware";

const roomRouter = express.Router();

roomRouter.post("/", authMiddleware, validate(createRoomValidator), createRoom);
roomRouter.get("/", authMiddleware, getMyRooms);
roomRouter.get("/:roomId/messages", authMiddleware, getMessages);

export default roomRouter;