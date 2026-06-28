import { Document, Schema, model } from "mongoose";

type NotificationType = "message" | "mention";

export interface notificationInterface extends Document {
  userId: Schema.Types.ObjectId;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<notificationInterface>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["message", "mention"], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Notification = model<notificationInterface>("Notification", notificationSchema);

export default Notification;
