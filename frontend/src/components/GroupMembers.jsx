import { useState, useEffect } from "react";
import { UsersIcon, CrownIcon, UserIcon, LogOutIcon, ShieldIcon, PlusIcon, Trash2Icon, UserPlusIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useGroupStore } from "../store/useGroupStore";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

function GroupMembers({ group, onClose }) {
  const { authUser } = useAuthStore();
  const { removeGroupMember, transferAdmin, addGroupMembers, deleteGroup } = useGroupStore();
  const { allContacts, getAllContacts } = useChatStore();
  const [showTransferConfirm, setShowTransferConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [action, setAction] = useState("");

  const isAdmin = group.admin._id === authUser._id;
  const memberCount = group.members.length;

  // Get friends who are not yet in the group
  const availableFriends = allContacts.filter(contact => 
    !group.members.some(member => member._id === contact._id) &&
    contact._id !== authUser._id
  );

  useEffect(() => {
    if (showAddMembers) {
      getAllContacts();
    }
  }, [showAddMembers, getAllContacts]);

  const handleTransferAdmin = (member) => {
    setSelectedMember(member);
    setAction("transfer");
    setShowTransferConfirm(true);
  };

  const handleRemoveMember = (member) => {
    setSelectedMember(member);
    setAction("remove");
    setShowRemoveConfirm(true);
  };

  const confirmTransferAdmin = async () => {
    if (selectedMember) {
      try {
        await transferAdmin(group._id, selectedMember._id);
        setShowTransferConfirm(false);
        setSelectedMember(null);
      } catch (error) {
        // Error handled in store
      }
    }
  };

  const confirmRemoveMember = async () => {
    if (selectedMember) {
      try {
        await removeGroupMember(group._id, selectedMember._id);
        setShowRemoveConfirm(false);
        setSelectedMember(null);
      } catch (error) {
        // Error handled in store
      }
    }
  };

  const handleAddMembers = async () => {
    if (selectedFriends.length === 0) {
      toast.error("Please select at least one friend to add");
      return;
    }

    try {
      await addGroupMembers(group._id, selectedFriends);
      setShowAddMembers(false);
      setSelectedFriends([]);
      toast.success(`${selectedFriends.length} member(s) added successfully`);
    } catch (error) {
      // Error handled in store
    }
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(group._id);
      setShowDeleteGroupConfirm(false);
      onClose();
    } catch (error) {
      // Error handled in store
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Group Members</h3>
                  <p className="text-sm text-zinc-400">{group.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => setShowAddMembers(true)}
                      className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all duration-200"
                      title="Add members"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteGroupConfirm(true)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                      title="Delete group"
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
              <UsersIcon className="w-4 h-4" />
              <span>{memberCount} members</span>
              {isAdmin && (
                <span className="ml-auto text-amber-400 flex items-center gap-1">
                  <CrownIcon className="w-4 h-4" />
                  You are admin
                </span>
              )}
            </div>
          </div>

          {/* Members List */}
          <div className="p-4 overflow-y-auto max-h-96">
            <div className="space-y-2">
              {group.members.map((member) => {
                const isCurrentUser = member._id === authUser._id;
                const isMemberAdmin = member._id === group.admin._id;
                
                return (
                  <div
                    key={member._id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isCurrentUser 
                        ? "bg-amber-500/10 border-amber-500/30" 
                        : "bg-zinc-800/50 border-zinc-700/50"
                    } transition-all duration-200`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="avatar">
                          <div className="w-10 rounded-full">
                            <img 
                              src={member.profilePic || "/avatar.png"} 
                              alt={member.fullName} 
                            />
                          </div>
                        </div>
                        {isMemberAdmin && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <CrownIcon className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {member.fullName}
                          {isCurrentUser && <span className="text-amber-400 ml-1">(You)</span>}
                        </p>
                        <p className="text-xs text-zinc-400">{member.email}</p>
                      </div>
                    </div>

                    {/* Admin Controls */}
                    {isAdmin && !isCurrentUser && (
                      <div className="flex items-center gap-1">
                        {!isMemberAdmin && (
                          <button
                            onClick={() => handleTransferAdmin(member)}
                            className="p-1.5 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-all duration-200"
                            title="Make admin"
                          >
                            <CrownIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveMember(member)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                          title="Remove from group"
                        >
                          <LogOutIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Non-admin users see their role */}
                    {!isAdmin && isMemberAdmin && (
                      <div className="flex items-center gap-1 text-amber-400">
                        <CrownIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Admin Info */}
          {isAdmin && (
            <div className="p-4 border-t border-zinc-800 bg-zinc-800/30">
              <div className="flex items-start gap-3">
                <ShieldIcon className="w-5 h-5 text-amber-400 mt-0.5" />
                <div className="text-xs text-zinc-400">
                  <p className="font-medium text-amber-400 mb-1">Admin Privileges:</p>
                  <ul className="space-y-1">
                    <li>• Transfer admin rights to other members</li>
                    <li>• Remove members from group</li>
                    <li>• Update group information</li>
                    <li>• Add new members to group</li>
                    <li>• Delete entire group</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transfer Admin Confirmation Modal */}
      {showTransferConfirm && action === "transfer" && selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 max-w-sm w-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto">
                <CrownIcon className="w-8 h-8 text-amber-400" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Transfer Admin Rights?</h3>
                <p className="text-zinc-400">
                  Are you sure you want to make <span className="font-medium text-amber-400">{selectedMember.fullName}</span> the new admin of <span className="font-medium text-amber-400">{group.name}</span>?
                </p>
                <p className="text-xs text-red-400 mt-2">
                  You will lose admin privileges after this transfer.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowTransferConfirm(false)}
                  className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmTransferAdmin}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors font-medium"
                >
                  Transfer Admin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Member Confirmation Modal */}
      {showRemoveConfirm && action === "remove" && selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 max-w-sm w-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <LogOutIcon className="w-8 h-8 text-red-400" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Remove Member?</h3>
                <p className="text-zinc-400">
                  Are you sure you want to remove <span className="font-medium text-red-400">{selectedMember.fullName}</span> from <span className="font-medium text-red-400">{group.name}</span>?
                </p>
                <p className="text-xs text-zinc-400 mt-2">
                  They will need to be re-added to join this group again.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowRemoveConfirm(false)}
                  className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRemoveMember}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
                >
                  Remove Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal */}
      {showAddMembers && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <UserPlusIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Add Members</h3>
                    <p className="text-sm text-zinc-400">Select friends to add to {group.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAddMembers(false);
                    setSelectedFriends([]);
                  }}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto max-h-96">
              {availableFriends.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UsersIcon className="w-8 h-8 text-zinc-600" />
                  </div>
                  <p className="text-zinc-400">No friends available to add</p>
                  <p className="text-sm text-zinc-500 mt-2">All your friends are already in this group</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableFriends.map((friend) => (
                    <div
                      key={friend._id}
                      onClick={() => toggleFriendSelection(friend._id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedFriends.includes(friend._id)
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800"
                      }`}
                    >
                      <div className="relative">
                        <div className="avatar">
                          <div className="w-10 rounded-full">
                            <img 
                              src={friend.profilePic || "/avatar.png"} 
                              alt={friend.fullName} 
                            />
                          </div>
                        </div>
                        {selectedFriends.includes(friend._id) && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{friend.fullName}</p>
                        <p className="text-xs text-zinc-400">{friend.email}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedFriends.includes(friend._id)
                          ? "bg-green-500 border-green-500"
                          : "border-zinc-600"
                      }`}>
                        {selectedFriends.includes(friend._id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedFriends.length > 0 && (
              <div className="p-4 border-t border-zinc-800 bg-zinc-800/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-zinc-400">
                    {selectedFriends.length} friend{selectedFriends.length > 1 ? 's' : ''} selected
                  </span>
                  <button
                    onClick={() => setSelectedFriends([])}
                    className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAddMembers(false);
                      setSelectedFriends([]);
                    }}
                    className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMembers}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors font-medium"
                  >
                    Add Members
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Group Confirmation Modal */}
      {showDeleteGroupConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 max-w-sm w-full">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <Trash2Icon className="w-8 h-8 text-red-400" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Delete Group?</h3>
                <p className="text-zinc-400">
                  Are you sure you want to delete <span className="font-medium text-red-400">{group.name}</span>?
                </p>
                <p className="text-xs text-red-400 mt-2">
                  This action cannot be undone and will remove all members and messages.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDeleteGroupConfirm(false)}
                  className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteGroup}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-medium"
                >
                  Delete Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GroupMembers;
