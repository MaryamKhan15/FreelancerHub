import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = [
  "All",
  "Website Development",
  "Mobile Apps",
  "Graphic Design",
  "Logo Design",
  "SEO & Marketing",
  "Copywriting",
  "Video Editing"
];

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(collection(db, 'jobs'), where('status', '==', 'open'));
        const querySnapshot = await getDocs(q);
        const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Artificial delay of 1 second for realistic load
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

  // Filter and Sort Jobs
  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = 
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.skills && job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory = 
        selectedCategory === 'All' || 
        job.category === selectedCategory ||
        (job.skills && job.skills.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase())));

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'budget-high') return (Number(b.budget) || 0) - (Number(a.budget) || 0);
      if (sortBy === 'budget-low') return (Number(a.budget) || 0) - (Number(b.budget) || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      
      {/* High-Tech Hero Header with Grid Pattern */}
      <div className="relative pt-12 pb-16 border-b border-slate-200 bg-white bg-grid-pattern overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-64 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-blue-500/10 blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-xs font-bold text-indigo-700 mb-5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>LIVE CONTRACT FEED · ESCROW VERIFIED</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Explore Open <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700">Client Projects</span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 font-normal">
            Work with verified global clients on high-impact web, mobile, and design contracts.
          </p>

          {/* Search Bar in Hero */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white p-2 rounded-2xl border-2 border-slate-200 shadow-xl shadow-indigo-100/50 focus-within:border-indigo-600 transition-all">
              <svg className="w-6 h-6 text-slate-400 ml-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, skill (e.g. React, UI/UX)..."
                className="w-full px-4 py-2.5 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none text-base font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Jobs Feed Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div className="text-sm font-bold text-slate-600">
            Showing <span className="text-indigo-600 font-extrabold">{filteredJobs.length}</span> open contract{filteredJobs.length !== 1 && 's'}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 shadow-sm"
            >
              <option value="newest">Latest Posted</option>
              <option value="budget-high">Budget: High to Low</option>
              <option value="budget-low">Budget: Low to High</option>
            </select>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
            </div>
            <p className="text-slate-500 font-bold text-sm animate-pulse tracking-wide">Syncing open jobs feed...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mb-4">
              🔍
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs match your criteria</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Try adjusting your search terms, clearing filters, or check back soon for newly posted contracts.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Grid of Modern Job Cards */
          <div className="grid gap-6 md:grid-cols-2">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-slate-200/90 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:shadow-indigo-100/40 hover:border-indigo-400/60 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Meta Line */}
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Verified Client
                    </span>
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-sm font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-sm">
                      ${job.budget} <span className="text-[11px] font-semibold text-emerald-600 ml-1">USD</span>
                    </span>
                  </div>

                  {/* Job Title */}
                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
                    {job.title}
                  </h2>

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 font-normal">
                    {job.description}
                  </p>
                </div>

                <div>
                  {/* Skills Tag Strip */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {job.skills.map((skill, idx) => (
                        <span 
                          key={idx} 
                          className="bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-1 rounded-md"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-medium">
                    <span className="text-slate-400">
                      Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                    </span>
                    
                    <Link 
                      to="/login" 
                      className="inline-flex items-center gap-1 font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-100 group-hover:scale-105"
                    >
                      Apply Now <span>&rarr;</span>
                    </Link>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
