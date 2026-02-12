import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  selectedGroup: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser, selectedGroup: null, messages: [] }),
  setSelectedGroup: (selectedGroup) => set({ selectedGroup, selectedUser: null, messages: [] }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  getMessagesByGroupId: async (groupId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/group/${groupId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      voice: messageData.voice,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: messages.filter(msg => msg._id !== tempId).concat(res.data) });
    } catch (error) {
      set({ messages: messages.filter(msg => msg._id !== tempId) });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  sendGroupMessage: async (messageData) => {
    const { selectedGroup, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      groupId: selectedGroup._id,
      text: messageData.text,
      image: messageData.image,
      voice: messageData.voice,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(`/messages/group/${selectedGroup._id}/send`, messageData);
      set({ messages: messages.filter(msg => msg._id !== tempId).concat(res.data) });
    } catch (error) {
      set({ messages: messages.filter(msg => msg._id !== tempId) });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, selectedGroup, isSoundEnabled } = get();
    const { authUser } = useAuthStore.getState();
    const socket = useAuthStore.getState().socket;

    // Listen for direct messages
    socket.on("newMessage", (newMessage) => {
      console.log("=== DIRECT MESSAGE RECEIVED ===");
      console.log("newMessage received:", newMessage);
      console.log("selectedUser:", selectedUser);
      console.log("authUser:", authUser);
      console.log("isSoundEnabled:", isSoundEnabled);
      
      // Handle both string and object senderId
      const senderId = typeof newMessage.senderId === 'string' 
        ? newMessage.senderId 
        : newMessage.senderId._id;
      
      const receiverId = typeof newMessage.receiverId === 'string'
        ? newMessage.receiverId
        : newMessage.receiverId._id;
      
      console.log("Processed IDs:", { senderId, receiverId });
      
      // Check if this message is relevant to the current chat
      const isRelevant = selectedUser && (
        (senderId === selectedUser._id && receiverId === authUser._id) ||
        (senderId === authUser._id && receiverId === selectedUser._id)
      );
      
      console.log("isRelevant:", isRelevant);
      console.log("Message details:", {
        senderId,
        receiverId,
        selectedUserId: selectedUser?._id,
        authUserId: authUser._id
      });
      
      if (!isRelevant) {
        console.log("Message not relevant, skipping");
        return;
      }

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (isSoundEnabled) {
        console.log("Attempting to play notification sound...");
        try {
          const notificationSound = new Audio("/sounds/notification.mp3");
          console.log("Audio object created:", notificationSound);
          
          notificationSound.currentTime = 0;
          notificationSound.play().then(() => {
            console.log("Sound played successfully");
          }).catch((e) => {
            console.error("Audio play failed:", e);
          });
        } catch (error) {
          console.error("Error creating audio object:", error);
        }
      } else {
        console.log("Sound is disabled");
      }
    });

    // Listen for group messages
    socket.on("newGroupMessage", ({ message, groupId }) => {
      console.log("=== GROUP MESSAGE RECEIVED ===");
      console.log("groupMessage received:", message);
      console.log("groupId:", groupId);
      console.log("selectedGroup:", selectedGroup);
      console.log("isSoundEnabled:", isSoundEnabled);
      
      if (!selectedGroup || groupId !== selectedGroup._id) {
        console.log("Group message not relevant, skipping");
        return;
      }

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, message] });

      if (isSoundEnabled) {
        console.log("Attempting to play group notification sound...");
        try {
          const notificationSound = new Audio("/sounds/notification.mp3");
          notificationSound.currentTime = 0;
          notificationSound.play().then(() => {
            console.log("Group sound played successfully");
          }).catch((e) => {
            console.error("Group audio play failed:", e);
          });
        } catch (error) {
          console.error("Error creating group audio object:", error);
        }
      } else {
        console.log("Sound is disabled for group message");
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("newGroupMessage");
  },
}));
