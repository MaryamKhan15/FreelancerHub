import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';

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
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (categoryParam === 'All') {
      setFilteredFreelancers(freelancers);
    } else {
      const keywords = CATEGORY_KEYWORDS[categoryParam] || [categoryParam.toLowerCase()];
      
      const filtered = freelancers.filter(f => {
        if (!f.skills || f.skills.length === 0) return false;
        
        // Check if any of the freelancer's skills match any keyword for this category
        return f.skills.some(skill => 
          keywords.some(kw => skill.toLowerCase().includes(kw)) ||
          skill.toLowerCase().includes(categoryParam.toLowerCase())
        );
      });
      setFilteredFreelancers(filtered);
    }
  }, [categoryParam, freelancers]);

  const handleCategoryChange = (cat) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const allCategories = ['All', ...Object.keys(CATEGORY_KEYWORDS)];

  return (
    <div className="bg-slate-50 min-h-screen pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Find Top Talent</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-600">
            Connect with experienced professionals for your next big project.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                categoryParam === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="text-slate-500 font-medium animate-pulse">Finding best freelancers...</p>
          </div>
        ) : filteredFreelancers.length === 0 ? (
          <div className="text-center text-slate-500 font-medium bg-white p-10 rounded-xl shadow-sm border border-slate-200">
            No freelancers found for "{categoryParam}". Try another category!
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredFreelancers.map(freelancer => (
              <div key={freelancer.id} className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm hover:shadow-xl hover:shadow-indigo-100 hover:border-indigo-200 transition-all duration-300">
                <div className="relative mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-600 text-3xl font-extrabold mb-6 shadow-inner">
                  {freelancer.displayName ? freelancer.displayName.charAt(0).toUpperCase() : 'U'}
                  {freelancer.expertise && (
                    <span className="absolute -bottom-2 right-0 bg-white border border-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                      {freelancer.expertise}
                    </span>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-slate-900">{freelancer.displayName || 'Unnamed Freelancer'}</h2>
                <p className="text-sm text-slate-500 mb-6">{freelancer.email}</p>
                
                {freelancer.skills && freelancer.skills.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {freelancer.skills.map((skill, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="border-t border-slate-100 pt-6">
                  <button className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                    Invite to Job
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
