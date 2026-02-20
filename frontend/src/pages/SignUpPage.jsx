import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { BrainCircuitIcon, MailIcon, LoaderIcon } from "lucide-react";
import { Link } from "react-router";
import { useEffect } from "react";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { signup, isSigningUp, authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      navigate("/chat");
    }
  }, [authUser, navigate]);

  // Validation regex patterns
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (!nameRegex.test(formData.fullName.trim())) {
      newErrors.fullName = "Name must be 2-50 characters, letters and spaces only";
    }

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
      newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&)";
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
      signup(formData);
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
                    Join <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">SapiensChat</span>
                  </h1>
                  <p className="text-zinc-400 text-lg">Start your journey into intelligent conversations</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* FULL NAME */}
                  <div>
                    <label className="auth-input-label">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={`input ${errors.fullName ? "border-red-500" : ""}`}
                      placeholder="John Doe"
                      required
                      minLength="2"
                      maxLength="50"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`input ${errors.email ? "border-red-500" : ""}`}
                      placeholder="you@example.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`input ${errors.password ? "border-red-500" : ""}`}
                      placeholder="Create a secure password"
                      required
                      minLength="8"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button className="auth-btn" type="submit" disabled={isSigningUp}>
                    {isSigningUp ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Create SapiensChat Account"
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-zinc-500 text-sm mb-2">Already have an account?</p>
                  <Link to="/login" className="auth-link">
                    Sign in to SapiensChat
                  </Link>
                </div>
              </div>
            </div>

            {/* HERO SECTION - RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-8 bg-gradient-to-br from-orange-900/20 via-transparent to-amber-900/20">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white leading-tight">
                    Elevate Your
                    <span className="block bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Communication</span>
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed max-w-sm mx-auto">
                    Join thousands who've already discovered smarter way to connect, collaborate, and communicate.
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    No Credit Card
                  </span>
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Instant Setup
                  </span>
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    Cancel Anytime
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
export default SignUpPage;
