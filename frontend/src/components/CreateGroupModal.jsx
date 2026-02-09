import { useState } from "react";
import { useGroupStore } from "../store/useGroupStore";
import { useChatStore } from "../store/useChatStore";
import { XIcon, PlusIcon, CheckIcon } from "lucide-react";
import toast from "react-hot-toast";

function CreateGroupModal({ onClose }) {
  console.log("CreateGroupModal component rendered");
  const { createGroup } = useGroupStore();
  const { allContacts } = useChatStore();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const isButtonDisabled = !groupName.trim() || selectedMembers.length === 0 || isCreating;
  
  console.log("CreateGroupModal state:", { 
    allContactsLength: allContacts.length,
    groupName: groupName.trim(),
    selectedMembersCount: selectedMembers.length,
    isButtonDisabled
  });

  const handleMemberToggle = (contact) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((member) => member._id === contact._id);
      if (isSelected) {
        return prev.filter((member) => member._id !== contact._id);
      } else {
        return [...prev, contact];
      }
    });
  };

  const handleCreateGroup = async (e) => {
    console.log("=== CREATE GROUP BUTTON CLICKED ===");
    e.preventDefault();
    
    console.log("Form data:", {
      groupName: groupName.trim(),
      selectedMembersCount: selectedMembers.length,
      isButtonDisabled: !groupName.trim() || selectedMembers.length === 0 || isCreating
    });
    
    if (!groupName.trim()) {
      console.log("ERROR: No group name");
      toast.error("Please enter a group name");
      return;
    }

    if (selectedMembers.length === 0) {
      console.log("ERROR: No members selected");
      toast.error("Please select at least one member");
      return;
    }

    console.log("Validation passed, starting group creation...");
    setIsCreating(true);
    
    try {
      const memberIds = selectedMembers.map((member) => member._id);
      const groupData = {
        name: groupName.trim(),
        description: groupDescription.trim(),
        memberIds,
      };
      
      console.log("Sending API request with data:", groupData);
      const result = await createGroup(groupData);
      console.log("Group creation successful:", result);
      toast.success("Group created successfully!");
      onClose();
    } catch (error) {
      console.error("Group creation failed:", error);
      toast.error("Failed to create group: " + (error.response?.data?.message || error.message));
    } finally {
      setIsCreating(false);
    }
  };

  const handleButtonClick = (e) => {
    console.log("Button clicked directly", e);
    handleCreateGroup(e);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-200">Create New Group</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <XIcon className="size-5 text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateGroup} className="p-4 space-y-4">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              maxLength={50}
              required
            />
          </div>

          {/* Group Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              placeholder="Enter group description"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={200}
            />
          </div>

          {/* Members Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Add Members * ({selectedMembers.length} selected)
            </label>
            <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-600 rounded-lg p-2">
              {allContacts.length === 0 ? (
                <div className="text-center text-slate-500 py-4">
                  <div className="mb-2">No contacts available</div>
                  <div className="text-xs text-slate-600">
                    Please go to Contacts tab and refresh, or make sure you have other users registered
                  </div>
                </div>
              ) : (
                allContacts.map((contact) => {
                  const isSelected = selectedMembers.some(
                    (member) => member._id === contact._id
                  );
                  return (
                    <label
                      key={contact._id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleMemberToggle(contact)}
                        className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 focus:ring-2"
                      />
                      <img
                        src={contact.profilePic || "/avatar.png"}
                        alt={contact.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="flex-1 text-slate-200">{contact.fullName}</span>
                      {isSelected && (
                        <CheckIcon className="size-4 text-cyan-400" />
                      )}
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isButtonDisabled}
              onClick={handleButtonClick}
              className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <PlusIcon className="size-4" />
                  Create Group
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupModal;
