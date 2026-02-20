import { Navigate, Route, Routes, useLocation } from "react-router-dom"; // Use useLocation!
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import { useAuthStore } from "./store/useAuthStore";
import { useAdminStore } from './store/adminStore';
import { useEffect } from "react";
import PageLoader from "./components/PageLoader";
import IncomingCallHandler from "./components/IncomingCallHandler";
import { Toaster } from "react-hot-toast";

function App() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();
  const { checkAdminAuth, isAdmin } = useAdminStore();
  const location = useLocation(); // Properly track location changes

  useEffect(() => {
    // Check regular user auth
    if (!location.pathname.startsWith('/admin')) {
      checkAuth();
    }
    // Check admin auth
    checkAdminAuth();
  }, [checkAuth, checkAdminAuth, location.pathname]);

  // Loading state handling
  if (isCheckingAuth && !location.pathname.startsWith('/admin')) {
    return <PageLoader />;
  }

  return (
    <>
      {/* Main Container: Removed 'items-center justify-center' from root 
          to prevent layout breaking on scrollable pages like Dashboard 
      */}
      <div className="min-h-screen bg-black relative overflow-x-hidden">
        
        {/* BACKGROUND DECORATORS - Forced to back with z-0 and pointer-events-none */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
          <div className="absolute top-0 -left-4 size-96 bg-amber-500 opacity-20 blur-[100px]" />
          <div className="absolute bottom-0 -right-4 size-96 bg-orange-500 opacity-20 blur-[100px]" />
        </div>

        {/* CONTENT LAYER - Higher z-index to ensure inputs are clickable */}
        <div className="relative z-10 min-h-screen">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/chat" />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/chat" />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={!isAdmin ? <AdminLogin /> : <Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin" />} />
          </Routes>
        </div>
      </div>

      {authUser && <IncomingCallHandler />}
      <Toaster position="top-center" />
    </>
  );
}

export default App;