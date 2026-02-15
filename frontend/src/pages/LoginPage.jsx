import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { BrainCircuitIcon, MailIcon, LoaderIcon, LockIcon, SparklesIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
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
                        placeholder="Enter your secure password"
                      />
                    </div>
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
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <SparklesIcon className="w-6 h-6 text-amber-400" />
                    <span className="text-amber-400 text-sm font-semibold tracking-wider uppercase">PREMIUM CHAT</span>
                    <SparklesIcon className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-white leading-tight">
                    The Future of
                    <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Smart Chat</span>
                  </h3>
                  <p className="text-zinc-400 text-lg leading-relaxed max-w-sm mx-auto">
                    Experience conversations that understand context, learn from interactions, and evolve with your needs.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                  <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-amber-400 mb-1">∞</div>
                    <div className="text-xs text-zinc-400 font-medium">Unlimited Chats</div>
                  </div>
                  <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-orange-400 mb-1">🔒</div>
                    <div className="text-xs text-zinc-400 font-medium">End-to-End Secure</div>
                  </div>
                  <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-amber-400 mb-1">⚡</div>
                    <div className="text-xs text-zinc-400 font-medium">Lightning Fast</div>
                  </div>
                  <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-orange-400 mb-1">💬</div>
                    <div className="text-xs text-zinc-400 font-medium">Smart Features</div>
                  </div>
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
