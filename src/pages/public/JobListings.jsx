import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, 'jobs'), where('status', '==', 'open'));
        const querySnapshot = await getDocs(q);
        const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        jobsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Artificial delay of 1 second to show off the loading state
        setTimeout(() => {
          setJobs(jobsData);
          setLoading(false);
        }, 1000);

      } catch (error) {
        console.error("Error fetching jobs:", error);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Browse Open Jobs</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600">
            Discover your next great opportunity. Log in to apply.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="text-slate-500 font-medium animate-pulse">Fetching latest jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-slate-500 font-medium bg-white p-10 rounded-xl shadow-sm border border-slate-200">
            No jobs available at the moment.
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {jobs.map(job => (
              <div key={job.id} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-200 transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">{job.title}</h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700 whitespace-nowrap ml-4 shadow-sm">
                    ${job.budget}
                  </span>
                </div>
                
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold px-2 py-1 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-slate-600 mb-6 flex-grow leading-relaxed">{job.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                  <span className="text-sm font-medium text-slate-400">Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
                  <Link to="/login" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center group">
                    Log in to Apply 
                    <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
