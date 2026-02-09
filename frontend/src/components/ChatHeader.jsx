import { XIcon, UsersIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import GroupAvatar from "./GroupAvatar";
import CallButton from "./CallButton";

function ChatHeader() {
  const { selectedUser, selectedGroup, setSelectedUser, setSelectedGroup } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isGroupChat = !!selectedGroup;
  const chatEntity = selectedGroup || selectedUser;
  const isOnline = !isGroupChat && onlineUsers.includes(selectedUser?._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        setSelectedUser(null);
        setSelectedGroup(null);
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser, setSelectedGroup]);

  const handleClose = () => {
    setSelectedUser(null);
    setSelectedGroup(null);
  };

  const getChatInfo = () => {
    if (isGroupChat) {
      return {
        name: selectedGroup.name,
        subtitle: `${selectedGroup.members.length} members`,
        avatar: <GroupAvatar group={selectedGroup} size="md" />,
      };
    } else {
      return {
        name: selectedUser.fullName,
        subtitle: isOnline ? "Online" : "Offline",
        avatar: (
          <div className={`avatar ${isOnline ? "online" : "offline"}`}>
            <div className="w-12 rounded-full">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>
        ),
      };
    }
  };

  const { name, subtitle, avatar } = getChatInfo();

  return (
    <div className="flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1">
      <div className="flex items-center space-x-3">
        {avatar}
        <div>
          <h3 className="text-slate-200 font-medium">{name}</h3>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            {isGroupChat && <UsersIcon className="size-4" />}
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {!isGroupChat && selectedUser && (
          <CallButton
            targetUserId={selectedUser._id}
            targetUserName={selectedUser.fullName}
            isOnline={isOnline}
          />
        )}
        <button onClick={handleClose}>
          <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
