import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';
import toast from 'react-hot-toast';

// Extract mentions from message text
const extractMentions = (text) => {
  const mentionRegex = /@(\w+(?:\s+\w+)*)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }
  
  return mentions;
};

// Find user ID by name in group
const findUserIdByName = (name, groupMembers) => {
  const member = groupMembers.find(member => 
    member.fullName.toLowerCase() === name.toLowerCase()
  );
  return member?._id;
};

function useMentionNotifications() {
  const { authUser } = useAuthStore();
  const { selectedGroup, messages } = useChatStore();

  useEffect(() => {
    if (!selectedGroup || !messages.length) return;

    // Get all group members
    const groupMembers = selectedGroup.members || [];
    
    // Check recent messages for mentions
    const recentMessages = messages.slice(-10); // Check last 10 messages
    
    recentMessages.forEach(msg => {
      // Skip own messages
      if (msg.senderId === authUser._id) return;
      
      // Skip messages without text
      if (!msg.text) return;
      
      // Extract mentions from message
      const mentions = extractMentions(msg.text);
      
      // Check if current user is mentioned
      const isMentioned = mentions.some(mention => 
        mention.toLowerCase() === authUser.fullName.toLowerCase()
      );
      
      if (isMentioned) {
        // Show notification for mention
        const senderName = typeof msg.senderId === 'string' 
          ? msg.senderId 
          : msg.senderId?.fullName || msg.senderId?.email || 'Someone';
        
        toast(`${senderName} mentioned you in ${selectedGroup.name}`, {
          icon: '🏷️',
          duration: 5000,
          position: 'top-right',
          style: {
            background: '#0891b2',
            color: 'white',
            padding: '16px',
            fontSize: '14px',
            borderRadius: '8px',
          },
        });
      }
    });
  }, [messages, selectedGroup, authUser]);

  return null;
}

export default useMentionNotifications;
