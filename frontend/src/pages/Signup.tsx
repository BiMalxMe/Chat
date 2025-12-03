import { Button } from "../components/Button";
import { User, Mail, Lock } from "lucide-react";
import { InputField } from "../components/InputField";
import { useState } from "react";
import { useNavigate } from "react-router";

export const Signup = () => {
    const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Check if fields are empty
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    // Email validation (must include @)
    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    // Example submission logic
    console.log({ name, email, password });
    setSubmitted(true);
    alert("Account created successfully!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white px-4">
      <div className="w-full max-w-md bg-[#0D1117] p-8 rounded-2xl border border-gray-800 shadow-xl">

        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center gap-2">
          <h1 className="mt-4 text-3xl font-bold">
            Sign Up
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Create your new account
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <InputField
            label="Name"
            placeholder="Bimal Chalise"
            icon={<User className="w-5 h-5 text-gray-400" />}
            value={name}
            onChange={( e:  React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          />

          <InputField
            label="Email"
            type="email"
            placeholder="bimal@example.com"
            icon={<Mail className="w-5 h-5 text-gray-400" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            value={password}
            onChange={(e :  React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />

          <Button
            onclick={handleSubmit}
            variant="primary"
            size="lg"
            text="Create Account"
            fullwidth={true}
          />

          {/* Separator */}
          <div className="flex items-center gap-3 text-gray-500 mt-2">
            <hr className="flex-1 border-gray-700" />
            <span className="text-sm">or</span>
            <hr className="flex-1 border-gray-700" />
          </div>

          {/* Switch to Sign In */}
          <p className="text-center text-gray-400 text-sm mt-3">
            Already have an account?{" "}
            <span className="text-blue-400 cursor-pointer hover:underline" onClick={() => navigate("/signin")}>
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
