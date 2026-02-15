import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useGroupStore } from "../store/useGroupStore";
import { useAuthStore } from "../store/useAuthStore";
import { useQuizStore } from "../store/useQuizStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import GroupsList from "../components/GroupsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import QuizRoom from "../components/QuizRoom";
import QuizInvitation from "../components/QuizInvitation";

function ChatPage() {
  const { activeTab, selectedUser, selectedGroup } = useChatStore();
  const { getUserGroups, subscribeToGroupEvents, unsubscribeFromGroupEvents } = useGroupStore();
  const { socket } = useAuthStore();
  const { invitation } = useQuizStore();

  useEffect(() => {
    getUserGroups();
  }, [getUserGroups]);

  useEffect(() => {
    if (socket) {
      subscribeToGroupEvents();
      return () => {
        unsubscribeFromGroupEvents();
      };
    }
  }, [socket, subscribeToGroupEvents, unsubscribeFromGroupEvents]);

  const renderLeftContent = () => {
    switch (activeTab) {
      case "chats":
        return <ChatsList />;
      case "groups":
        return <GroupsList />;
      case "contacts":
        return <ContactList />;
      default:
        return <ChatsList />;
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-black">
      <div className="relative w-full max-w-6xl h-[800px]">
        <BorderAnimatedContainer>
          {/* LEFT SIDE */}
          <div className="w-80 bg-zinc-900/50 backdrop-blur-sm flex flex-col border-r border-zinc-800/50">
            <ProfileHeader />
            <ActiveTabSwitch />

            <div className="flex-1 overflow-y-auto">
              {renderLeftContent()}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 flex flex-col bg-black/50 backdrop-blur-sm">
            {(selectedUser || selectedGroup) ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </BorderAnimatedContainer>

        {/* Quiz Components */}
        {invitation && <QuizInvitation />}
        <QuizRoom />
      </div>
    </div>
  );
}

export default ChatPage;
