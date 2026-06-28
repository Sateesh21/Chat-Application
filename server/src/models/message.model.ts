import mongoose, {Document, model, Schema, Types} from "mongoose";
type MessageType = "text" | "image";

export interface messageInterface extends Document {
  roomId: Types.ObjectId;
  senderId: Types.ObjectId;
  text: string;
  messageType: MessageType;
  readBy: Types.ObjectId[];
  createdAt: Date;
}

const messageSchema = new Schema<messageInterface>({
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true},
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true},
    text: { type: String, required: true},
    messageType: { type: String, enum: ["text", "image"], required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
},
{
    timestamps: true,
});

const Message = model<messageInterface>("Message", messageSchema);
export default Message;