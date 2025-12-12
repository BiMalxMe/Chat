import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { useLogout } from "../hooks/logout";

interface ProfileProps {
  name?: string;
  email?: string;
}

export const Profile = ({ name: propName, email: propEmail }: ProfileProps) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logout = useLogout();

  const getCookie = (key: string): string | null => {
    const found = document.cookie
      .split("; ")
      .find((row) => row.startsWith(key + "="));

    if (!found) return null;

    // decode cookie safely but DO NOT encode again
    return decodeURIComponent(found.split("=")[1]);
  };

  // prefer props → fallback to cookies → fallback default
  const name = propName || getCookie("name") || "Guest";
  const email = propEmail || getCookie("email") || "user@example.com";

  // direct raw seed → NO encoding
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}&size=48`;

  // dropdown visible only for main profile (no props)
  const dropdownEnabled = !propName && !propEmail;

  useEffect(() => {
    if (!dropdownEnabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownEnabled]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => dropdownEnabled && setOpen(!open)}
        className={`w-12 h-12 rounded-full overflow-hidden cursor-pointer border-2
          ${dropdownEnabled ? "border-gray-500 hover:border-primary" : "border-gray-600"}
        `}
      >
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover bg-gray-700" />
      </div>

      {dropdownEnabled && open && (
        <div className="absolute right-0 mt-3 w-52 rounded-xl bg-gray-800 shadow-lg p-4 border border-gray-700 z-50">
          <div className="flex items-center gap-3 mb-3">
            <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full" />
            <div>
              <p className="text-sm font-medium text-white">{name}</p>
              <p className="text-xs text-gray-400">{email}</p>
            </div>
          </div>

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
