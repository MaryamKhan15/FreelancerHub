import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Agar user logged in nahi hai, to login page par bhej dein
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Agar specific roles allow kiye gaye hain aur user ka role match nahi karta
  if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
    // Agar wo admin route access karne ki koshish kare, to wapas uske dashboard par bhej dein
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
