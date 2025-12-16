import { useState, useRef, useEffect } from "react";
import { LogOut, Pencil } from "lucide-react";
import { useLogout } from "../hooks/logout";
import { useChangeName } from "../hooks/nameChange";

interface ProfileProps {
  name?: string;
  email?: string;
}

export const Profile = ({ name: propName, email: propEmail }: ProfileProps) => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const logout = useLogout();
  const { changeName, loading } = useChangeName();

  const getCookie = (key: string): string | null => {
    const found = document.cookie
      .split("; ")
      .find((row) => row.startsWith(key + "="));
    return found ? decodeURIComponent(found.split("=")[1]) : null;
  };

  const name = propName || getCookie("name") || "Guest";
  const email = propEmail || getCookie("email") || "user@example.com";

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&size=48`;

  const dropdownEnabled = !propName && !propEmail;

  useEffect(() => {
    if (!dropdownEnabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownEnabled]);

  const handleSave = async () => {
    const success = await changeName(newName);
    if (success) {
      setEditing(false);
      setNewName("");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => dropdownEnabled && setOpen(!open)}
        className="w-12 h-12 rounded-full overflow-hidden cursor-pointer border-2 border-gray-500"
      >
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover bg-gray-700"
        />
      </div>

      {dropdownEnabled && open && (
        <div className="absolute right-0 mt-3 w-56 rounded-xl bg-gray-800 shadow-lg p-4 border border-gray-700 z-50">
          <div className="flex items-center gap-3 mb-3">
            <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full" />

            <div className="flex-1">
              {!editing ? (
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-white">{name}</p>
                  <Pencil
                    className="w-4 h-4 cursor-pointer text-gray-400 hover:text-white"
                    onClick={() => {
                      setEditing(true);
                      setNewName(name);
                    }}
                  />
                </div>
              ) : (
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none"
                />
              )}

              <p className="text-xs text-gray-400">{email}</p>
            </div>
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full mb-3 bg-blue-600 rounded-md py-1 text-sm font-semibold disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Name"}
            </button>
          )}

          <div className="border-t border-gray-700 pt-3">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
