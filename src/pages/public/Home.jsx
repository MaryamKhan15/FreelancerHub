import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const categories = [
  { name: "Website Development", icon: "💻", color: "bg-indigo-50 text-indigo-700" },
  { name: "Graphic Design", icon: "🎨", color: "bg-fuchsia-50 text-fuchsia-700" },
  { name: "Logo Design", icon: "✨", color: "bg-purple-50 text-purple-700" },
  { name: "SEO & Marketing", icon: "📈", color: "bg-emerald-50 text-emerald-700" },
  { name: "Copywriting", icon: "✍️", color: "bg-amber-50 text-amber-700" },
  { name: "Data Entry", icon: "📊", color: "bg-slate-100 text-slate-700" },
  { name: "Mobile Apps", icon: "📱", color: "bg-violet-50 text-violet-700" },
  { name: "Video Editing", icon: "🎬", color: "bg-rose-50 text-rose-700" },
];

export default function Home() {
  const categoriesRef = useRef(null);
  const processRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Categories Grid Animation
      gsap.from(".category-card", {
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      });

      // Process Section Animation
      gsap.from(".process-item", {
        scrollTrigger: {
          trigger: processRef.current,
          start: "top 75%",
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });
      
      // Feature Box Animation
      gsap.from(".feature-box", {
        scrollTrigger: {
          trigger: processRef.current,
          start: "top 60%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-slate-50 overflow-hidden font-sans">
      
      {/* Hero Section - Premium SaaS Style */}
      <div className="relative pt-8 pb-16 lg:pt-12 lg:pb-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="lg:col-span-6 text-center lg:text-left"
            >
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
                Hire the best freelancers for any job, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">online.</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Millions of people use FreelanceHub to turn their ideas into reality. Find professionals you can trust by browsing their samples of previous work and reading their profile reviews.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register" className="px-8 py-4 rounded-md text-white bg-indigo-600 font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300">
                  Hire a Freelancer
                </Link>
                <Link to="/jobs" className="px-8 py-4 rounded-md text-indigo-700 bg-indigo-50 border-2 border-indigo-200 font-bold text-lg hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-300">
                  Earn Money
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
              className="hidden lg:block lg:col-span-6 relative"
            >
              {/* Decorative blob behind image */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[2rem] blur-lg opacity-30"></div>
              <img
                className="relative w-full h-auto object-cover rounded-[2rem] shadow-2xl ring-1 ring-slate-900/5"
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Freelancer working on a laptop"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="py-10 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-bold uppercase text-slate-400 tracking-widest mb-8">Trusted by forward-thinking teams</p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="text-2xl font-bold font-serif text-slate-800">Amazon</div>
             <div className="text-2xl font-bold font-sans tracking-tighter text-slate-800">facebook</div>
             <div className="text-2xl font-bold font-sans italic text-slate-800">Deloitte.</div>
             <div className="text-2xl font-bold font-mono text-slate-800">IBM</div>
             <div className="text-2xl font-bold font-sans text-slate-800">Google</div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-24 bg-slate-50" ref={categoriesRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Find top talent in any category</h2>
            <p className="mt-4 text-xl text-slate-600">Get exactly what you need, exactly when you need it with our specialized experts.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="category-card">
                <Link to={`/freelancers?category=${encodeURIComponent(cat.name)}`} className="block p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all duration-300 group cursor-pointer h-full">
                  <div className={`w-14 h-14 rounded-xl ${cat.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{cat.name}</h3>
                  <div className="text-indigo-600 font-semibold flex items-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Find experts <span className="ml-2">→</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process / Why Choose Us */}
      <div className="py-24 bg-slate-900 text-white relative overflow-hidden" ref={processRef}>
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 rounded-full bg-indigo-600 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 rounded-full bg-violet-600 opacity-20 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between relative z-10">
          <div className="lg:w-1/2 pr-8">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 text-white">Need something done?</h2>
            
            <div className="space-y-10 mt-12">
              <div className="flex process-item group">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                    <span className="text-indigo-400 group-hover:text-white font-bold text-xl transition-colors">1</span>
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-white">Post a job</h3>
                  <p className="mt-3 text-slate-400 leading-relaxed">It's free and easy to post a job. Simply fill in a title, description and budget and competitive bids come within minutes.</p>
                </div>
              </div>

              <div className="flex process-item group">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                    <span className="text-indigo-400 group-hover:text-white font-bold text-xl transition-colors">2</span>
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-white">Choose freelancers</h3>
                  <p className="mt-3 text-slate-400 leading-relaxed">No job is too big or too small. We have freelancers for jobs of any size or budget, across 1800+ skills.</p>
                </div>
              </div>

              <div className="flex process-item group">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                    <span className="text-indigo-400 group-hover:text-white font-bold text-xl transition-colors">3</span>
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-white">Pay safely</h3>
                  <p className="mt-3 text-slate-400 leading-relaxed">Only pay for work when it has been completed and you're 100% satisfied with the quality using our milestone payment system.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
            <div className="feature-box bg-slate-800/80 backdrop-blur-xl rounded-2xl p-10 border border-slate-700 shadow-[0_0_50px_rgba(79,70,229,0.15)]">
               <h3 className="text-2xl font-extrabold mb-8 text-white">What's great about it?</h3>
               <ul className="space-y-6">
                 <li className="flex items-start">
                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4">
                     <span className="text-emerald-400 text-sm">✓</span>
                   </div>
                   <span className="text-slate-300">Browse portfolios, reviews, and identity verification.</span>
                 </li>
                 <li className="flex items-start">
                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4">
                     <span className="text-emerald-400 text-sm">✓</span>
                   </div>
                   <span className="text-slate-300">Receive free quotes from talented freelancers.</span>
                 </li>
                 <li className="flex items-start">
                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4">
                     <span className="text-emerald-400 text-sm">✓</span>
                   </div>
                   <span className="text-slate-300">Use our secure platform to chat, share files, and collaborate.</span>
                 </li>
                 <li className="flex items-start">
                   <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-4">
                     <span className="text-emerald-400 text-sm">✓</span>
                   </div>
                   <span className="text-slate-300">24/7 support to help you resolve any issues quickly.</span>
                 </li>
               </ul>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
