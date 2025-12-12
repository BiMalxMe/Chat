import { Button } from "../components/Button";
import { User, Mail, Lock } from "lucide-react";
import { InputField } from "../components/InputField";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
// import { alert from "reactalert";

export const Signup = () => {
  const navigate = useNavigate();

  //replace localStorage with cookies
    useEffect(() => {
      const cookies = document.cookie.split("; ").reduce((acc: any, cookie) => {
        const [name, value] = cookie.split("=");
        acc[name] = value;
        return acc;
      }, {});

      if (cookies.tokenForChatauth) {
        navigate("/dashboard");
      }
    
  }, [navigate]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Name must contain only alphabets & spaces
  const namePattern = /^[A-Za-z ]+$/;

  // Email: characters + numbers + . _ allowed
  const emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

  const handleSubmit = async () => {
    // Empty field check
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    // Name validation
    if (!namePattern.test(name)) {
      alert("Name must contain only alphabets and spaces");
      return;
    }

    // Email pattern validation
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address");
      return;
    }
    

    // Password length
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    // Password match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Send to backend
    try {
      const res = await fetch("http://localhost:5000/api/v1/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: name,
          email,
          password,
        }),
      });

      const data = await res.json();
      
     

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }
  // Set cookies for 7 days
  document.cookie = `name=${encodeURIComponent(name)}; path=/; max-age=${7 * 24 * 60 * 60}`;
  document.cookie = `email=${encodeURIComponent(email)}; path=/; max-age=${7 * 24 * 60 * 60}`;
  // document.cookie = `tokenForChatauth=${encodeURIComponent(data.token)}; path=/; max-age=${7 * 24 * 60 * 60}`;

  alert(data.message || "Account created successfully!");
  navigate("/signin");


    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white px-4">
      <div className="w-full max-w-md bg-[#0D1117] p-8 rounded-2xl border border-gray-800 shadow-xl">

        {/* Header */}
        <div className="flex flex-col items-center mb-6 text-center gap-2">
          <h1 className="mt-4 text-3xl font-bold">Sign Up</h1>
          <p className="text-gray-400 mt-2 text-sm">Create your new account</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <InputField
            label="Name"
            placeholder="Bimal Chalise"
            icon={<User className="w-5 h-5 text-gray-400" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputField
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

          {/* Switch */}
          <p className="text-center text-gray-400 text-sm mt-3">
            Already have an account?{" "}
            <span
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};
