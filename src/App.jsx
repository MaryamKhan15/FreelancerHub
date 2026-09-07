import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import JobListings from './pages/public/JobListings';
import FreelancerListings from './pages/public/FreelancerListings';
import Pricing from './pages/public/Pricing';

import ClientDashboard from './pages/user/ClientDashboard';
import FreelancerDashboard from './pages/user/FreelancerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import Unauthorized from './pages/public/Unauthorized';
import DashboardSwitcher from './components/DashboardSwitcher';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-x-hidden w-full">
          <Toaster position="bottom-right" toastOptions={{ duration: 4000, style: { background: '#334155', color: '#fff' } }} />
          <Navbar />
          <main className="flex-grow w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobListings />} />
              <Route path="/freelancers" element={<FreelancerListings />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Har logged-in user ke liye */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardSwitcher />
                  </ProtectedRoute>
                } 
              />

              {/* Sirf Admin ke liye */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
