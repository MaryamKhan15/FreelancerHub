import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function FreelancerDashboard() {
  const { currentUser, userData } = useAuth();
  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [bidAmount, setBidAmount] = useState('');

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
      toast.error('Please fill both cover letter and bid amount');
      return;
    }
    const toastId = toast.loading('Submitting proposal...');
    try {
      await addDoc(collection(db, 'applications'), {
        jobId,
        freelancerId: currentUser.uid,
        coverLetter,
        bidAmount: Number(bidAmount),
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      toast.success('Successfully applied for the job!', { id: toastId });
      setApplyingTo(null);
      setCoverLetter('');
      setBidAmount('');
    } catch (err) {
      console.error("Error applying to job:", err);
      toast.error('Failed to apply. Please try again.', { id: toastId });
    }
  };

  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBudget = minBudget ? job.budget >= Number(minBudget) : true;
    return matchesSearch && matchesBudget;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Stats */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Welcome, {userData?.displayName || 'Freelancer'}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <h3 className="text-indigo-100 font-medium mb-1">Available Jobs</h3>
            <p className="text-4xl font-black">{availableJobs.length}</p>
          </div>
          <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-violet-200">
            <h3 className="text-violet-100 font-medium mb-1">Applications Sent</h3>
            <p className="text-4xl font-black">0</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
            <h3 className="text-emerald-100 font-medium mb-1">Earned So Far</h3>
            <p className="text-4xl font-black">$0</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Search & Filter Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Filter Jobs</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Keywords</label>
                <input 
                  type="text" 
                  placeholder="React, Design..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Min Budget ($)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 500" 
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Recommended Jobs</h2>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {filteredJobs.length} Matches
              </span>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
                <p className="text-slate-500 font-medium">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">No open jobs found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredJobs.map(job => (
                  <div key={job.id} className="border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors">{job.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-2xl font-black text-emerald-600">${job.budget}</div>
                    </div>
                    
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((s, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-1 rounded-md">{s}</span>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-slate-700 leading-relaxed line-clamp-3">{job.description}</p>
                    
                    {applyingTo === job.id ? (
                      <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                        <h4 className="font-bold text-slate-900 mb-4">Submit your proposal</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Your Bid ($)</label>
                            <input 
                              type="number" 
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-colors" 
                              placeholder="e.g. 50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Cover Letter</label>
                            <textarea 
                              rows="4" 
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-indigo-500 transition-colors"
                              placeholder="Why are you the best fit for this job?"
                            />
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button 
                              onClick={() => handleApply(job.id)}
                              className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
                            >
                              Submit Application
                            </button>
                            <button 
                              onClick={() => setApplyingTo(null)}
                              className="bg-white text-slate-600 font-bold px-6 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 pt-6 border-t border-slate-100">
                        <button 
                          onClick={() => setApplyingTo(job.id)}
                          className="bg-indigo-50 text-indigo-700 font-bold px-6 py-2.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-colors"
                        >
                          Apply Now &rarr;
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
