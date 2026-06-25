import mongoose, { Document, Schema } from "mongoose";

//Interface
export interface userInterface extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

//Mongoose schema
const userSchema = new Schema<userInterface>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true},
    avatar: { type: String, default: ""},
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);


const User = mongoose.model<userInterface>("User", userSchema);
export default User;
