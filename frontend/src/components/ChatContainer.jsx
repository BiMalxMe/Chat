import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import ImageViewer from "./ImageViewer";

function ChatContainer() {
  const {
    selectedUser,
    selectedGroup,
    getMessagesByUserId,
    getMessagesByGroupId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    console.log("ChatContainer useEffect:", { selectedUser, selectedGroup });
    if (selectedUser) {
      console.log("Loading messages for user:", selectedUser._id);
      getMessagesByUserId(selectedUser._id);
    } else if (selectedGroup) {
      console.log("Loading messages for group:", selectedGroup._id);
      getMessagesByGroupId(selectedGroup._id);
    }
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, selectedGroup, getMessagesByUserId, getMessagesByGroupId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getChatName = () => {
    if (selectedUser) return selectedUser.fullName;
    if (selectedGroup) return selectedGroup.name;
    return "";
  };

  const isGroupChat = !!selectedGroup;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday " + date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString() + " " + date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    }
  };

  console.log("ChatContainer render:", { 
    isGroupChat, 
    messagesLength: messages.length, 
    isMessagesLoading,
    selectedGroupName: selectedGroup?.name,
    selectedUserName: selectedUser?.fullName
  });

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => {
                // Handle both string and object senderId
                const senderId = typeof msg.senderId === 'string' 
                  ? msg.senderId 
                  : msg.senderId._id;
                  
                const isOwnMessage = senderId === authUser._id;
                
                console.log("Message display check:", {
                  messageId: msg._id,
                  msgSenderId: msg.senderId,
                  senderId,
                  authUserId: authUser._id,
                  isOwnMessage,
                  isGroupChat
                });
                return (
                  <div
                    key={msg._id}
                    className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
                  >
                    <div
                      className={`chat-bubble relative ${
                        isOwnMessage
                          ? "bg-cyan-600 text-white"
                          : "bg-slate-800 text-slate-200"
                      } ${msg.isOptimistic ? "opacity-70" : ""}`}
                    >
                      {/* Show sender name for group messages */}
                      {isGroupChat && !isOwnMessage && (
                        <p className="text-xs font-medium text-cyan-400 mb-1">
                          {msg.senderId?.fullName || msg.senderId?.email || "Unknown User"}
                        </p>
                      )}
                      
                      {msg.image && (
                        <img 
                          src={msg.image} 
                          alt="Shared" 
                          className="rounded-lg h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setFullscreenImage(msg.image)}
                        />
                      )}
                      
                      {msg.voice && (
                        <div className="mt-2">
                          <audio src={msg.voice} controls className="h-10 w-64" />
                        </div>
                      )}
                      
                      {msg.text && <p className="mt-2 whitespace-pre-wrap">{msg.text}</p>}
                      
                      <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                        {msg.isOptimistic ? (
                          <span className="italic">Sending...</span>
                        ) : (
                          formatTime(msg.createdAt)
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={getChatName()} isGroup={isGroupChat} />
        )}
      </div>

      <MessageInput />

      {fullscreenImage && (
        <ImageViewer
          src={fullscreenImage}
          alt="Full screen image"
          onClose={() => setFullscreenImage(null)}
        />
      )}
    </>
  );
}

export default ChatContainer;
