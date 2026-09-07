import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientDashboard() {
  const { currentUser, userData } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' | 'proposals'
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      // 1. Fetch Client's Jobs
      const q = query(collection(db, 'jobs'), where('clientId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      jobsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setJobs(jobsData);

      // 2. Fetch Applications for this Client's Jobs
      const jobIds = jobsData.map(j => j.id);
      const allAppsSnap = await getDocs(collection(db, 'applications'));
      const relevantApps = allAppsSnap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(app => (app.clientId === currentUser.uid) || jobIds.includes(app.jobId));
      
      relevantApps.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setApplications(relevantApps);

    } catch (error) {
      console.error("Error fetching client data:", error);
    }
  };

  useEffect(() => {
    fetchData();
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
        featured: isFeatured,
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'jobs'), newJob);
      setJobs([{ id: docRef.id, ...newJob }, ...jobs]);
      setTitle('');
      setDescription('');
      setBudget('');
      setSkills('');
      setIsFeatured(false);
      toast.success(isFeatured ? '⭐ Featured Contract live on Marketplace!' : 'Contract published live to marketplace!', { id: toastId });
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error('Failed to publish contract.', { id: toastId });
    }
    setLoading(false);
  };

  const handleHireTalent = async (appId, bidAmount, freelancerName) => {
    const toastId = toast.loading(`Depositing $${bidAmount} to Escrow & Hiring...`);
    try {
      await updateDoc(doc(db, 'applications', appId), {
        status: 'hired',
        hiredAt: new Date().toISOString()
      });
      setApplications(applications.map(a => a.id === appId ? { ...a, status: 'hired' } : a));
      toast.success(`Hired ${freelancerName}! $${bidAmount} funded in Escrow.`, { id: toastId });
    } catch (err) {
      console.error("Error hiring talent:", err);
      toast.error('Failed to fund escrow', { id: toastId });
    }
  };

  const totalAllocated = jobs.reduce((acc, job) => acc + (Number(job.budget) || 0), 0);
  const hiredCount = applications.filter(a => a.status === 'hired').length;

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
            <p className="text-sm text-slate-500 mt-1">Manage your active contracts, review incoming proposals, and fund escrow.</p>
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
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proposals & Hires</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{applications.length} <span className="text-xs text-emerald-600 font-bold">({hiredCount} Hired)</span></p>
              <p className="text-[11px] font-semibold text-violet-600 mt-1">Direct Applications</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl font-black">
              ⚡
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Post Form & Contracts/Proposals Feed */}
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
                    <input 
                      type="checkbox" 
                      id="featureContract" 
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" 
                    />
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

          {/* Right Column: Tabbed View (Posted Contracts vs Received Proposals) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <button
                onClick={() => setActiveTab('jobs')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'jobs'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Posted Contracts</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'jobs' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {jobs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('proposals')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'proposals'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Received Proposals</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'proposals' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {applications.length}
                </span>
              </button>
            </div>

            {/* TAB 1: POSTED JOBS */}
            {activeTab === 'jobs' && (
              <div>
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
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-lg leading-snug">{job.title}</h3>
                              {job.featured && (
                                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                                  ⭐ Featured
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-semibold">Contract ID: {job.id.slice(0, 8)}</span>
                          </div>
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
            )}

            {/* TAB 2: RECEIVED PROPOSALS (Where Freelancer Applications Arrive!) */}
            {activeTab === 'proposals' && (
              <div>
                {applications.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center shadow-sm">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl mb-3">
                      📬
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">No proposals received yet</h3>
                    <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                      When freelancers submit bids on your posted contracts, their proposals and cover notes will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-black flex items-center justify-center text-lg shadow-sm">
                              {app.freelancerName ? app.freelancerName.charAt(0).toUpperCase() : 'F'}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-slate-900 text-base">{app.freelancerName || 'Verified Freelancer'}</h4>
                                <span className="text-indigo-600 text-xs font-bold">✓</span>
                              </div>
                              <p className="text-xs text-slate-400">{app.freelancerEmail || 'Direct Candidate'}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-slate-400 font-semibold block">Proposed Bid</span>
                            <span className="text-lg font-black text-emerald-600">${app.bidAmount} USD</span>
                          </div>
                        </div>

                        {app.jobTitle && (
                          <div className="text-xs font-bold text-indigo-700 bg-indigo-50/70 px-3 py-1.5 rounded-lg border border-indigo-100">
                            Applied For: <strong>{app.jobTitle}</strong>
                          </div>
                        )}

                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Cover Note & Pitch:</span>
                          <p className="text-xs text-slate-700 leading-relaxed font-normal">
                            "{app.coverLetter}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-[11px] text-slate-400 font-medium">
                            Submitted {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recently'}
                          </span>

                          {app.status === 'hired' ? (
                            <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              ✓ Hired & Escrow Funded
                            </span>
                          ) : (
                            <button
                              onClick={() => handleHireTalent(app.id, app.bidAmount, app.freelancerName || 'Freelancer')}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-emerald-200 hover:scale-105 transition-all"
                            >
                              Hire & Fund Escrow (${app.bidAmount}) &rarr;
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
