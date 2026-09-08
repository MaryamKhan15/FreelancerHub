import { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export default function DisputeModal({ 
  isOpen, 
  onClose, 
  defaultType = 'dispute', // 'dispute' | 'user' | 'project' | 'message'
  contextData = {} // { contractId, jobTitle, clientId, clientName, freelancerId, freelancerName, amount }
}) {
  const { currentUser, userData } = useAuth();
  const [reportType, setReportType] = useState(defaultType);
  const [reason, setReason] = useState(
    defaultType === 'dispute' 
      ? (userData?.role === 'client' ? "Freelancer didn't complete the work to specification." : "Client changed project requirements without budget increase.")
      : "Unprofessional conduct / Platform violation"
  );
  const [detailedDescription, setDetailedDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isClient = userData?.role === 'client';

  const defaultReasons = {
    dispute: isClient ? [
      "Freelancer didn't complete the work.",
      "Freelancer missed the project deadline without notice.",
      "Work quality does not match the agreed contract requirements.",
      "Freelancer is unresponsive after escrow deposit."
    ] : [
      "Client changed requirements outside initial scope.",
      "Client is refusing to release milestone payment after delivery.",
      "Client requested excessive revisions without compensation.",
      "Unresponsive client for work approval."
    ],
    user: [
      "Harassment or unprofessional conduct.",
      "Attempting to move communication/payment outside the platform.",
      "Fake profile or misleading credentials.",
      "Spam or unsolicited promotional messages."
    ],
    project: [
      "Fraudulent or unrealistic project scope.",
      "Suspicious payment or budget mismatch.",
      "Violates marketplace terms of service.",
      "Academic dishonesty or disallowed service."
    ],
    message: [
      "Offensive or abusive language in chat.",
      "Sharing off-platform payment methods or phishing links.",
      "Harassment and spam."
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!detailedDescription.trim()) {
      toast.error('Please provide details explaining your claim.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Submitting dispute to Superadmin Arbitration Center...');

    try {
      const disputeRecord = {
        type: reportType,
        status: 'pending_arbitration', // 'pending_arbitration' | 'resolved_client' | 'resolved_freelancer' | 'resolved_split'
        filedBy: {
          uid: currentUser?.uid,
          name: userData?.displayName || currentUser?.displayName || 'User',
          role: userData?.role || 'user',
          email: currentUser?.email || ''
        },
        contractId: contextData.contractId || null,
        jobTitle: contextData.jobTitle || 'General Platform Case',
        disputedAmount: Number(contextData.amount) || 0,
        // The opposing party
        targetUser: {
          uid: isClient ? contextData.freelancerId : contextData.clientId,
          name: isClient ? (contextData.freelancerName || 'Freelancer') : (contextData.clientName || 'Client'),
          role: isClient ? 'freelancer' : 'client'
        },
        clientClaim: isClient ? reason : (contextData.clientClaim || 'Pending response'),
        freelancerClaim: !isClient ? reason : (contextData.freelancerClaim || 'Pending response'),
        reasonSelected: reason,
        description: detailedDescription,
        resolution: null,
        resolvedAt: null,
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'disputes'), disputeRecord);

      // Create notification for Superadmin and the user
      await addDoc(collection(db, 'notifications'), {
        recipientId: currentUser.uid,
        title: '⚖️ Dispute Ticket Logged',
        message: `Your dispute for "${contextData.jobTitle || 'Platform Inquiry'}" (Case #${docRef.id.slice(0, 6)}) was received by our Arbitration Center.`,
        type: 'deadline',
        read: false,
        time: 'Just now',
        createdAt: new Date().toISOString()
      });

      toast.success('Dispute ticket opened! Superadmin arbitration is reviewing evidence.', { id: toastId });
      onClose();
    } catch (err) {
      console.error('Error opening dispute:', err);
      toast.error('Failed to submit dispute. Try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 p-6 text-white flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-xs font-black text-rose-300 mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
              TRUST & SAFETY RESOLUTION CENTER
            </div>
            <h3 className="text-2xl font-black text-white flex items-center gap-2">
              <span>⚖️</span> File Report or Dispute
            </h3>
            <p className="text-xs text-rose-200/80 mt-1">
              Superadmin arbitrates claims under platform Escrow protection guarantees.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Category Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Report Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'dispute', label: '⚖️ Project Dispute' },
                { id: 'user', label: '👤 Report User' },
                { id: 'project', label: '💼 Report Job' },
                { id: 'message', label: '💬 Report Chat' }
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    setReportType(item.id);
                    const defaultList = defaultReasons[item.id] || [];
                    if (defaultList.length > 0) setReason(defaultList[0]);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    reportType === item.id
                      ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Context Overview Box */}
          {contextData.jobTitle && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Contract Reference:</span>
                <span className="text-indigo-600 truncate max-w-[200px]">{contextData.jobTitle}</span>
              </div>
              {contextData.amount && (
                <div className="flex items-center justify-between text-slate-600">
                  <span>Escrow Amount at Stake:</span>
                  <span className="font-extrabold text-emerald-600">${contextData.amount} USD</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                <span>Parties Involved:</span>
                <span>{isClient ? `Client (You) vs ${contextData.freelancerName || 'Freelancer'}` : `Freelancer (You) vs ${contextData.clientName || 'Client'}`}</span>
              </div>
            </div>
          )}

          {/* Preset Reason Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Primary Cause
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              {(defaultReasons[reportType] || []).map((r, i) => (
                <option key={i} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Detailed Statement / Claims */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Statement of Evidence & Claims
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Be truthful & specific</span>
            </div>
            <textarea
              rows="4"
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              placeholder={
                isClient
                  ? "Describe what deliverables were missing or not according to contract requirements..."
                  : "Detail what requirements the client modified or added outside the signed scope..."
              }
              className="w-full border border-slate-300 rounded-xl p-3 text-xs font-normal text-slate-800 focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none"
              required
            ></textarea>
          </div>

          {/* Escrow Arbitration Guarantee Notice */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
            <span className="text-sm">🛡️</span>
            <span>
              <strong>Platform Guarantee:</strong> All funds remain locked in Escrow. An impartial platform arbitrator reviews both chat logs and submissions before rendering a decision.
            </span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-rose-200 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Confirm & Submit Dispute Ticket'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}