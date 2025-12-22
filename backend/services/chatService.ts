import { Chat, User } from "../db/db";

export const saveChatConversation = async ({
  from,
  to,
  msg,
}: {
  from: string;
  to: string;
  msg: string;
}) => {
  console.log("Saving message from", from, "to", to);
  const fromUser = await User.findOne({ email: from });
  const toUser = await User.findOne({ email: to });

  if (!fromUser || !toUser) throw new Error("Invalid users");

  const chat = new Chat({
    from: fromUser._id,
    to: toUser._id,
    message: msg,
  });

  return await chat.save();
};

export const getConversation = async ({
  userEmail1,
  userEmail2,
  limit = 50,
}: {
  userEmail1: string;
  userEmail2: string;
  limit?: number;
}) => {
  const user1 = await User.findOne({ email: userEmail1 });
  const user2 = await User.findOne({ email: userEmail2 });

  if (!user1 || !user2) return [];

  return await Chat.find({
    $or: [
      { from: user1._id, to: user2._id },
      { from: user2._id, to: user1._id },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("from", "userName email")
    .populate("to", "userName email");
};
