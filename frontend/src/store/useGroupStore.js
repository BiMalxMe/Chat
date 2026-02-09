import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useGroupStore = create((set, get) => ({
  groups: [],
  selectedGroup: null,
  isGroupsLoading: false,
  isGroupCreating: false,
  isGroupUpdating: false,

  setSelectedGroup: (selectedGroup) => set({ selectedGroup }),

  getUserGroups: async () => {
    set({ isGroupsLoading: true });
    try {
      const res = await axiosInstance.get("/groups");
      set({ groups: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load groups");
    } finally {
      set({ isGroupsLoading: false });
    }
  },

  createGroup: async (groupData) => {
    console.log("Creating group with data:", groupData);
    set({ isGroupCreating: true });
    try {
      const res = await axiosInstance.post("/groups", groupData);
      console.log("Group created successfully:", res.data);
      const { groups } = get();
      set({ groups: [res.data, ...groups] });
      toast.success("Group created successfully");
      return res.data;
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.response?.data?.message || "Failed to create group");
      throw error;
    } finally {
      set({ isGroupCreating: false });
    }
  },

  updateGroup: async (groupId, groupData) => {
    set({ isGroupUpdating: true });
    try {
      const res = await axiosInstance.put(`/groups/${groupId}`, groupData);
      const { groups, selectedGroup } = get();
      
      if (selectedGroup?._id === groupId) {
        set({ selectedGroup: res.data });
      }
      
      set({ 
        groups: groups.map(group => 
          group._id === groupId ? res.data : group
        )
      });
      
      toast.success("Group updated successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update group");
      throw error;
    } finally {
      set({ isGroupUpdating: false });
    }
  },

  addGroupMembers: async (groupId, memberIds) => {
    try {
      const res = await axiosInstance.post(`/groups/${groupId}/members`, { memberIds });
      const { groups, selectedGroup } = get();
      
      if (selectedGroup?._id === groupId) {
        set({ selectedGroup: res.data });
      }
      
      set({ 
        groups: groups.map(group => 
          group._id === groupId ? res.data : group
        )
      });
      
      toast.success("Members added successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add members");
      throw error;
    }
  },

  removeGroupMember: async (groupId, memberId) => {
    try {
      const res = await axiosInstance.delete(`/groups/${groupId}/members/${memberId}`);
      const { groups, selectedGroup } = get();
      
      if (selectedGroup?._id === groupId) {
        set({ selectedGroup: res.data });
      }
      
      set({ 
        groups: groups.map(group => 
          group._id === groupId ? res.data : group
        )
      });
      
      toast.success("Member removed successfully");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove member");
      throw error;
    }
  },

  leaveGroup: async (groupId) => {
    try {
      await axiosInstance.delete(`/groups/${groupId}/leave`);
      const { groups, selectedGroup } = get();
      
      set({ 
        groups: groups.filter(group => group._id !== groupId),
        selectedGroup: selectedGroup?._id === groupId ? null : selectedGroup
      });
      
      toast.success("Left group successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave group");
      throw error;
    }
  },

  subscribeToGroupEvents: () => {
    const socket = useAuthStore.getState().socket;

    socket.on("newGroup", (newGroup) => {
      const { groups } = get();
      set({ groups: [newGroup, ...groups] });
      toast.success(`You've been added to group: ${newGroup.name}`);
    });

    socket.on("addedToGroup", (group) => {
      const { groups } = get();
      set({ groups: [group, ...groups] });
      toast.success(`You've been added to group: ${group.name}`);
    });

    socket.on("removedFromGroup", ({ groupId, groupName }) => {
      const { groups, selectedGroup } = get();
      set({ 
        groups: groups.filter(group => group._id !== groupId),
        selectedGroup: selectedGroup?._id === groupId ? null : selectedGroup
      });
      toast.error(`You've been removed from group: ${groupName}`);
    });

    socket.on("groupUpdated", (updatedGroup) => {
      const { groups, selectedGroup } = get();
      
      if (selectedGroup?._id === updatedGroup._id) {
        set({ selectedGroup: updatedGroup });
      }
      
      set({ 
        groups: groups.map(group => 
          group._id === updatedGroup._id ? updatedGroup : group
        )
      });
    });
  },

  unsubscribeFromGroupEvents: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newGroup");
    socket.off("addedToGroup");
    socket.off("removedFromGroup");
    socket.off("groupUpdated");
  },
}));
