import { XIcon, UsersIcon, LogOutIcon, CrownIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupStore } from "../store/useGroupStore";
import GroupAvatar from "./GroupAvatar";
import CallButton from "./CallButton";
import QuizButton from "./QuizButton";
import GroupMembers from "./GroupMembers";

function ChatHeader() {
  const { selectedUser, selectedGroup, setSelectedUser, setSelectedGroup } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { leaveGroup } = useGroupStore();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const isGroupChat = !!selectedGroup;
  const chatEntity = selectedGroup || selectedUser;
  const isOnline = !isGroupChat && onlineUsers.includes(selectedUser?._id);
  const isAdmin = isGroupChat && selectedGroup?.admin?._id === useAuthStore.getState().authUser?._id;

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

  const handleLeaveGroup = async () => {
    if (selectedGroup) {
      try {
        await leaveGroup(selectedGroup._id);
        setShowLeaveConfirm(false);
      } catch (error) {
        // Error is handled in the store
      }
    }
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
    <>
      <div className="flex justify-between items-center bg-zinc-900/50 border-b border-zinc-800/50 max-h-[84px] px-6 flex-1">
        <div className="flex items-center space-x-3">
          {avatar}
          <div>
            <h3 className="text-white font-medium">{name}</h3>
            <p className="text-zinc-400 text-sm flex items-center gap-1">
              {isGroupChat && <UsersIcon className="size-4" />}
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isGroupChat && selectedUser && (
            <>
              <QuizButton />
              <CallButton
                targetUserId={selectedUser._id}
                targetUserName={selectedUser.fullName}
                isOnline={isOnline}
              />
            </>
          )}
          
          {isGroupChat && (
            <>
              {isAdmin && (
                <button
                  onClick={() => setShowMembers(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-all duration-200"
                  title="Manage members"
                >
                  <CrownIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Manage</span>
                </button>
              )}
              
              <button
                onClick={() => setShowLeaveConfirm(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                title="Leave group"
              >
                <LogOutIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Leave</span>
              </button>
            </>
          )}
          
          <button onClick={handleClose}>
            <XIcon className="w-5 h-5 text-zinc-400 hover:text-white transition-colors cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Leave Group Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 max-w-md w-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <LogOutIcon className="w-8 h-8 text-red-400" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Leave Group?</h3>
                <p className="text-zinc-400">
                  Are you sure you want to leave <span className="font-medium text-amber-400">{selectedGroup?.name}</span>? 
                  You'll need to be re-added to join this group again.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowLeaveConfirm(false)}
                  className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLeaveGroup}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
                >
                  Leave Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Group Members Modal */}
      {showMembers && selectedGroup && (
        <GroupMembers 
          group={selectedGroup} 
          onClose={() => setShowMembers(false)} 
        />
      )}
    </>
  );
}

export default ChatHeader;
