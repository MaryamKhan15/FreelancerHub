import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function UpgradeProModal({ isOpen, onClose, onSuccess }) {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (!isOpen) return null;

  const handleUpgrade = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Please log in first to upgrade your account.');
      onClose();
      navigate('/login');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Processing secure Escrow payment...');

    try {
      await new Promise(r => setTimeout(r, 1200));

      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        isPro: true,
        proBadge: 'Golden Pro Verified',
        proSince: new Date().toISOString(),
        proTier: 'FreelanceHub PRO (.99/mo)'
      });

      toast.success('🎉 Congratulations! PRO Subscription activated!', { id: toastId, duration: 4000 });
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Error activating Pro:', err);
      toast.error('Failed to process upgrade. Please try again.', { id: toastId });
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 text-white rounded-3xl shadow-2xl border border-indigo-500/40 overflow-hidden"
        >
          {/* Glowing header */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-b border-indigo-500/20">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-sm font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg shadow-amber-500/30">
                👑
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Priority Monetization
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">Upgrade to FreelanceHub PRO</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Unlock top 10% search placement, golden verified badge, and 0% withdrawal fees.
            </p>
          </div>

          {/* Pricing Strip */}
          <div className="px-6 sm:px-8 py-3.5 bg-indigo-950/60 border-b border-indigo-500/20 flex items-center justify-between">
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white">Monthly Subscription</span> &bull; Renews automatically
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-amber-400">.99</span>
              <span className="text-[11px] text-slate-400"> / month</span>
            </div>
          </div>

          {/* Form / Mock Checkout */}
          <form onSubmit={handleUpgrade} className="p-6 sm:p-8 space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Cardholder Name
              </label>
              <input
                type="text"
                readOnly
                value={userData?.displayName || currentUser?.displayName || 'Maryam Khan'}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Card Information (Sandbox / Demo)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute right-3 top-2.5 text-xs">💳</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Expires
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  CVC / CVV
                </label>
                <input
                  type="password"
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Perks reminder */}
            <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Instant <strong>Golden Pro Crown 👑</strong> badge on your profile</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span>Proposals highlighted in client review queue</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Activating PRO Membership...</span>
              ) : (
                <span>👑 Pay .99 &amp; Activate PRO Now</span>
              )}
            </button>

            <p className="text-[10px] text-center text-slate-400 mt-2">
              🔒 Powered by Secure Escrow Billing &bull; Cancel anytime with 1-click
            </p>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
