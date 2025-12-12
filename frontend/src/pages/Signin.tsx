import { Button } from "../components/Button";
import { Mail, Lock } from "lucide-react";
import { InputField } from "../components/InputField";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const Signin = () => {
  
  
  const navigate = useNavigate();

    useEffect(() => {
      //replace localStorage with cookies

      const cookies = document.cookie.split("; ").reduce((acc: any, cookie) => {
        const [name, value] = cookie.split("=");
        acc[name] = value;
        return acc;
      }, {});

      if (cookies.tokenForChatauth) {
        navigate("/dashboard");
      }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

  const handleSignin = async () => {
    // Basic empty field validation
    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }

  if (!emailPattern.test(email)) {
  alert("Please enter a valid email address.");
  return;
}

if (password.length < 6) {
  alert("Password must be at least 6 characters long.");
  return;
}


    try {
      const res = await fetch("http://localhost:5000/api/v1/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signin failed");
        return;
      }
      
      // localStorage.setItem("tokenForChatauth", data.token);

      //setting up the cookies for name email and token
document.cookie = `tokenForChatauth=${encodeURIComponent(data.token)}; path=/; max-age=${7 * 24 * 60 * 60}`;

      alert("Signed in successfully!");

      // Redirect after success
      navigate("/dashboard");

    } catch (error) {
      alert("Something went wrong. Try again.");
      console.error("Signin error:", error);
    }
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />

          <InputField
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
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
