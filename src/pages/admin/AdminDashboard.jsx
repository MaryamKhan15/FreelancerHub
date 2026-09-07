import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'jobs'
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      setUsers(usersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      
      const jobsSnap = await getDocs(collection(db, 'jobs'));
      setJobs(jobsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error('Failed to load telemetry data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if(window.confirm("Are you sure you want to permanently delete this user account?")) {
      try {
        await deleteDoc(doc(db, 'users', id));
        toast.success('User account deleted');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleDeleteJob = async (id) => {
    if(window.confirm("Are you sure you want to delete this job listing?")) {
      try {
        await deleteDoc(doc(db, 'jobs', id));
        toast.success('Job listing removed');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete job');
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] w-full flex flex-col items-center justify-center bg-slate-50 space-y-4 font-sans">
        <div className="w-14 h-14 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
        <p className="text-slate-500 font-bold text-sm tracking-wide animate-pulse">Initializing Admin Telemetry...</p>
      </div>
    );
  }

  // Data Calculations
  const clientCount = users.filter(u => u.role === 'client').length;
  const freelancerCount = users.filter(u => u.role === 'freelancer').length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  
  const userRoleData = [
    { name: 'Clients', value: clientCount || 1, color: '#6366f1' },
    { name: 'Freelancers', value: freelancerCount || 1, color: '#8b5cf6' },
    { name: 'Admins', value: adminCount || 1, color: '#10b981' }
  ];

  const openJobs = jobs.filter(j => j.status === 'open').length;
  const closedJobs = jobs.filter(j => j.status !== 'open').length;
  const totalBudget = jobs.reduce((sum, j) => sum + (Number(j.budget) || 0), 0);

  const jobStatusData = [
    { name: 'Open Contracts', count: openJobs, fill: '#6366f1' },
    { name: 'Assigned / In Escrow', count: closedJobs, fill: '#10b981' }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      
      {/* Sleek Admin Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shadow-2xl shrink-0 z-20">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group" title="Return to Public Site">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-tight">Admin Console</h2>
              <p className="text-[11px] font-semibold text-indigo-400 group-hover:underline">← Public Site</p>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            System Overview
          </button>

          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between ${
              activeTab === 'users' 
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Manage Users
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-indigo-400 border border-slate-700">
              {users.length}
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('jobs')}
            className={`w-full px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-between ${
              activeTab === 'jobs' 
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Manage Jobs
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-indigo-400 border border-slate-700">
              {jobs.length}
            </span>
          </button>
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800/80">
          <button 
            onClick={handleLogout}
            className="w-full px-4 py-2.5 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 border border-rose-900/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

      </div>

      {/* Main Content Pane - Sticky in Single Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 bg-grid-pattern">
        
        {/* Sticky Top Status Bar */}
        <header className="px-8 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-slate-900 capitalize">
              {activeTab === 'overview' ? 'Real-Time System Overview' : activeTab === 'users' ? 'User Directory' : 'Contracts Directory'}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-extrabold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchData} 
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>↻</span> Refresh Telemetry
            </button>
          </div>
        </header>

        {/* Tab 1: OVERVIEW (Fits 100% cleanly in One Viewport without scrolling) */}
        {activeTab === 'overview' && (
          <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
            
            {/* Top Stat KPI Row (Compact & High Impact) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{users.length}</p>
                  <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">Active Directory</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl font-black">
                  👥
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Freelancers</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{freelancerCount}</p>
                  <p className="text-[11px] font-semibold text-violet-600 mt-0.5">Vetted Talent</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-xl font-black">
                  💻
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Clients</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{clientCount}</p>
                  <p className="text-[11px] font-semibold text-blue-600 mt-0.5">Hiring Entities</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-black">
                  💼
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Revenue</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">${Math.round((totalBudget * 0.03) + (freelancerCount * 9.99)).toLocaleString()} <span className="text-xs font-bold text-emerald-600">USD</span></p>
                  <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">3% Escrow + Pro Subs</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black">
                  💰
                </div>
              </div>
            </div>

            {/* Core Visual Charts - Fixed Cleanly in Viewport */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
              
              {/* Left Chart: Demographics Donut */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between mb-2 shrink-0">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">User Role Distribution</h3>
                    <p className="text-xs text-slate-500">Breakdown of platform participants</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-indigo-50 text-indigo-700">
                    {users.length} Total
                  </span>
                </div>

                <div className="flex-1 relative min-h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={userRoleData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={55} 
                        outerRadius={75} 
                        paddingAngle={6} 
                        dataKey="value"
                      >
                        {userRoleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-slate-900">{users.length}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Users</span>
                  </div>
                </div>

                {/* Legend Badges */}
                <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 shrink-0 text-xs font-bold">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                    <span>Clients ({clientCount})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    <span>Freelancers ({freelancerCount})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>Admins ({adminCount})</span>
                  </div>
                </div>
              </div>

              {/* Right Chart: Job Pipeline Bar */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between mb-2 shrink-0">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Contract Pipeline & Status</h3>
                    <p className="text-xs text-slate-500">Open listings vs active contracts</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700">
                    {jobs.length} Jobs
                  </span>
                </div>

                <div className="flex-1 min-h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={jobStatusData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }} 
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0 text-xs font-semibold text-slate-500">
                  <span>Total Escrow Value: <strong className="text-slate-900">${totalBudget.toLocaleString()}</strong></span>
                  <span className="text-emerald-600 font-bold">100% Platform Uptime</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: USERS DIRECTORY */}
        {activeTab === 'users' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Registered Users ({users.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3.5 text-right text-xs font-extrabold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-xs">
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          {user.displayName || 'Unnamed User'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                            user.role === 'client' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 
                            'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                          <button 
                            onClick={() => handleDeleteUser(user.id)} 
                            className="text-rose-600 hover:text-rose-800 font-bold hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: JOBS DIRECTORY */}
        {activeTab === 'jobs' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Posted Contracts ({jobs.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">Budget</th>
                      <th className="px-6 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3.5 text-right text-xs font-extrabold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {jobs.map(job => (
                      <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{job.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs font-black text-emerald-600">${job.budget} USD</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${
                            job.status === 'open' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                          <button 
                            onClick={() => handleDeleteJob(job.id)} 
                            className="text-rose-600 hover:text-rose-800 font-bold hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
