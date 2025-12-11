// src/components/Profile.tsx
import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";

export const Profile = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getName = () => {
    return "Bimal Chalise"; // later: localStorage
  };

  const name = getName();
  const email = "bimal@example.com";
  
  // Use name as seed for consistent avatar
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&size=48`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar with DiceBear image */}
      <div
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full overflow-hidden cursor-pointer border-2 border-gray-500 hover:border-primary transition-colors"
      >
        <img 
          src={avatarUrl} 
          alt={name} 
          className="w-full h-full object-cover bg-gray-700"
        />
      </div>

      {/* Dropdown with high z-index and solid background */}
      {open && (
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
              onClick={() => alert("Logging out...")}
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
