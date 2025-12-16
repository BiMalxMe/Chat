import { useEffect, useState } from "react";
import axios from "axios";
import { Profile } from "../components/Profile";

interface User {
  name: string;
  email: string;
}

interface BackendUser {
  userName: string;
  email: string;
}

interface UsersResponse {
  users: BackendUser[];
}

interface ChatListProps {
  selectedEmail: string | null;
  onSelectUser: (email: string) => void;
}

export const ChatList = ({ selectedEmail, onSelectUser }: ChatListProps) => {
  const [users, setUsers] = useState<User[]>([]);

  const getCookie = (key: string): string | null =>
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(key + "="))
      ?.split("=")[1] ?? null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<UsersResponse>(
          "http://localhost:5000/api/v1/getallusers",
          {
            headers: {
              Authorization: `Bearer ${getCookie("tokenForChatauth")}`,
            },
          }
        );

        setUsers(
          res.data.users.map((u) => ({
            name: u.userName,
            email: u.email,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="w-1/4 border-r border-gray-700 p-3 overflow-y-auto">
      <h2 className="font-bold text-lg mb-3">Users</h2>

      {users.map((u) => (
        <div
          key={u.email}
          onClick={() => onSelectUser(u.email)}
          className={`flex items-center gap-3 mb-3 p-2 rounded cursor-pointer
            ${
              selectedEmail === u.email
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
        >
          <Profile name={u.name} email={u.email} />
          <div>
            <p className="font-semibold">{u.name}</p>
            <p className="text-xs text-gray-400">{u.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
