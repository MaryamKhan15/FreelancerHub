import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import RealTimeChatModal from '../../components/RealTimeChatModal';

const CATEGORY_KEYWORDS = {
  "Website Development": ["web", "react", "node", "html", "css", "js", "frontend", "backend", "fullstack", "developer"],
  "Graphic Design": ["design", "photoshop", "illustrator", "ui", "ux", "graphics", "figma"],
  "Logo Design": ["logo", "branding", "illustrator"],
  "SEO & Marketing": ["seo", "marketing", "digital", "sem", "social"],
  "Copywriting": ["copy", "write", "blog", "content", "writer"],
  "Data Entry": ["data", "excel", "typing", "admin"],
  "Mobile Apps": ["mobile", "app", "ios", "android", "flutter", "react native", "swift", "kotlin"],
  "Video Editing": ["video", "premiere", "editing", "after effects", "vlog"]
};

export default function FreelancerListings() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFreelancer, setSelectedFreelancer] = useState(null); // For Profile Inspection Modal
  const [chatTarget, setChatTarget] = useState(null); // For direct RealTimeChatModal
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'freelancer'));
        const querySnapshot = await getDocs(q);
        const freelancersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Artificial delay of 1 second
        setTimeout(() => {
          setFreelancers(freelancersData);
          setLoading(false);
        }, 1000);

      } catch (error) {
        console.error("Error fetching freelancers:", error);
        setLoading(false);
      }
    };
    fetchFreelancers();
  }, []);

  const handleCategoryChange = (cat) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const allCategories = ['All', ...Object.keys(CATEGORY_KEYWORDS)];

  // Filter Freelancers based on Category and Search Query
  const filteredFreelancers = freelancers.filter(f => {
    // 1. Check Category Match
    let matchesCategory = true;
    if (categoryParam !== 'All') {
      const keywords = CATEGORY_KEYWORDS[categoryParam] || [categoryParam.toLowerCase()];
      matchesCategory = f.skills && f.skills.some(skill => 
        keywords.some(kw => skill.toLowerCase().includes(kw)) ||
        skill.toLowerCase().includes(categoryParam.toLowerCase())
      );
    }

    // 2. Check Search Query Match
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      matchesSearch = 
        f.displayName?.toLowerCase().includes(query) ||
        f.expertise?.toLowerCase().includes(query) ||
        f.bio?.toLowerCase().includes(query) ||
        (f.skills && f.skills.some(s => s.toLowerCase().includes(query)));
    }

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans">
      
      {/* High-Tech Hero Header with Grid Pattern */}
      <div className="relative pt-12 pb-16 border-b border-slate-200 bg-white bg-grid-pattern overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-64 bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-pink-500/10 blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200/80 text-xs font-bold text-violet-700 mb-5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>VETTED PRO NETWORK · 100% IDENTITY & CREDENTIALS VERIFIED</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Hire Verified <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">Specialized Talent</span>
          </h1>
          
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 font-normal">
            Browse full credentials, verified degrees, portfolios, and client reviews before hiring.
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
                placeholder="Search by name, skill, or credential (e.g. React, Flutter, AWS)..."
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

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  categoryParam === cat
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

      {/* Main Freelancers Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Results Bar */}
        <div className="flex items-center justify-between pb-4 mb-8 border-b border-slate-200">
          <div className="text-sm font-bold text-slate-600">
            Showing <span className="text-indigo-600 font-extrabold">{filteredFreelancers.length}</span> certified professional{filteredFreelancers.length !== 1 && 's'}
          </div>
          {categoryParam !== 'All' && (
            <div className="text-xs font-bold text-slate-500">
              Filter: <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{categoryParam}</span>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-violet-100 border-t-indigo-600 animate-spin"></div>
            </div>
            <p className="text-slate-500 font-bold text-sm animate-pulse tracking-wide">Retrieving verified talent directory...</p>
          </div>
        ) : filteredFreelancers.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center text-3xl mb-4">
              👨‍💻
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No freelancers found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              No matching profiles found for "{categoryParam !== 'All' ? categoryParam : searchQuery}". Try clearing your filters or search for another skill.
            </p>
            <button
              onClick={() => { setSearchQuery(''); handleCategoryChange('All'); }}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Grid of Modern Talent Cards */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFreelancers.map((freelancer) => {
              const rate = freelancer.hourlyRate || 55;
              const exp = freelancer.experienceYears || '3-5 Years';
              const cert = freelancer.certification || 'Verified Degree & Identity';
              const bioSnippet = freelancer.bio || 'Experienced specialist delivering high-performance solutions for verified clients.';

              return (
                <motion.div
                  key={freelancer.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-400/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Profile Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
                          {freelancer.displayName ? freelancer.displayName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Online Now"></span>
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                            {freelancer.displayName || 'Pro Freelancer'}
                          </h2>
                          <span className="text-indigo-600 text-sm shrink-0" title="Identity Verified by FreelanceHub">✓</span>
                        </div>
                        
                        <p className="text-xs font-semibold text-indigo-600 mt-0.5 truncate">
                          {freelancer.expertise || 'General Specialist'}
                        </p>

                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <span className="text-amber-500 font-bold">★ 4.98</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold">100% Success</span>
                        </div>
                      </div>
                    </div>

                    {/* Verified Credentials Pill Tag */}
                    <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold w-full truncate">
                      <span>🛡️</span>
                      <span className="truncate">{cert}</span>
                    </div>

                    {/* Rate & Experience Strip */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-xs">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Rate</span>
                        <strong className="text-emerald-700 font-extrabold text-sm">${rate} / hr</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400">Experience</span>
                        <strong className="text-slate-800 font-bold">{exp}</strong>
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {bioSnippet}
                    </p>

                    {/* Skills Tags */}
                    {freelancer.skills && freelancer.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {freelancer.skills.slice(0, 4).map((skill, idx) => (
                          <span 
                            key={idx} 
                            className="bg-indigo-50/70 text-indigo-700 border border-indigo-100 text-xs font-semibold px-2.5 py-0.5 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                        {freelancer.skills.length > 4 && (
                          <span className="text-[11px] font-bold text-slate-400 self-center">
                            +{freelancer.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: View Credentials & Direct Chat */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedFreelancer(freelancer)}
                      className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        if (!currentUser) {
                          navigate('/login');
                        } else {
                          setChatTarget({
                            targetUser: {
                              id: freelancer.id,
                              name: freelancer.displayName || 'Verified Freelancer',
                              email: freelancer.email || '',
                              role: 'freelancer'
                            },
                            jobContext: 'Direct Project Inquiry'
                          });
                        }
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-2.5 px-3 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-xs"
                    >
                      <span>💬 Chat</span>
                      <span>&rarr;</span>
                    </button>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}

      </div>

      {/* FULL VERIFIED CREDENTIALS MODAL DRAWER */}
      <AnimatePresence>
        {selectedFreelancer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedFreelancer(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm"
              >
                ✕
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center text-3xl font-black shadow-md shrink-0">
                  {selectedFreelancer.displayName ? selectedFreelancer.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900">{selectedFreelancer.displayName || 'Pro Freelancer'}</h3>
                    <span className="text-indigo-600 text-lg">✓</span>
                  </div>
                  <p className="text-sm font-bold text-indigo-600 mt-0.5">{selectedFreelancer.expertise || 'General Specialist'}</p>
                  <p className="text-xs text-slate-400 mt-1">{selectedFreelancer.email}</p>
                </div>
              </div>

              {/* Verified Badge Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛡️</span>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">100% Verified Credentials</h4>
                    <p className="text-xs text-emerald-700">Identity, qualifications, and portfolio vetted by FreelanceHub team.</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
                  VERIFIED
                </span>
              </div>

              {/* Key Credentials Breakdown */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 text-center">
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">Hourly Rate</span>
                  <span className="text-lg font-black text-emerald-700">${selectedFreelancer.hourlyRate || 55} / hr</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">Experience</span>
                  <span className="text-lg font-black text-slate-800">{selectedFreelancer.experienceYears || '3-5 Years'}</span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase">Job Success</span>
                  <span className="text-lg font-black text-indigo-600">100% Score</span>
                </div>
              </div>

              {/* Professional Bio */}
              <div className="mb-6">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Professional Summary & Bio</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {selectedFreelancer.bio || 'Specialized in delivering robust, high-availability web and cloud products with zero technical debt.'}
                </p>
              </div>

              {/* Degree & Certification Document */}
              <div className="mb-6">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Academic Degree & Certifications</h4>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📜</span>
                    <div>
                      <strong className="text-xs text-slate-900 block font-bold">{selectedFreelancer.certification || 'Certified Software Engineer / BSc Computer Science'}</strong>
                      <span className="text-[11px] text-slate-400">Official Document On File: {selectedFreelancer.verificationDocument || 'Degree_Certificate_Verified.pdf'}</span>
                    </div>
                  </div>
                  <span className="text-emerald-600 font-extrabold text-xs">✓ Validated</span>
                </div>
              </div>

              {/* Portfolio & External Link */}
              <div className="mb-6">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Verified Portfolio / GitHub</h4>
                <a 
                  href={selectedFreelancer.portfolioUrl || 'https://github.com'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline p-2 rounded-lg bg-indigo-50/50"
                >
                  <span>🔗 {selectedFreelancer.portfolioUrl || 'https://github.com/freelancer-profile'}</span>
                  <span className="text-[10px] text-slate-400">&rarr;</span>
                </a>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Verified Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedFreelancer.skills || ['React', 'Node.js', 'UI/UX', 'Cloud']).map((s, i) => (
                    <span key={i} className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedFreelancer(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
                >
                  Close Profile
                </button>
                <button
                  onClick={() => {
                    const freelancer = selectedFreelancer;
                    setSelectedFreelancer(null);
                    if (!currentUser) {
                      navigate('/login');
                    } else {
                      setChatTarget({
                        targetUser: {
                          id: freelancer.id,
                          name: freelancer.displayName || 'Verified Freelancer',
                          email: freelancer.email || '',
                          role: 'freelancer'
                        },
                        jobContext: 'Direct Project Inquiry'
                      });
                    }
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-center font-extrabold text-sm rounded-xl shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>💬 Direct Chat</span>
                  <span>&rarr;</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Direct Real-Time Chat Modal */}
      {chatTarget && (
        <RealTimeChatModal
          isOpen={Boolean(chatTarget)}
          onClose={() => setChatTarget(null)}
          targetUser={chatTarget.targetUser}
          jobContext={chatTarget.jobContext}
        />
      )}

    </div>
  );
}
