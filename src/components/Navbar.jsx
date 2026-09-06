import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function Navbar() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              FreelanceHub
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Home</Link>
            <Link to="/jobs" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Browse Jobs</Link>
            <Link to="/freelancers" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Find Talent</Link>
          </nav>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-slate-700 font-medium hover:text-indigo-600 flex items-center gap-2 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    {userData?.displayName ? userData.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-sm font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900 font-medium px-3 py-2 transition-colors">Log in</Link>
                <Link to="/register" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-indigo-200 hover:scale-105 transition-all duration-200">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
