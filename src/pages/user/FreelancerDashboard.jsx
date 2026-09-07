import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function FreelancerDashboard() {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();
  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [myApplications, setMyApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'proposals'

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, 'jobs'), where('status', '==', 'open'));
        const querySnapshot = await getDocs(q);
        const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        jobsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAvailableJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
      setLoading(false);
    };

    const fetchMyApplications = async () => {
      try {
        const q = query(collection(db, 'applications'), where('freelancerId', '==', currentUser.uid));
        const snap = await getDocs(q);
        const apps = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        apps.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setMyApplications(apps);
        setAppliedJobsCount(apps.length);
      } catch (err) {
        console.error("Error fetching my applications:", err);
      }
    };

    fetchJobs();
    if (currentUser?.uid) {
      fetchMyApplications();
    }
  }, [currentUser?.uid]);

  const handleApply = async (job) => {
    if (!coverLetter || !bidAmount) {
      toast.error('Please specify both bid amount and proposal note.');
      return;
    }
    const toastId = toast.loading('Submitting proposal to client...');
    try {
      const newApp = {
        jobId: job.id,
        jobTitle: job.title || 'Client Contract',
        clientId: job.clientId || '',
        freelancerId: currentUser.uid,
        freelancerName: userData?.displayName || currentUser?.displayName || 'Verified Freelancer',
        freelancerEmail: currentUser.email || '',
        coverLetter,
        bidAmount: Number(bidAmount),
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, 'applications'), newApp);
      toast.success('Proposal submitted successfully! Client notified.', { id: toastId });
      setMyApplications(prev => [{ id: docRef.id, ...newApp }, ...prev]);
      setAppliedJobsCount(prev => prev + 1);
      setApplyingTo(null);
      setCoverLetter('');
      setBidAmount('');
    } catch (err) {
      console.error("Error applying to job:", err);
      toast.error('Failed to submit proposal.', { id: toastId });
    }
  };

  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.skills && job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesBudget = minBudget ? (Number(job.budget) || 0) >= Number(minBudget) : true;
    return matchesSearch && matchesBudget;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans bg-grid-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Header with Live Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 border border-violet-300 text-xs font-black text-violet-800 mb-2">
              <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></span>
              USER DASHBOARD (FREELANCER)
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              User Dashboard &bull; <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">{userData?.displayName || 'Freelancer'}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Discover new client contracts, submit proposals, and track milestone earnings.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
            >
              <span>🌐 Public Site</span>
            </Link>
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
              Role: <strong className="text-indigo-600 font-extrabold">{userData?.expertise || 'Talent'}</strong>
            </span>
            <button
              onClick={async () => {
                await logout();
                toast.success('Logged out');
                navigate('/login');
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl border border-rose-200 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* High-Tech KPI Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Contracts</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{availableJobs.length}</p>
              <p className="text-[11px] font-semibold text-indigo-600 mt-1">Ready for Bidding</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl font-black">
              💼
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proposals Sent</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{appliedJobsCount}</p>
              <p className="text-[11px] font-semibold text-violet-600 mt-1">Active Submissions</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-2xl font-black">
              📬
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Escrow Balance</p>
              <p className="text-3xl font-black text-slate-900 mt-1">$0.00</p>
              <p className="text-[11px] font-semibold text-emerald-600 mt-1">100% Payout Rate</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-black">
              ⚡
            </div>
          </div>
        </div>

        {/* Pro Membership Monetization Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-5 border border-indigo-500/30 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-base text-white">Upgrade to FreelanceHub PRO</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  $9.99 / MO
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">Get Golden Pro Verified badge, top 10% search placement, and zero withdrawal fees.</p>
            </div>
          </div>
          <Link to="/pricing" className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:scale-105 transition-all">
            View PRO Perks &rarr;
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'browse'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>💼 Browse Contracts</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
              activeTab === 'browse' ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {availableJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'proposals'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>📬 My Submitted Proposals</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
              activeTab === 'proposals' ? 'bg-violet-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {myApplications.length}
            </span>
          </button>
        </div>

        {activeTab === 'proposals' ? (
          /* My Submitted Proposals Section */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900">Your Submitted Proposals</h2>
                <p className="text-xs text-slate-500 mt-0.5">Track real-time status of your client bids and escrow hiring contracts.</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-violet-50 text-violet-700 rounded-full border border-violet-200">
                {myApplications.length} Total Submissions
              </span>
            </div>

            {myApplications.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-3xl mx-auto mb-3">
                  📬
                </div>
                <h3 className="font-bold text-slate-900 text-base">No proposals sent yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse open client contracts in the marketplace and submit your first competitive bid to start earning!
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Browse Open Contracts &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div key={app.id} className="p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-black text-slate-900">{app.jobTitle || 'Client Contract'}</h4>
                        {app.status === 'hired' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm animate-pulse">
                            <span>✓</span> HIRED & ESCROW FUNDED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span> Under Client Review
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed font-mono">
                        &quot;{app.coverLetter}&quot;
                      </p>
                      <p className="text-[11px] text-slate-400 font-semibold">
                        Submitted on {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>

                    <div className="flex md:flex-col items-end justify-between md:justify-center gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Your Bid</p>
                        <p className="text-2xl font-black text-emerald-600">${app.bidAmount} <span className="text-xs font-semibold text-slate-500">USD</span></p>
                      </div>
                      {app.status === 'hired' && (
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                          Funds in Escrow 🔒
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* 2-Column Layout: Filters & Job Matching Feed */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Filter Panel */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/90 sticky top-24 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Filter Contracts</h3>
                  <button 
                    onClick={() => { setSearchQuery(''); setMinBudget(''); }} 
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Reset
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Keywords & Skills</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title, React, Figma..." 
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl py-2.5 px-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Minimum Budget (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">$</span>
                    <input 
                      type="number" 
                      value={minBudget}
                      onChange={(e) => setMinBudget(e.target.value)}
                      placeholder="e.g. 500" 
                      className="w-full border border-slate-200 bg-slate-50 rounded-xl py-2.5 pl-8 pr-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-900 font-medium leading-relaxed">
                  💡 <strong>Pro Tip:</strong> Apply to contracts that align with your verified skills to maximize client response rates.
                </div>
              </div>
            </div>

            {/* Right Column: Live Matching Feed */}
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Open Contracts ({filteredJobs.length})</h2>
                <span className="text-xs font-semibold text-slate-500">Live Client Demand</span>
              </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin mb-3"></div>
                <p className="text-slate-500 text-xs font-bold">Scanning marketplace...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center shadow-sm">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-3">
                  🔍
                </div>
                <h3 className="font-bold text-slate-900 text-base">No matching contracts found</h3>
                <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                  Try clearing your budget threshold or search keywords to view all open opportunities.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <motion.div 
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-snug">{job.title}</h3>
                        <p className="text-xs font-semibold text-slate-400 mt-0.5">Verified Client Contract</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        ${job.budget} USD
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                      {job.description}
                    </p>

                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {job.skills.map((skill, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Proposal Action or Expand Form */}
                    {applyingTo === job.id ? (
                      <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/80 -mx-6 -mb-6 p-6 rounded-b-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900">Submit Proposal to Client</h4>
                          <button 
                            onClick={() => setApplyingTo(null)} 
                            className="text-xs font-bold text-slate-400 hover:text-slate-600"
                          >
                            Cancel
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Your Bid Amount (USD)</label>
                          <input 
                            type="number" 
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            placeholder={`Job Budget: $${job.budget}`}
                            className="w-full border border-slate-200 bg-white rounded-xl py-2 px-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Cover Note / Approach</label>
                          <textarea 
                            rows="3"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Why are you the right expert for this contract?"
                            className="w-full border border-slate-200 bg-white rounded-xl py-2 px-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                          ></textarea>
                        </div>

                        <button 
                          onClick={() => handleApply(job)}
                          className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-indigo-200 transition-all"
                        >
                          Submit Formal Proposal &rarr;
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-semibold text-slate-400">
                          Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                        </span>

                        <button
                          onClick={() => { setApplyingTo(job.id); setBidAmount(job.budget || ''); }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all hover:scale-105"
                        >
                          Submit Proposal
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
        )}

      </div>
    </div>
  );
}
