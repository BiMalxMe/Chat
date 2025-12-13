import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URL || "");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//lets create a chat model where the chat are stored for only 1 week

const chatSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
// TTL means time to live
// Set TTL index to automatically delete chats after 7 days (604800 seconds)
chatSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });


export const Chat = mongoose.model("Chat", chatSchema);
export const User = mongoose.model("User", userSchema);
