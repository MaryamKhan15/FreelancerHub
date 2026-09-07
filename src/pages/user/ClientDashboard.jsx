import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ClientDashboard() {
  const { currentUser, userData } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, 'jobs'), where('clientId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        jobsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, [currentUser.uid]);

  const handlePostJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Publishing contract to marketplace...');
    try {
      const newJob = {
        clientId: currentUser.uid,
        title,
        description,
        budget: Number(budget),
        skills: skills.split(',').map(s => s.trim()).filter(s => s),
        status: 'open',
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'jobs'), newJob);
      setJobs([{ id: docRef.id, ...newJob }, ...jobs]);
      setTitle('');
      setDescription('');
      setBudget('');
      setSkills('');
      toast.success('Contract published live to freelancers!', { id: toastId });
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error('Failed to publish contract.', { id: toastId });
    }
    setLoading(false);
  };

  const totalAllocated = jobs.reduce((acc, job) => acc + (Number(job.budget) || 0), 0);

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans bg-grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Header with Live Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              VERIFIED CLIENT PORTAL
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{userData?.displayName || 'Client'}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage your active contracts, post requirements, and review talent.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
              Account ID: <code className="text-slate-700 font-mono">{currentUser?.uid.slice(0, 8)}...</code>
            </span>
          </div>
        </div>

        {/* High-Tech KPI Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Posted Contracts</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{jobs.length}</p>
              <p className="text-[11px] font-semibold text-indigo-600 mt-1">Active on Marketplace</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-black">
              📋
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Allocated Budget</p>
              <p className="text-3xl font-black text-slate-900 mt-1">${totalAllocated.toLocaleString()}</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1">Protected in Escrow</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-black">
              💰
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Talent Hired</p>
              <p className="text-3xl font-black text-slate-900 mt-1">0</p>
              <p className="text-[11px] font-semibold text-violet-600 mt-1">Direct Milestones</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl font-black">
              ⚡
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Post Form & Contracts Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Post Job Form */}
          <div className="lg:col-span-5">
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200/90 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                  +
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Post New Contract</h2>
                  <p className="text-xs text-slate-500">Reach vetted professionals in minutes</p>
                </div>
              </div>

              <form onSubmit={handlePostJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Contract Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl py-2.5 px-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="e.g. Senior React & Tailwind Developer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Estimated Budget (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      required
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl py-2.5 pl-8 pr-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="1500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl py-2.5 px-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="React, Tailwind, Node.js, Firebase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Scope of Work</label>
                  <textarea
                    required
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 rounded-xl py-2.5 px-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
                    placeholder="Describe deliverables, timelines, and technical requirements..."
                  ></textarea>
                </div>

                {/* Monetization: Featured Post Upgrade Option */}
                <div className="p-3.5 rounded-xl bg-violet-50/80 border border-violet-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input type="checkbox" id="featureContract" className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" />
                    <label htmlFor="featureContract" className="text-xs font-bold text-slate-800 cursor-pointer">
                      ⭐ Feature on Top ($29)
                    </label>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-violet-700 bg-white px-2.5 py-0.5 rounded-full border border-violet-200 shadow-xs">
                    24h Urgent Hire
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-200 hover:scale-[1.01] transition-all duration-200 text-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Publishing...' : '🚀 Publish Contract'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: My Active Jobs List */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Your Posted Contracts ({jobs.length})</h2>
              <span className="text-xs font-semibold text-slate-500">Live Marketplace Feed</span>
            </div>

            {jobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center shadow-sm">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-3">
                  📝
                </div>
                <h3 className="font-bold text-slate-900 text-base">No active contracts yet</h3>
                <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                  Fill in the form on the left to post your first project and start receiving bids from top freelancers.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <motion.div 
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-bold text-slate-900 text-lg leading-snug">{job.title}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        ${job.budget} USD
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {job.description}
                    </p>

                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {job.skills.map((skill, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-400">
                      <span>Status: <strong className="text-emerald-600 uppercase font-black">{job.status}</strong></span>
                      <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
