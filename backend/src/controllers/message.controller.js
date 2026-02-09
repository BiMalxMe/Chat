import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Group from "../models/Group.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).populate("senderId", "fullName profilePic")
      .populate("receiverId", "fullName profilePic");

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessagesByGroupId = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    // Verify user is a member of the group
    const group = await Group.findOne({ _id: groupId, members: userId });
    if (!group) {
      return res.status(403).json({ message: "You're not a member of this group." });
    }

    const messages = await Message.find({ groupId })
      .populate("senderId", "fullName profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessagesByGroupId controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    console.log("=== SEND MESSAGE CALLED ===");
    console.log("Message data:", { text, image: !!image, receiverId, senderId });

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    await newMessage.populate("senderId", "fullName profilePic");
    await newMessage.populate("receiverId", "fullName profilePic");

    console.log("Direct message saved, attempting to emit to receiver:", receiverId);
    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log("Receiver socket ID:", receiverSocketId);
    
    if (receiverSocketId) {
      console.log("Emitting newMessage event to socket:", receiverSocketId);
      io.to(receiverSocketId).emit("newMessage", newMessage);
      console.log("newMessage event emitted successfully");
    } else {
      console.log("Receiver not online, no socket ID found");
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { groupId } = req.params;
    const senderId = req.user._id;

    console.log("sendGroupMessage called:", { text, image: !!image, groupId, senderId });

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }

    // Verify user is a member of the group
    const group = await Group.findOne({ _id: groupId, members: senderId });
    if (!group) {
      console.log("User not member of group:", { groupId, senderId });
      return res.status(403).json({ message: "You're not a member of this group." });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      groupId,
      text,
      image: imageUrl,
    });

    console.log("Saving group message:", newMessage);
    await newMessage.save();
    await newMessage.populate("senderId", "fullName profilePic");
    console.log("Group message saved and populated:", newMessage);

    // Send message to all group members except sender
    group.members.forEach((memberId) => {
      if (memberId.toString() !== senderId.toString()) {
        const memberSocketId = getReceiverSocketId(memberId.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("newGroupMessage", { message: newMessage, groupId });
        }
      }
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendGroupMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // find all the DIRECT messages where the logged-in user is either sender or receiver
    // exclude group messages (where groupId exists but receiverId is null)
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
      receiverId: { $exists: true, $ne: null } // Only include direct messages
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) => {
          // Ensure we have valid IDs before calling toString()
          const senderId = msg.senderId;
          const receiverId = msg.receiverId;
          
          if (!senderId || !receiverId) return null;
          
          return senderId.toString() === loggedInUserId.toString()
            ? receiverId.toString()
            : senderId.toString();
        }).filter(id => id !== null) // Filter out any null values
      ),
    ];

    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

    res.status(200).json(chatPartners);
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
