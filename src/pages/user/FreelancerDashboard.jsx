import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function FreelancerDashboard() {
  const { currentUser, userData } = useAuth();
  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);

  // Advanced Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [minBudget, setMinBudget] = useState('');

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
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    if (!coverLetter || !bidAmount) {
      toast.error('Please specify both bid amount and proposal note.');
      return;
    }
    const toastId = toast.loading('Submitting proposal to client...');
    try {
      await addDoc(collection(db, 'applications'), {
        jobId,
        freelancerId: currentUser.uid,
        coverLetter,
        bidAmount: Number(bidAmount),
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      toast.success('Proposal submitted successfully!', { id: toastId });
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-bold text-violet-700 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              VERIFIED TALENT WORKSPACE
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">{userData?.displayName || 'Freelancer'}</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">Discover new client contracts, submit proposals, and track milestone earnings.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
              Role: <strong className="text-indigo-600 font-extrabold">{userData?.expertise || 'Developer / Designer'}</strong>
            </span>
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

        {/* 2-Column Layout: Filters & Job Matching Feed */}
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
                          onClick={() => handleApply(job.id)}
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

      </div>
    </div>
  );
}
