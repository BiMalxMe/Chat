import Chat from "../components/Chat";
import { Logo } from "../components/Logo";
import { Profile } from "../components/Profile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // block rendering initially

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tokenForChatauth="))
      ?.split("=")[1];

    if (!token) {
      // redirect immediately
      navigate("/signin", { replace: true });
    } else {
      // allow render
      setLoading(false);
    }
  }, [navigate]);

  // prevent any render until token is confirmed
  if (loading) return null;

  return (
    <div className="text-white h-screen">
      <div className="flex items-start justify-between w-2/4 mx-auto mt-20">
        <Logo />
        <Profile />
      </div>
      <div>
        <Chat />
      </div>
    </div>
  );
};
