import { Button } from "../components/Button";
import { Mail, Lock } from "lucide-react";
import { InputField } from "../components/InputField";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = () => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Example sign-in logic
    console.log({ email, password });
    toast.success("Signed in successfully!");
    navigate("/dashboard"); // redirect after login
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white px-4">
      <div className="w-full max-w-md bg-[#0D1117] p-8 rounded-2xl border border-gray-800 shadow-xl">

        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center gap-2">
          <h1 className="mt-4 text-3xl font-bold">Sign In</h1>
          <p className="text-gray-400 mt-2 text-sm">Welcome back! Please login.</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <InputField
            label="Email"
            type="email"
            placeholder="bimal@example.com"
            icon={<Mail className="w-5 h-5 text-gray-400" />}
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />

          <Button
            onclick={handleSignin}
            variant="primary"
            size="lg"
            text="Sign In"
            fullwidth={true}
          />

          {/* Separator */}
          <div className="flex items-center gap-3 text-gray-500 mt-2">
            <hr className="flex-1 border-gray-700" />
            <span className="text-sm">or</span>
            <hr className="flex-1 border-gray-700" />
          </div>

          {/* Switch to Signup */}
          <p className="text-center text-gray-400 text-sm mt-3">
            Don’t have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
