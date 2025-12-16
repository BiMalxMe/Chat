import { useState } from "react";
import axios from "axios";

export const useChangeName = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCookie = (key: string): string | null => {
    const found = document.cookie
      .split("; ")
      .find((row) => row.startsWith(key + "="));
    return found ? decodeURIComponent(found.split("=")[1]) : null;
  };

  const changeName = async (newName: string) => {
    if (!newName.trim()) return false;

    try {
      setLoading(true);
      setError(null);

      const res = await axios.put(
        "http://localhost:5000/api/v1/changename",
        { newName },
        {
          headers: {
            Authorization: `Bearer ${getCookie("tokenForChatauth")}`,
          },
        }
      );

      // update cookie so UI reflects immediately
      document.cookie = `name=${encodeURIComponent(
        res.data.user.userName
      )}; path=/`;

      return true;
    } catch (err) {
      setError("Failed to update name");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { changeName, loading, error };
};
