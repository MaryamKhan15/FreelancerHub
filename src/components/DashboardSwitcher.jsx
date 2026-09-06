import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import ClientDashboard from '../pages/user/ClientDashboard';
import FreelancerDashboard from '../pages/user/FreelancerDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

export default function DashboardSwitcher() {
  const { userData } = useAuth();

  if (!userData) return <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-indigo-600 rounded-full border-t-transparent"></div></div>;

  if (userData.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (userData.role === 'freelancer') {
    return <FreelancerDashboard />;
  } else {
    return <ClientDashboard />;
  }
}
