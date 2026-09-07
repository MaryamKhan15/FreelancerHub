import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Pricing() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans bg-grid-pattern">
      
      {/* Hero Header */}
      <div className="relative pt-14 pb-20 border-b border-slate-200 bg-white bg-grid-pattern text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 blur-3xl pointer-events-none rounded-full" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 mb-5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            TRANSPARENT MONETIZATION · ZERO 20% EXPLOITATIVE CUTS
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Fair Pricing for Everyone. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
              Zero Hidden Traps.
            </span>
          </h1>

          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto font-normal">
            Unlike legacy platforms that deduct up to 20% of your earnings, FreelanceHub operates on a sustainable low-fee model. You keep 97% of everything you earn.
          </p>
        </div>
      </div>

      {/* Pricing Cards Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Tier 1: Community Free */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">Basic Tier</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">Always Free</span>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-1">Community</h3>
              <p className="text-xs text-slate-500 mb-6">Perfect for freelancers and clients starting out with zero upfront risk.</p>
              
              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-100">
                <span className="text-4xl font-black text-slate-900">$0</span>
                <span className="text-slate-400 text-sm font-semibold">/ month</span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600 font-medium mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Zero Bidding Fees</strong> (No paid "Connects")</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Standard Job Posting & Applications</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Direct Milestone Escrow Protection</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Only <strong>3% Flat Escrow Fee</strong> on release</span>
                </li>
              </ul>
            </div>

            <Link
              to="/register"
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-center font-bold text-sm transition-all"
            >
              Get Started Free
            </Link>
          </div>

          {/* Tier 2: Freelancer PRO (Highlighted) */}
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950 text-white rounded-3xl p-8 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/20 flex flex-col justify-between relative transform md:-translate-y-2">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-[11px] font-black tracking-wider uppercase text-white shadow-md">
              Most Popular for Freelancers
            </div>

            <div>
              <div className="flex justify-between items-center mb-4 mt-2">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-400">Pro Talent</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Priority Tier</span>
              </div>
              
              <h3 className="text-2xl font-black text-white mb-1">FreelanceHub PRO</h3>
              <p className="text-xs text-slate-400 mb-6">Designed for professionals who want top search rankings and instant high-value jobs.</p>
              
              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-800">
                <span className="text-4xl font-black text-white">$9.99</span>
                <span className="text-slate-400 text-sm font-semibold">/ month</span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-300 font-medium mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span><strong>Golden Pro Verified Badge</strong> on profile</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span><strong>Top 10% Placement</strong> in client talent searches</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>Client proposal highlights (First in review queue)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>Instant Match SMS & Email Notifications</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>Zero withdrawal payout fees</span>
                </li>
              </ul>
            </div>

            <Link
              to="/register"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-center font-extrabold text-sm shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02]"
            >
              Upgrade to Pro &rarr;
            </Link>
          </div>

          {/* Tier 3: Client Featured / Enterprise */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">For Hiring Teams</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-50 text-violet-700 border border-violet-100">Speed Hiring</span>
              </div>
              
              <h3 className="text-2xl font-black text-slate-900 mb-1">Featured Contract</h3>
              <p className="text-xs text-slate-500 mb-6">For companies that need urgent, pre-vetted engineers or designers within 24 hours.</p>
              
              <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-100">
                <span className="text-4xl font-black text-slate-900">$29</span>
                <span className="text-slate-400 text-sm font-semibold">/ per contract</span>
              </div>

              <ul className="space-y-3.5 text-xs text-slate-600 font-medium mb-8">
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>Pinned to Top of Jobs Board</strong> for 14 Days</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span><strong>"Urgent Contract"</strong> Highlight Badge</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Sent directly to Top 5% matching freelancers</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Average time to first proposal: <strong>&lt; 30 minutes</strong></span>
                </li>
              </ul>
            </div>

            <Link
              to="/register"
              className="w-full py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-center font-bold text-sm transition-all border border-indigo-200"
            >
              Post Featured Contract
            </Link>
          </div>

        </div>

        {/* Breakdown Banner: How We Make Money vs Upwork */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-black text-slate-900">How Does FreelanceHub Monetize?</h3>
            <p className="text-sm text-slate-500 mt-1">Full transparency on platform revenue — sustainable for us, profitable for you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-indigo-600 mb-1">3%</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Flat Escrow Fee</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Only charged upon successful milestone release for automated payment processing & dispute moderation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-violet-600 mb-1">$9.99</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Pro Subscriptions</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Optional monthly subscriptions for freelancers seeking priority visibility and profile boosts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="text-3xl font-black text-emerald-600 mb-1">$29</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Featured Jobs</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                One-time client fees to pin urgent contracts at the top of the job search board.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
