import { useState, useEffect } from "react";
import { useGroupStore } from "../store/useGroupStore";
import { useChatStore } from "../store/useChatStore";
import { PlusIcon, UsersIcon } from "lucide-react";
import CreateGroupModal from "./CreateGroupModal";
import GroupAvatar from "./GroupAvatar";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

function GroupsList() {
  const { groups, isGroupsLoading } = useGroupStore();
  const { selectedGroup, setSelectedGroup, getAllContacts, allContacts } = useChatStore();
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

  useEffect(() => {
    console.log("GroupsList mounted, loading contacts...");
    getAllContacts();
  }, [getAllContacts]);

  const handleGroupClick = (group) => {
    console.log("Group clicked:", group.name, group._id);
    setSelectedGroup(group);
  };

  const handleCreateGroupClick = () => {
    console.log("Create Group button clicked in GroupsList");
    console.log("Available contacts:", allContacts.length);
    setShowCreateGroupModal(true);
  };

  console.log("GroupsList render:", { groupsLength: groups.length, showCreateGroupModal });

  if (isGroupsLoading) {
    return <UsersLoadingSkeleton />;
  }

  if (groups.length === 0) {
    return (
      <>
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto">
              <UsersIcon className="size-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-300">No groups yet</h3>
              <p className="text-sm text-slate-500 mt-1">
                Create your first group to start chatting with multiple people
              </p>
            </div>
            <button
              onClick={handleCreateGroupClick}
              className="btn btn-sm bg-cyan-500 hover:bg-cyan-600 text-white border-none"
            >
              <PlusIcon className="size-4" />
              Create Group
            </button>
          </div>
        </div>
        
        {showCreateGroupModal && (
          <>
            {console.log("Rendering CreateGroupModal from empty state")}
            <CreateGroupModal onClose={() => setShowCreateGroupModal(false)} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {groups.map((group) => (
            <button
              key={group._id}
              onClick={() => handleGroupClick(group)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                selectedGroup?._id === group._id
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "hover:bg-slate-700/50 text-slate-300"
              }`}
            >
              <GroupAvatar group={group} />
              <div className="flex-1 text-left">
                <div className="font-medium truncate">{group.name}</div>
                <div className="text-sm text-slate-500">
                  {group.members.length} members
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-2 border-t border-slate-700">
        <button
          onClick={handleCreateGroupClick}
          className="w-full btn btn-sm bg-cyan-500 hover:bg-cyan-600 text-white border-none"
        >
          <PlusIcon className="size-4" />
          Create Group
        </button>
      </div>

      {showCreateGroupModal && (
        <CreateGroupModal onClose={() => setShowCreateGroupModal(false)} />
      )}
    </>
  );
}

export default GroupsList;
