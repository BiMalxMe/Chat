import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createGroup,
  getUserGroups,
  getGroupById,
  addGroupMembers,
  removeGroupMember,
  leaveGroup,
  transferAdmin,
  updateGroup,
  deleteGroup,
} from "../controllers/group.controller.js";

const router = express.Router();

router.post("/", protectRoute, createGroup);
router.get("/", protectRoute, getUserGroups);
router.get("/:groupId", protectRoute, getGroupById);
router.post("/:groupId/members", protectRoute, addGroupMembers);
router.delete("/:groupId/members/:memberId", protectRoute, removeGroupMember);
router.delete("/:groupId/leave", protectRoute, leaveGroup);
router.put("/:groupId/transfer-admin", protectRoute, transferAdmin);
router.put("/:groupId", protectRoute, updateGroup);
router.delete("/:groupId", protectRoute, deleteGroup);

export default router;
