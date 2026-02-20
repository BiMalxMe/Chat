import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { BrainCircuitIcon, MailIcon, LoaderIcon, LockIcon, SparklesIcon } from "lucide-react";
import { Link } from "react-router";
import { useEffect } from "react";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login, isLoggingIn, authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/chat");
    }
  }, [authUser, navigate]);

  // Validation regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^.{6,}$/; // At least 6 characters

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      login(formData);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 bg-black">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            {/* FORM COLUMN - LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-zinc-800/50">
              <div className="w-full max-w-md">
                {/* HEADING TEXT */}
                <div className="text-center mb-8">
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 p-3 rounded-2xl">
                      <BrainCircuitIcon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                    Sapiens<span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Chat</span>
                  </h1>
                  <p className="text-zinc-400 text-lg">Welcome back to intelligent conversations</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">Email Address</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`input ${errors.email ? "border-red-500" : ""}`}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`input ${errors.password ? "border-red-500" : ""}`}
                        placeholder="Enter your password"
                        required
                        minLength="6"
                      />
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button className="auth-btn" type="submit" disabled={isLoggingIn}>
                    {isLoggingIn ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Sign In to SapiensChat"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-zinc-500 text-sm mb-2">New to SapiensChat?</p>
                  <Link to="/signup" className="auth-link">
                    Create your free account
                  </Link>
                </div>
              </div>
            </div>

            {/* HERO SECTION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-8 bg-gradient-to-br from-amber-900/20 via-transparent to-orange-900/20">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white leading-tight">
                    The Future of
                    <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Smart Chat</span>
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed max-w-sm mx-auto">
                    Experience conversations that understand context, learn from interactions, and evolve with your needs.
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Free Forever
                  </span>
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    No Ads
                  </span>
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Privacy First
                  </span>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}
export default LoginPage;
