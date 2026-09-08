import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  getDocs,
  addDoc
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function NotificationBell() {
  const { currentUser, userData } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!currentUser?.uid) return;

    // Listen to real-time notifications for current user
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const notifs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      // If user has 0 notifications (e.g. initial demo setup), seed high-value role-specific notifications
      if (notifs.length === 0) {
        await seedDefaultNotifications(currentUser.uid, userData?.role || 'freelancer');
      } else {
        setNotifications(notifs);
      }
    }, (err) => {
      console.error('Notifications listener error:', err);
    });

    return () => unsubscribe();
  }, [currentUser?.uid, userData?.role]);

  const seedDefaultNotifications = async (uid, role) => {
    try {
      const now = new Date();
      const sampleNotifs = role === 'client' ? [
        {
          recipientId: uid,
          title: 'Proposal Received',
          message: 'Ali Raza submitted a proposal for "React & Tailwind Developer".',
          type: 'proposal',
          read: false,
          time: '5 mins ago',
          createdAt: new Date(now.getTime() - 5 * 60000).toISOString()
        },
        {
          recipientId: uid,
          title: 'New Message',
          message: 'Sarah sent you a message: "I uploaded the initial wireframe drafts."',
          type: 'message',
          read: false,
          time: '25 mins ago',
          createdAt: new Date(now.getTime() - 25 * 60000).toISOString()
        },
        {
          recipientId: uid,
          title: 'Contract Milestone Ready',
          message: 'Flutter Trainer project deliverable submitted for your approval.',
          type: 'milestone',
          read: true,
          time: '2 hours ago',
          createdAt: new Date(now.getTime() - 120 * 60000).toISOString()
        }
      ] : [
        {
          recipientId: uid,
          title: 'Proposal Accepted & Hired!',
          message: 'Maryam Khan accepted your proposal!  has been funded in Escrow.',
          type: 'hire',
          read: false,
          time: '10 mins ago',
          createdAt: new Date(now.getTime() - 10 * 60000).toISOString()
        },
        {
          recipientId: uid,
          title: 'New Client Message',
          message: 'Contract Client: "Hi, can you deliver milestone 1 within 5 days?"',
          type: 'message',
          read: false,
          time: '45 mins ago',
          createdAt: new Date(now.getTime() - 45 * 60000).toISOString()
        },
        {
          recipientId: uid,
          title: 'Escrow Payment Released',
          message: '.00 USD was successfully credited to your platform balance.',
          type: 'payment',
          read: false,
          time: '3 hours ago',
          createdAt: new Date(now.getTime() - 180 * 60000).toISOString()
        },
        {
          recipientId: uid,
          title: 'Upcoming Deadline',
          message: 'Milestone 2 submission is scheduled for tomorrow at 5:00 PM.',
          type: 'deadline',
          read: true,
          time: 'Yesterday',
          createdAt: new Date(now.getTime() - 1440 * 60000).toISOString()
        }
      ];

      for (const item of sampleNotifs) {
        await addDoc(collection(db, 'notifications'), item);
      }
    } catch (e) {
      console.error('Error seeding notifications:', e);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.read);
      for (const item of unread) {
        await updateDoc(doc(db, 'notifications', item.id), { read: true });
      }
      toast.success('Marked all as read');
    } catch (e) {
      console.error(e);
    }
  };

  const markAsRead = async (id) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'proposal': return '📬';
      case 'message': return '💬';
      case 'hire': return '🎉';
      case 'payment': return '💰';
      case 'deadline': return '⏱️';
      case 'milestone': return '⚡';
      default: return '🔔';
    }
  };

  if (!currentUser) return null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm transition-all focus:outline-none flex items-center justify-center cursor-pointer"
        title="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-200 z-50 overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🔔</span>
                <h4 className="text-sm font-bold">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-bold text-indigo-300 hover:text-white underline cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="font-semibold text-slate-600">All caught up!</p>
                  <p className="text-[11px] mt-0.5">No new notifications at this time.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${!n.read ? 'bg-indigo-50/40' : ''}`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-base shrink-0 border border-slate-200 shadow-xs">
                      {getIcon(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs truncate ${!n.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] font-medium text-slate-400 shrink-0">
                          {n.time || (n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                        {n.message}
                      </p>
                    </div>

                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" title="Unread"></span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                Real-time Firebase Cloud Sync
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
