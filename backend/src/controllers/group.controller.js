import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Group from "../models/Group.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    const adminId = req.user._id;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Group name is required." });
    }

    if (!memberIds || memberIds.length === 0) {
      return res.status(400).json({ message: "At least one member is required." });
    }

    // Add admin to members if not already included
    const allMemberIds = [...new Set([adminId, ...memberIds])];

    // Verify all members exist
    const existingMembers = await User.find({ _id: { $in: allMemberIds } });
    if (existingMembers.length !== allMemberIds.length) {
      return res.status(404).json({ message: "One or more members not found." });
    }

    const newGroup = new Group({
      name: name.trim(),
      description: description?.trim() || "",
      admin: adminId,
      members: allMemberIds,
    });

    await newGroup.save();
    await newGroup.populate("members", "fullName email profilePic");
    await newGroup.populate("admin", "fullName email profilePic");

    // Notify all group members about the new group
    newGroup.members.forEach((member) => {
      if (member._id.toString() !== adminId.toString()) {
        const memberSocketId = getReceiverSocketId(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("newGroup", newGroup);
        }
      }
    });

    res.status(201).json(newGroup);
  } catch (error) {
    console.log("Error in createGroup controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ 
      members: userId 
    })
    .populate("admin", "fullName email profilePic")
    .populate("members", "fullName email profilePic")
    .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.log("Error in getUserGroups controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findOne({ 
      _id: groupId, 
      members: userId 
    })
    .populate("admin", "fullName email profilePic")
    .populate("members", "fullName email profilePic");

    if (!group) {
      return res.status(404).json({ message: "Group not found or you're not a member." });
    }

    res.status(200).json(group);
  } catch (error) {
    console.log("Error in getGroupById controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberIds } = req.body;
    const userId = req.user._id;

    if (!memberIds || memberIds.length === 0) {
      return res.status(400).json({ message: "At least one member is required." });
    }

    const group = await Group.findOne({ _id: groupId, admin: userId });
    if (!group) {
      return res.status(403).json({ message: "Only group admin can add members." });
    }

    // Verify new members exist
    const existingMembers = await User.find({ _id: { $in: memberIds } });
    if (existingMembers.length !== memberIds.length) {
      return res.status(404).json({ message: "One or more members not found." });
    }

    // Add new members (avoiding duplicates)
    const newMemberIds = memberIds.filter(
      (id) => !group.members.includes(id)
    );
    group.members.push(...newMemberIds);
    await group.save();

    await group.populate("members", "fullName email profilePic");

    // Notify new members
    newMemberIds.forEach((memberId) => {
      const memberSocketId = getReceiverSocketId(memberId.toString());
      if (memberSocketId) {
        io.to(memberSocketId).emit("addedToGroup", group);
      }
    });

    res.status(200).json(group);
  } catch (error) {
    console.log("Error in addGroupMembers controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const userId = req.user._id;

    const group = await Group.findOne({ _id: groupId, admin: userId });
    if (!group) {
      return res.status(403).json({ message: "Only group admin can remove members." });
    }

    if (memberId === userId.toString()) {
      return res.status(400).json({ message: "Admin cannot remove themselves." });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== memberId
    );
    await group.save();

    await group.populate("members", "fullName email profilePic");

    // Notify removed member
    const removedMemberSocketId = getReceiverSocketId(memberId);
    if (removedMemberSocketId) {
      io.to(removedMemberSocketId).emit("removedFromGroup", { groupId, groupName: group.name });
    }

    res.status(200).json(group);
  } catch (error) {
    console.log("Error in removeGroupMember controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findOne({ _id: groupId, members: userId });
    if (!group) {
      return res.status(404).json({ message: "Group not found or you're not a member." });
    }

    if (group.admin.toString() === userId.toString()) {
      return res.status(400).json({ message: "Admin cannot leave the group. Transfer admin rights first." });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== userId.toString()
    );
    await group.save();

    res.status(200).json({ message: "Left the group successfully." });
  } catch (error) {
    console.log("Error in leaveGroup controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const transferAdmin = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { newAdminId } = req.body;
    const currentAdminId = req.user._id;

    const group = await Group.findOne({ _id: groupId, admin: currentAdminId });
    if (!group) {
      return res.status(403).json({ message: "Only current admin can transfer admin rights." });
    }

    // Verify new admin is a member of the group
    if (!group.members.includes(newAdminId)) {
      return res.status(400).json({ message: "New admin must be a member of the group." });
    }

    // Transfer admin rights
    group.admin = newAdminId;
    await group.save();

    await group.populate("admin", "fullName email profilePic");
    await group.populate("members", "fullName email profilePic");

    // Notify all group members about admin change
    group.members.forEach((member) => {
      const memberSocketId = getReceiverSocketId(member._id.toString());
      if (memberSocketId) {
        io.to(memberSocketId).emit("adminTransferred", {
          groupId: group._id,
          groupName: group.name,
          newAdminId,
          newAdminName: group.admin.fullName
        });
      }
    });

    res.status(200).json(group);
  } catch (error) {
    console.log("Error in transferAdmin controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description, groupPic } = req.body;
    const userId = req.user._id;

    const group = await Group.findOne({ _id: groupId, admin: userId });
    if (!group) {
      return res.status(403).json({ message: "Only group admin can update the group." });
    }

    let imageUrl;
    if (groupPic) {
      const uploadResponse = await cloudinary.uploader.upload(groupPic);
      imageUrl = uploadResponse.secure_url;
      group.groupPic = imageUrl;
    }

    if (name) group.name = name.trim();
    if (description !== undefined) group.description = description.trim();

    await group.save();
    await group.populate("admin", "fullName email profilePic");
    await group.populate("members", "fullName email profilePic");

    // Notify all group members about the update
    group.members.forEach((member) => {
      const memberSocketId = getReceiverSocketId(member._id.toString());
      if (memberSocketId) {
        io.to(memberSocketId).emit("groupUpdated", group);
      }
    });

    res.status(200).json(group);
  } catch (error) {
    console.log("Error in updateGroup controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
