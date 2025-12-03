import { Logo } from "../components/Logo";
import { Button } from "../components/Button";
import { useNavigate } from "react-router";

export const Landing = () => {
  const navigate = useNavigate()
  return (
    <div className="absolute inset-0 bg-black text-white flex flex-col p-20 pt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <Logo />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col justify-center flex-1 max-w-3xl items-center text-center mx-auto">
        <h1 className="text-5xl font-bold leading-tight">
          Chat Smarter.{" "}
          <span className="text-blue-400">Together.</span>
        </h1>

        <p className="text-gray-200 mt-4 text-lg max-w-2xl"> 
          SapiensChat is modern AI chat platform designed for seamless
          collaboration and enhanced productivity.
        </p>

        <div className="mt-8 flex gap-4">
          <Button
            onclick={() => navigate("/signup")}
            variant="primary"
            size="md"
            text="SignUp"
            fullwidth={false}
          />
          <Button
            onclick={() => navigate("/signin")}
            variant="primary"
            size="md"
            text="SignIn"
            fullwidth={false}
          />
        </div>
      </div>

    
    </div>
  );
};
