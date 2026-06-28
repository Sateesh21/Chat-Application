import { Request, Response } from "express";
import { Types } from "mongoose";
import Room from "../models/room.model";
import Message from "../models/message.model";

// create room
export const createRoom = async (req: Request, res: Response) => {
  try {
    const { type, members, name } = req.body; //get the details from the user
    const userId = req.user?.userId;  //to know that the user is loggedin or not

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized-please login",
      });
    }

    const createdBy = new Types.ObjectId(userId!); //Loggedin user's id

    const allMembers = [...members, userId]; 

    if (type === "direct") {
      const existingRoom = await Room.findOne({
        type: "direct",
        members: { $all: allMembers, $size: 2 },
      });

      if (existingRoom) {
        return res.status(200).json({
          success: true,
          message: "Room already exists",
          room: existingRoom,
        });
      }
    }

    const newRoom = await Room.create({
      type,
      name,
      members: allMembers,
      createdBy,
    });

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: newRoom,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//get the room
export const getMyRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find({ members: req.user?.userId })
      .populate("members", "name email avatar");

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rooms found",
      });
    }

    return res.status(200).json({
      success: true,
      rooms,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//get a messages
export const getMessages = async (req: Request, res: Response) => {
  try {
    let { roomId } = req.params as { roomId?: string | string[] };
    if (Array.isArray(roomId)) roomId = roomId[0];
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    if (!roomId) {
      return res.status(400).json({ success: false, message: "roomId is required" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const isMember = room.members.some(
      (memberId) => memberId.toString() === req.user?.userId
    );
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied - you are not a member of this room",
      });
    }

    const messages = await Message.find({ roomId: new Types.ObjectId(roomId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "name avatar");

    return res.status(200).json({
      success: true,
      page,
      limit,
      messages,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};