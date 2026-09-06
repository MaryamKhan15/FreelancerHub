import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import ClientDashboard from './ClientDashboard';
import FreelancerDashboard from './FreelancerDashboard';

export default function Dashboard() {
  const { currentUser, userData, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (loading) return <div className="text-center mt-20">Loading profile...</div>;

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {userData?.displayName || 'User'}!</h1>
          <p className="text-gray-600 mt-1">
            You are logged in as a <span className="font-semibold text-blue-600 capitalize">{userData?.role}</span>
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-200 font-medium transition-colors"
        >
          Log out
        </button>
      </div>

      <div className="mt-6">
        {userData?.role === 'client' && <ClientDashboard />}
        {userData?.role === 'freelancer' && <FreelancerDashboard />}
        {userData?.role === 'admin' && (
          <div className="bg-purple-50 p-6 rounded-lg text-center text-purple-800">
            You are an Admin. Please visit the <a href="/admin" className="font-bold underline">Admin Dashboard</a>.
          </div>
        )}
      </div>
    </div>
  );
}
