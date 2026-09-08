import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  setDoc 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import DisputeModal from './DisputeModal';

export default function RealTimeChatModal({ isOpen, onClose, targetUser, jobContext }) {
  const { currentUser, userData } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const getConversationId = (uid1, uid2) => {
    return [String(uid1), String(uid2)].sort().join('_');
  };

  useEffect(() => {
    if (!isOpen || !currentUser || !targetUser) return;

    const targetUid = targetUser.id || targetUser.uid;
    const convId = getConversationId(currentUser.uid, targetUid);
    setActiveConversationId(convId);

    const convRef = doc(db, 'conversations', convId);
    setDoc(convRef, {
      id: convId,
      participants: [currentUser.uid, targetUid],
      participantDetails: {
        [currentUser.uid]: {
          name: userData?.displayName || currentUser?.displayName || 'User',
          email: currentUser.email || '',
          role: userData?.role || 'user'
        },
        [targetUid]: {
          name: targetUser.name || targetUser.displayName || 'Participant',
          email: targetUser.email || '',
          role: targetUser.role || 'user'
        }
      },
      lastUpdated: new Date().toISOString()
    }, { merge: true });

    const messagesQuery = query(
      collection(db, 'conversations', convId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.senderId !== currentUser.uid && !data.read) {
          updateDoc(doc(db, 'conversations', convId, 'messages', docSnap.id), {
            read: true
          }).catch(() => {});
        }
      });
    }, (error) => {
      console.error('Error subscribing to messages:', error);
    });

    return () => unsubscribe();
  }, [isOpen, currentUser?.uid, targetUser?.id, targetUser?.uid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Attachment exceeds 2MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachment({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type,
        dataUrl: reader.result
      });
      toast.success('Attached ' + file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !attachment) return;

    const targetUid = targetUser.id || targetUser.uid;
    const convId = activeConversationId || getConversationId(currentUser.uid, targetUid);
    const textToSend = inputText.trim();
    const attachToSend = attachment;

    setInputText('');
    setAttachment(null);

    try {
      await addDoc(collection(db, 'conversations', convId, 'messages'), {
        conversationId: convId,
        senderId: currentUser.uid,
        senderName: userData?.displayName || currentUser?.displayName || 'User',
        senderRole: userData?.role || 'user',
        recipientId: targetUid,
        text: textToSend,
        attachment: attachToSend || null,
        read: false,
        createdAt: new Date().toISOString()
      });

      await updateDoc(doc(db, 'conversations', convId), {
        lastMessage: textToSend || (attachToSend ? ('File: ' + attachToSend.name) : ''),
        lastMessageSender: currentUser.uid,
        lastUpdated: new Date().toISOString()
      });

    } catch (err) {
      console.error('Failed to send message:', err);
      toast.error('Failed to send message.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl flex flex-col h-[640px] overflow-hidden"
        >
          {/* Chat Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-black flex items-center justify-center text-lg shadow-md">
                  {(targetUser?.name || targetUser?.displayName || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online"></span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-white">
                    {targetUser?.name || targetUser?.displayName || 'Direct Chat'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    Online
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {jobContext ? `Discussion for: "${jobContext}"` : (targetUser?.email || 'Encrypted Direct Messaging')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 text-xs font-bold transition-colors flex items-center gap-1 border border-rose-400/20"
                title="Report this conversation for violation or abuse"
              >
                <span>🚩</span> Report
              </button>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/80 bg-grid-pattern">
            {messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl mb-3">
                  💬
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Start Direct Collaboration</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Discuss project milestones, clarify requirements, share files, and finalize deliverables in real-time.
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentUser.uid;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 px-1">
                      <span className="text-[10px] font-bold text-slate-400">
                        {isMe ? 'You' : msg.senderName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-xs'
                          : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}

                      {msg.attachment && (
                        <div className={`mt-2 p-2.5 rounded-xl flex items-center gap-2 text-xs border ${
                          isMe ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}>
                          <span className="text-lg">📎</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">{msg.attachment.name}</p>
                            <p className="text-[10px] opacity-75">{msg.attachment.size}</p>
                          </div>
                          {msg.attachment.dataUrl && (
                            <a
                              href={msg.attachment.dataUrl}
                              download={msg.attachment.name}
                              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] shrink-0 transition-colors ${
                                isMe ? 'bg-white text-indigo-700 hover:bg-slate-100' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                              }`}
                            >
                              Download
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {isMe && (
                      <span className="text-[10px] font-semibold text-slate-400 px-1">
                        {msg.read ? '✓✓ Read' : '✓ Sent'}
                      </span>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Preview Chip */}
          {attachment && (
            <div className="px-5 py-2 bg-indigo-50 border-t border-indigo-100 flex items-center justify-between text-xs text-indigo-900 font-bold">
              <span className="flex items-center gap-2 truncate">
                <span>📎 Ready to send:</span> <code className="truncate max-w-xs">{attachment.name}</code> ({attachment.size})
              </span>
              <button
                onClick={() => setAttachment(null)}
                className="text-rose-600 hover:text-rose-800 text-xs font-black ml-2"
              >
                Remove
              </button>
            </div>
          )}

          {/* Message Input Footer */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3 shrink-0">
            <label className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors shrink-0" title="Attach file or document">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message to collaborate..."
              className="flex-1 border border-slate-200 bg-slate-50 rounded-xl py-2.5 px-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !attachment}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-indigo-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100 shrink-0 flex items-center gap-1.5"
            >
              <span>Send</span>
              <span>&rarr;</span>
            </button>
          </form>
        </motion.div>
      </div>

      {/* Report Chat / Violation Dispute Modal */}
      {isReportModalOpen && (
        <DisputeModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          defaultType="message"
          contextData={{
            jobTitle: jobContext || 'Direct Messaging Chat Violation',
            clientId: userData?.role === 'client' ? currentUser?.uid : targetUser?.id || targetUser?.uid,
            clientName: userData?.role === 'client' ? (userData?.displayName || 'Client') : (targetUser?.name || 'Client'),
            freelancerId: userData?.role === 'freelancer' ? currentUser?.uid : targetUser?.id || targetUser?.uid,
            freelancerName: userData?.role === 'freelancer' ? (userData?.displayName || 'Freelancer') : (targetUser?.name || 'Freelancer'),
            amount: 0
          }}
        />
      )}
    </AnimatePresence>
  );
}
