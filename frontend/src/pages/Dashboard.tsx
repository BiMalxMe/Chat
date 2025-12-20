import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SupportMe from "../components/SupportMe";
import { Logo } from "../components/Logo";
import { Profile } from "../components/Profile";
import Chat from "../components/Chat";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tokenForChatauth="))
      ?.split("=")[1];

    if (!token) {
      navigate("/signin", { replace: true });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) return null;

  return (
    <div className="text-white min-h-screen">
      {/* Top Bar */}
      <div className="w-2/4 mx-auto mt-20 flex items-center justify-between">
        {/* Left: Logo */}
        <Logo />

        {/* Right: Profile + Support */}
        <div className="flex items-center gap-4">
          <SupportMe />
          <Profile/>
        </div>
      </div>

      {/* Chat Section */}
      <div className="mt-6">
        <Chat />
      </div>
    </div>
  );
};
