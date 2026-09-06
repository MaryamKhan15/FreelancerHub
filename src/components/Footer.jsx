import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-black text-white flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-lg font-bold">F</span>
              FreelanceHub
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The ultimate platform connecting top-tier freelance talent with forward-thinking businesses globally. Build your dream team today.
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholders */}
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                𝕏
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                in
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                GH
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">For Clients</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/freelancers" className="hover:text-indigo-400 transition-colors">Find Freelancers</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Post a Job</Link></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Enterprise Solutions</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Trust & Safety</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">For Freelancers</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/jobs" className="hover:text-indigo-400 transition-colors">Find Work</Link></li>
              <li><Link to="/register" className="hover:text-indigo-400 transition-colors">Create Profile</Link></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Community Forum</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6">Company</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} FreelanceHub Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <span>Made with</span>
            <span className="text-rose-500">❤️</span>
            <span>using React & Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
