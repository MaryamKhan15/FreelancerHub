import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

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
    const toastId = toast.loading('Posting your job...');
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
      toast.success('Job posted successfully!', { id: toastId });
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error('Failed to post job.', { id: toastId });
    }
    setLoading(false);
  };

  const totalSpent = jobs.reduce((acc, job) => acc + (job.budget || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Stats */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-6">Welcome back, {userData?.displayName || 'Client'}!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <h3 className="text-indigo-100 font-medium mb-1">Total Jobs Posted</h3>
            <p className="text-4xl font-black">{jobs.length}</p>
          </div>
          <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-violet-200">
            <h3 className="text-violet-100 font-medium mb-1">Total Budget Allocated</h3>
            <p className="text-4xl font-black">${totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
            <h3 className="text-emerald-100 font-medium mb-1">Active Hires</h3>
            <p className="text-4xl font-black">0</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Post Job Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Post a New Job</h2>
            <form onSubmit={handlePostJob} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Need a React Developer"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Required Skills</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="React, Node.js (comma separated)"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Job Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Describe the project requirements..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Budget ($)</label>
                <input
                  type="number"
                  required
                  min="5"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="100"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-70 shadow-md shadow-indigo-200 transition-all"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </form>
          </div>
        </div>

        {/* Jobs List */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Posted Jobs</h2>
            {jobs.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-medium">You haven't posted any jobs yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map(job => (
                  <div key={job.id} className="border border-slate-100 bg-slate-50 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">Posted on {new Date(job.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {job.status}
                      </span>
                    </div>
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((s, i) => (
                          <span key={i} className="bg-white border border-slate-200 text-slate-600 text-xs font-semibold px-2 py-1 rounded-md">{s}</span>
                        ))}
                      </div>
                    )}
                    <p className="text-slate-600 mt-2">{job.description}</p>
                    <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                      <div className="text-lg font-black text-indigo-600">
                        ${job.budget}
                      </div>
                      <button className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                        View Applications &rarr;
                      </button>
                    </div>
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
