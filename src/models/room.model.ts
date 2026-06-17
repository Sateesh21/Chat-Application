import { Document, Schema, model } from "mongoose";

type RoomType = "direct" | "group";

export interface roomInterface extends Document {
  name?: string;
  type: RoomType;
  members: Schema.Types.ObjectId[];
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
}

const roomSchema = new Schema<roomInterface>(
  {
    name: { type: String, trim: true },
    type: { type: String, enum: ["direct", "group"], required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

const Room = model<roomInterface>("Room", roomSchema);
export default Room;
