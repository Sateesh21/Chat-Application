import { Socket, Server } from "socket.io";
import Message from "../../models/message.model";
import Room from "../../models/room.model";
import { Types } from "mongoose";

export const chatHandler = (io: Server, socket: Socket) => {

  // join all rooms the user belongs to
  const joinRooms = async () => {
    try {
      const userId = socket.data.user.userId;
      const rooms = await Room.find({ members: userId });

      rooms.forEach((room) => {
        socket.join(room._id.toString());
      });

      console.log(`User ${userId} joined ${rooms.length} rooms`);
    } catch (error) {
      socket.emit("error", { message: "Failed to join rooms" });
    }
  };

  // send a message to a room
  const sendMessage = async ({
    roomId,
    text,
    messageType = "text",
  }: {
    roomId: string;
    text: string;
    messageType?: "text" | "image";
  }) => {
    try {
      const senderId = socket.data.user.userId;

      // verify user is a member of this room
      const room = await Room.findById(roomId);
      if (!room) {
        return socket.emit("error", { message: "Room not found" });
      }

      const isMember = room.members.some(
        (memberId) => memberId.toString() === senderId
      );
      if (!isMember) {
        return socket.emit("error", { message: "Access denied" });
      }

      // save message to MongoDB
      const message = await Message.create({
        roomId: new Types.ObjectId(roomId),
        senderId: new Types.ObjectId(senderId),
        text,
        messageType,
        readBy: [new Types.ObjectId(senderId)], // sender has already read it
      });

      // populate sender details before emitting
      const populatedMessage = await message.populate("senderId", "name avatar");

      // emit to everyone in the room
      io.to(roomId).emit("new-message", populatedMessage);

    } catch (error) {
      socket.emit("error", { message: "Failed to send message" });
    }
  };

  // typing indicators
  const typingStart = ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("typing", {
      userId: socket.data.user.userId,
      roomId,
      isTyping: true,
    });
  };

  const typingStop = ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("typing", {
      userId: socket.data.user.userId,
      roomId,
      isTyping: false,
    });
  };

  // mark messages as read
  const markRead = async ({ roomId }: { roomId: string }) => {
    try {
      const userId = socket.data.user.userId;

      // update all unread messages in this room
      await Message.updateMany(
        {
          roomId: new Types.ObjectId(roomId),
          readBy: { $ne: new Types.ObjectId(userId) },
        },
        {
          $push: { readBy: new Types.ObjectId(userId) },
        }
      );

      // notify room that this user has read the messages
      socket.to(roomId).emit("messages-read", {
        roomId,
        userId,
      });

    } catch (error) {
      socket.emit("error", { message: "Failed to mark messages as read" });
    }
  };

  // register all events
  socket.on("join-rooms", joinRooms);
  socket.on("send-message", sendMessage);
  socket.on("typing-start", typingStart);
  socket.on("typing-stop", typingStop);
  socket.on("mark-read", markRead);
};