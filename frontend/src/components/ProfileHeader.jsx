import { useState, useRef } from "react";
import { LogOutIcon, VolumeOffIcon, Volume2Icon, BrainCircuitIcon, EditIcon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

function ProfileHeader() {
  const { logout, authUser, updateProfile } = useAuthStore();
  const { isSoundEnabled, toggleSound } = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(authUser?.fullName || "");
  const [editImage, setEditImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleEditProfile = () => {
    setEditName(authUser?.fullName || "");
    setEditImage(null);
    setShowEditModal(true);
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setEditImage(reader.result);
    };
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsUpdating(true);
    try {
      const updateData = { fullName: editName.trim() };
      if (editImage) {
        updateData.profilePic = editImage;
      }
      
      await updateProfile(updateData);
      setShowEditModal(false);
      setEditImage(null);
    } catch (error) {
      // Error handled in store
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 border-b border-zinc-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="User image"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={showEditModal ? handleEditImageUpload : handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold text-base max-w-[180px] truncate">
                {authUser.fullName}
              </h3>
              <div className="flex items-center gap-1">
                <BrainCircuitIcon className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">SapiensChat</span>
              </div>
            </div>

            <p className="text-zinc-400 text-xs">Active now</p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 items-center">
          {/* EDIT PROFILE BTN */}
          <button
            className="text-zinc-400 hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-zinc-800/50"
            onClick={handleEditProfile}
          >
            <EditIcon className="size-5" />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            className="text-zinc-400 hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-zinc-800/50"
            onClick={() => {
              // play click sound before toggling
              mouseClickSound.currentTime = 0; // reset to start
              mouseClickSound.play().catch((error) => console.log("Audio play failed:", error));
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className="size-5" />
            ) : (
              <VolumeOffIcon className="size-5" />
            )}
          </button>

          {/* LOGOUT BTN */}
          <button
            className="text-zinc-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-zinc-800/50"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Edit Profile</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-700">
                    <img
                      src={editImage || authUser?.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <EditIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
                <p className="text-xs text-zinc-400 mt-2">Click to change photo</p>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="p-6 border-t border-zinc-800 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isUpdating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ProfileHeader;
