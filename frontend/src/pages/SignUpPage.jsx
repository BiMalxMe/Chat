import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { BrainCircuitIcon, LockIcon, MailIcon, UserIcon, LoaderIcon, SparklesIcon, RocketIcon } from "lucide-react";
import { Link } from "react-router";

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
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
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* EMAIL INPUT */}
                  <div>
                    <label className="auth-input-label">Email Address</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* PASSWORD INPUT */}
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="Create a secure password"
                      />
                    </div>
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
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <RocketIcon className="w-6 h-6 text-orange-400" />
                    <span className="text-orange-400 text-sm font-semibold tracking-wider uppercase">GET STARTED</span>
                    <RocketIcon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white leading-tight">
                    Elevate Your
                    <span className="block bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Communication</span>
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed max-w-sm mx-auto">
                    Join thousands who've already discovered the smarter way to connect, collaborate, and communicate.
                  </p>
                </div>

                <div className="space-y-4 max-w-sm mx-auto">
                  <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                        <SparklesIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Smart Features</div>
                        <div className="text-xs text-zinc-400">Intelligent suggestions and auto-completion</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Personalized Experience</div>
                        <div className="text-xs text-zinc-400">Learns from your communication style</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                        <LockIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">Military-Grade Security</div>
                        <div className="text-xs text-zinc-400">Your conversations are completely private</div>
                      </div>
                    </div>
                  </div>
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
