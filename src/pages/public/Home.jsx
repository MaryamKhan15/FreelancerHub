import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const categories = [
  { name: "Website Development", icon: "💻", count: "1,420+ Experts", color: "from-blue-500/10 to-indigo-500/10 text-indigo-600 border-indigo-100" },
  { name: "Graphic Design", icon: "🎨", count: "980+ Experts", color: "from-pink-500/10 to-rose-500/10 text-rose-600 border-rose-100" },
  { name: "Mobile Apps", icon: "📱", count: "740+ Experts", color: "from-violet-500/10 to-purple-500/10 text-violet-600 border-violet-100" },
  { name: "SEO & Marketing", icon: "📈", count: "510+ Experts", color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-100" },
  { name: "Logo & Branding", icon: "✨", count: "830+ Experts", color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-100" },
  { name: "Video Editing", icon: "🎬", count: "620+ Experts", color: "from-cyan-500/10 to-blue-500/10 text-cyan-600 border-cyan-100" },
  { name: "Copywriting", icon: "✍️", count: "410+ Experts", color: "from-fuchsia-500/10 to-pink-500/10 text-fuchsia-600 border-fuchsia-100" },
  { name: "Data Entry & Admin", icon: "📊", count: "390+ Experts", color: "from-slate-500/10 to-gray-500/10 text-slate-700 border-slate-200" },
];

const stats = [
  { label: "Total Escrow Paid", value: "$4.2M+", change: "+24% this month" },
  { label: "Job Success Rate", value: "99.4%", change: "Top tier reliability" },
  { label: "Average Time to Hire", value: "48 mins", change: "Instant matching" },
  { label: "Active Verified Pros", value: "12,800+", change: "Vetted & certified" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const categoriesRef = useRef(null);
  const processRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/freelancers?category=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/freelancers');
    }
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Category Cards Stagger
      gsap.from(".category-card", {
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out"
      });

      // Process items
      gsap.from(".process-item", {
        scrollTrigger: {
          trigger: processRef.current,
          start: "top 75%",
        },
        x: -40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out"
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-slate-50 overflow-hidden font-sans">
      
      {/* Hero Section with Modern Tech Grid Background */}
      <div className="relative pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-200 bg-white bg-grid-pattern">
        {/* Ambient Top Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="lg:col-span-7 text-center lg:text-left"
            >
              {/* Tech Pill Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200/60 text-xs font-bold text-indigo-700 mb-6 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>SYSTEM ONLINE · 12,000+ VERIFIED TALENTS READY</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                The modern marketplace for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700">elite freelance talent.</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Connect with world-class developers, designers, and marketers on demand. Secure milestone escrow, verified portfolios, and instant collaboration.
              </motion.p>
              
              {/* Interactive Search Bar */}
              <motion.form variants={fadeInUp} onSubmit={handleSearch} className="mb-6 max-w-xl mx-auto lg:mx-0">
                <div className="relative flex items-center bg-white p-2 rounded-2xl border-2 border-slate-200 shadow-xl shadow-indigo-100/50 focus-within:border-indigo-600 transition-all">
                  <svg className="w-6 h-6 text-slate-400 ml-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search skills (e.g. React, Flutter, UI Design)..."
                    className="w-full px-4 py-2.5 text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none text-base font-medium"
                  />
                  <button 
                    type="submit" 
                    className="shrink-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-300 hover:scale-[1.02] transition-all"
                  >
                    Search
                  </button>
                </div>
              </motion.form>

              {/* Quick Tags */}
              <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2 justify-center lg:justify-start text-xs text-slate-500 font-semibold mb-8">
                <span className="text-slate-400 uppercase tracking-wider text-[11px]">Popular:</span>
                {['React', 'Mobile Apps', 'Logo Design', 'SEO'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/freelancers?category=${encodeURIComponent(tag)}`)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </motion.div>

              {/* CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register" className="px-7 py-3.5 rounded-xl text-white bg-indigo-600 font-bold text-base shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200 text-center">
                  Get Started Free &rarr;
                </Link>
                <Link to="/jobs" className="px-7 py-3.5 rounded-xl text-slate-700 bg-white border border-slate-200 font-bold text-base hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-center shadow-sm">
                  Browse Open Jobs
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Right Interactive Mockup / Bento Stack */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8 }}
              className="mt-12 lg:mt-0 lg:col-span-5 relative"
            >
              {/* Decorative Gradient Frame */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 via-violet-500 to-pink-500 rounded-3xl blur-xl opacity-20"></div>
              
              <div className="relative space-y-4">
                
                {/* Main Card: Verified Top Talent */}
                <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-2xl shadow-slate-200/60">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-extrabold flex items-center justify-center text-xl shadow-md">
                          SC
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-lg">Sarah Chen</h3>
                          <span className="text-indigo-600 text-sm">✓</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-500">Senior Full-Stack Architect</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      $95 / hr
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Specialized in React 19, Flutter, and high-load backend pipelines. Ex-fintech lead engineer.
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {['React', 'Node.js', 'Next.js', 'AWS'].map((s, i) => (
                      <span key={i} className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-semibold">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      ★ 4.99 <span className="text-slate-400 font-normal">(184 reviews)</span>
                    </span>
                    <span className="text-emerald-600 font-bold">100% Job Success</span>
                  </div>
                </div>

                {/* Secondary Floating Card: Escrow Protected */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 shadow-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                      ✓
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Milestone Escrow Released</p>
                      <p className="text-sm font-extrabold text-white">$2,450.00 USD Paid</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Secured
                  </span>
                </div>

                {/* Third Floating Card: Active Match Feed */}
                <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                    <span className="text-xs font-bold text-slate-800">New Match: Mobile App Engineer</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">Just now</span>
                </div>

              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Live Statistics Strip (High SaaS Credibility) */}
      <div className="py-8 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{s.value}</div>
                <div className="text-xs sm:text-sm font-bold text-indigo-400 mt-1">{s.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{s.change}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trusted By Logos */}
      <div className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-6">Trusted by 10,000+ companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
            <span className="text-xl sm:text-2xl font-bold font-serif text-slate-800">Amazon</span>
            <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter">stripe</span>
            <span className="text-xl sm:text-2xl font-bold italic text-slate-800">Deloitte.</span>
            <span className="text-xl sm:text-2xl font-mono font-bold text-slate-800">IBM</span>
            <span className="text-xl sm:text-2xl font-black text-slate-800">Google</span>
          </div>
        </div>
      </div>

      {/* Categories Bento Grid Section */}
      <div className="py-20 bg-slate-50" ref={categoriesRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Browse by Expertise</h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal">
              Find pre-screened freelancers ready to start immediately on your project.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((cat, idx) => (
              <div key={idx} className="category-card">
                <Link 
                  to={`/freelancers?category=${encodeURIComponent(cat.name)}`} 
                  className="block p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} border flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-slate-400 font-medium mb-4">{cat.count}</p>
                  
                  <div className="text-xs text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Find Experts <span>&rarr;</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works / Why Choose Us Section */}
      <div className="py-20 bg-slate-900 text-white relative overflow-hidden bg-dot-dark" ref={processRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">How FreelanceHub Works</h2>
            <p className="mt-3 text-slate-400 text-base">Simple 3-step pipeline to hire and collaborate with zero friction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="process-item p-8 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 font-black text-xl flex items-center justify-center mb-6 border border-indigo-500/30">
                01
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Post a Requirement</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Describe your project, set your budget, and outline necessary skills. Our system instantly notifies matching talent.
              </p>
            </div>

            <div className="process-item p-8 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 font-black text-xl flex items-center justify-center mb-6 border border-violet-500/30">
                02
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Evaluate & Select</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Compare bids, inspect verified portfolio items, review feedback scores, and interview shortlisted candidates.
              </p>
            </div>

            <div className="process-item p-8 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-xl flex items-center justify-center mb-6 border border-emerald-500/30">
                03
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Pay Securely on Release</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Funds stay safely in escrow until you approve completed work. 100% satisfaction guaranteed before payment release.
              </p>
            </div>
          </div>

          {/* CTA Strip */}
          <div className="mt-16 p-10 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-center text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h3 className="text-2xl sm:text-3xl font-black">Ready to scale your next big idea?</h3>
              <p className="text-indigo-100 text-sm mt-1">Join thousands of clients hiring the world's best freelancers.</p>
            </div>
            <Link to="/register" className="shrink-0 px-8 py-3.5 bg-white text-indigo-700 font-extrabold rounded-xl shadow-lg hover:bg-slate-50 hover:scale-105 transition-all duration-200">
              Create Account Now &rarr;
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
