import { useState, useRef } from 'react';
import { useAdminStore } from '../store/adminStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldIcon, LockIcon, MailIcon, EyeIcon, EyeOffIcon, BrainCircuitIcon, SparklesIcon } from 'lucide-react';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { adminLogin, loading } = useAdminStore();
  const navigate = useNavigate();
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await adminLogin(email, password);
    
    if (result.success) {
      toast.success('Admin login successful');
      navigate('/admin/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl md:h-[800px] h-[650px]">
        {/* Admin Login Container - Similar to LoginPage but with admin styling */}
        <div className="w-full flex flex-col md:flex-row bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700">
          {/* FORM COLUMN - LEFT SIDE */}
          <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-700/50">
            <div className="w-full max-w-md">
              {/* HEADING TEXT */}
              <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-2xl">
                    <ShieldIcon className="w-10 h-10 text-white" />
                  </div>
                </div>
                <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
                  Admin<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Panel</span>
                </h1>
                <p className="text-slate-400 text-lg">Secure access to system administration</p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* EMAIL INPUT */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      ref={emailInputRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="bimal@admin.com"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                {/* PASSWORD INPUT */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      ref={passwordInputRef}
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 pl-10 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      placeholder="Enter your admin password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors"
                    >
                      {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg py-3 font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin text-center" />
                  ) : (
                    "Sign In to Admin Panel"
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-slate-500 text-sm mb-2">Administrator access only</p>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <ShieldIcon className="w-3 h-3" />
                  <span>Secure Authentication</span>
                </div>
              </div>
            </div>
          </div>

          {/* HERO SECTION - RIGHT SIDE */}
          <div className="hidden md:w-1/2 md:flex items-center justify-center p-8 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <SparklesIcon className="w-6 h-6 text-purple-400" />
                  <span className="text-purple-400 text-sm font-semibold tracking-wider uppercase">ADMIN</span>
                  <SparklesIcon className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-3xl font-bold text-white leading-tight">
                  System
                </h3>
                <h3 className="text-3xl font-bold text-white leading-tight">
                  Administration
                </h3>
                <p className="text-slate-300 text-lg max-w-md">
                  Manage users, monitor activity, and control system settings
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <ShieldIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-slate-300">
                      <div className="text-white font-medium">Secure</div>
                      <div className="text-slate-400 text-xs">Authentication</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                      <BrainCircuitIcon className="w-6 h-6 text-pink-400" />
                    </div>
                    <div className="text-slate-300">
                      <div className="text-white font-medium">Advanced</div>
                      <div className="text-slate-400 text-xs">Management</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                      <SparklesIcon className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="text-slate-300">
                      <div className="text-white font-medium">Analytics</div>
                      <div className="text-slate-400 text-xs">Dashboard</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
