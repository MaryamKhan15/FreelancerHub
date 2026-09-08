import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      setIsMobileMenuOpen(false);
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-md bg-white/90 border-b border-slate-200 shadow-sm"
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                Freelance<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">Hub</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-7">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 px-1 py-2 text-sm font-bold transition-colors">Home</Link>
            <Link to="/jobs" className="text-slate-600 hover:text-indigo-600 px-1 py-2 text-sm font-bold transition-colors">Browse Jobs</Link>
            <Link to="/freelancers" className="text-slate-600 hover:text-indigo-600 px-1 py-2 text-sm font-bold transition-colors">Find Talent</Link>
            <Link to="/pricing" className="text-slate-600 hover:text-indigo-600 px-1 py-2 text-sm font-bold transition-colors">Pricing</Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <NotificationBell />
                <Link to="/dashboard" className="text-slate-700 font-bold hover:text-indigo-600 flex items-center gap-2.5 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                    {userData?.displayName ? userData.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-bold">Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors border border-rose-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-bold text-sm px-3 py-2 transition-colors">Log in</Link>
                <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-indigo-200 hover:scale-105 transition-all duration-200 shadow-md">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button & Notification Bell */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && <NotificationBell />}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 focus:outline-none p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-bold py-2 border-b border-slate-50">Home</Link>
              <Link to="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-bold py-2 border-b border-slate-50">Browse Jobs</Link>
              <Link to="/freelancers" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-bold py-2 border-b border-slate-50">Find Talent</Link>
              <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-bold py-2 border-b border-slate-50">Pricing & Fees</Link>
              
              <div className="pt-4 flex flex-col gap-3">
                {currentUser ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-indigo-600 font-bold py-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        {userData?.displayName ? userData.displayName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      Go to Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="text-left font-bold text-rose-600 py-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center text-indigo-600 font-bold py-2 border border-indigo-200 rounded-lg">Log in</Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2 rounded-lg font-bold shadow-md">Sign up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
    {/* Spacer so content does not hide behind fixed navbar */}
    <div className="h-16 w-full shrink-0 pointer-events-none" />
    </>
  );
}
