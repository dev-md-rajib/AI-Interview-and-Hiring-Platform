import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HiPaperAirplane, HiSearch, HiShieldCheck, HiUser } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Messages() {
  const { user } = useAuth();
  const { state } = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchConv, setSearchConv] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    api.get('/messages/conversations').then(({ data }) => {
      const sorted = (data.conversations || []).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      setConversations(sorted);
      if (state?.conversationId) {
        const found = sorted.find((c) => c._id === state.conversationId);
        if (found) setActiveConv(found);
      }
    }).finally(() => setLoading(false));
  }, [state]);

  useEffect(() => {
    if (!activeConv) return;
    api.get(`/messages/${activeConv._id}`).then(({ data }) => setMessages(data.messages || []));
  }, [activeConv]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!newMsg.trim() || !activeConv) return;
    setSending(true);
    try {
      const { data } = await api.post(`/messages/${activeConv._id}`, { content: newMsg });
      setMessages((m) => [...m, data.message]);
      setNewMsg('');
      setConversations((c) => {
        const updated = c.map((conv) => conv._id === activeConv._id ? { ...conv, lastMessage: newMsg, lastMessageAt: new Date().toISOString() } : conv);
        return updated.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      });
    } catch { toast.error('Failed to send message'); }
    finally { setSending(false); }
  };

  const getOtherParticipant = (conv) => conv.participants?.find((p) => p._id !== user?._id);

  const filteredConversations = conversations.filter((conv) => {
    if (!searchConv.trim()) return true;
    const other = getOtherParticipant(conv);
    return other?.name?.toLowerCase().includes(searchConv.toLowerCase().trim()) ||
           other?.email?.toLowerCase().includes(searchConv.toLowerCase().trim());
  });

  return (
    <div className="h-full flex" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Conversation list */}
      <div className="w-80 flex-shrink-0 border-r border-dark-border flex flex-col bg-dark-card">
        <div className="p-3.5 border-b border-dark-border space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900 dark:text-white font-bold text-base">Messages</h2>
            {user?.role === 'ADMIN' && (
              <span className="badge bg-purple-900/60 text-purple-300 border border-purple-500/30 text-[10px] flex items-center gap-1">
                <HiShieldCheck className="w-3 h-3" /> Admin Messenger
              </span>
            )}
          </div>
          <div className="relative">
            <HiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="input pl-8 py-1 text-xs h-8"
              value={searchConv}
              onChange={(e) => setSearchConv(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-dark-border/40">
          {loading ? (
            <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
          ) : filteredConversations.length === 0 ? (
            <p className="text-gray-500 text-xs text-center p-6">No conversations found</p>
          ) : (
            filteredConversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const isOtherAdmin = other?.role === 'ADMIN';

              return (
                <div
                  key={conv._id}
                  onClick={() => {
                    setActiveConv(conv);
                    setConversations(c => c.map(x => x._id === conv._id ? { ...x, unreadCount: 0 } : x));
                  }}
                  className={`flex items-center gap-3 px-3.5 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors ${
                    activeConv?._id === conv._id ? 'bg-primary-50 dark:bg-dark-800 border-l-4 border-primary-600' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden ${
                    isOtherAdmin ? 'bg-amber-600 ring-2 ring-amber-400/80 shadow-md shadow-amber-500/20' : 'bg-primary-700'
                  }`}>
                    {other?.profileImage ? (
                      <img src={other.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      other?.name?.[0]?.toUpperCase() || <HiUser />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className="text-gray-900 dark:text-white text-sm font-semibold truncate">{other?.name}</p>
                        {isOtherAdmin && (
                          <span className="badge bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] px-1.5 py-0 font-bold flex items-center gap-0.5 flex-shrink-0" title="Verified Platform Admin">
                            <HiShieldCheck className="w-3 h-3 text-amber-400" /> Admin
                          </span>
                        )}
                      </div>
                      {conv.unreadCount > 0 && activeConv?._id !== conv._id && (
                        <span className="bg-danger-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${conv.unreadCount > 0 && activeConv?._id !== conv._id ? 'text-primary-700 dark:text-white font-semibold' : 'text-gray-500'}`}>
                      {conv.lastMessage || 'Start conversation'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-dark-900">
          {/* Header */}
          {(() => {
            const other = getOtherParticipant(activeConv);
            const isOtherAdmin = other?.role === 'ADMIN';

            return (
              <div className="px-5 py-3.5 border-b border-dark-border flex items-center justify-between bg-dark-card shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden ${
                    isOtherAdmin ? 'bg-amber-600 ring-2 ring-amber-400/80 shadow-md shadow-amber-500/20' : 'bg-primary-700'
                  }`}>
                    {other?.profileImage ? (
                      <img src={other.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      other?.name?.[0]?.toUpperCase() || <HiUser />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 dark:text-white font-bold text-base">{other?.name}</p>
                      {isOtherAdmin && (
                        <span className="badge bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/40 text-xs px-2 py-0.5 font-bold flex items-center gap-1 shadow-sm">
                          <HiShieldCheck className="w-4 h-4 text-amber-400" /> Platform Admin
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs font-medium">
                      {isOtherAdmin ? 'Official AIH Platform Administrator' : `${other?.role} • ${other?.email}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3.5">
            {messages.map((msg) => {
              const isOwn = msg.sender?._id === user?._id || msg.sender === user?._id;
              const isSenderAdmin = msg.sender?.role === 'ADMIN';

              return (
                <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-lg px-4 py-2.5 rounded-2xl text-sm ${
                    isOwn
                      ? 'bg-primary-600 text-white rounded-br-none shadow-md'
                      : isSenderAdmin
                      ? 'bg-dark-800 text-gray-100 rounded-bl-none border border-amber-500/50 shadow-md shadow-amber-500/10 bg-gradient-to-br from-amber-950/20 via-dark-800 to-dark-800'
                      : 'bg-dark-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-dark-border shadow-sm'
                  }`}>
                    {/* Admin Symbol / Tag on Admin Messages */}
                    {isSenderAdmin && (
                      <div className="flex items-center gap-1 mb-1.5 pb-1 border-b border-amber-500/30 text-[11px] font-bold text-amber-400 tracking-wide">
                        <HiShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Platform Admin {isOwn ? '(You)' : '• Official Communication'}</span>
                      </div>
                    )}
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${isOwn ? 'text-primary-200' : isSenderAdmin ? 'text-amber-400/80' : 'text-gray-500'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-4 py-3.5 border-t border-dark-border flex gap-3 bg-dark-card">
            <input
              className="input flex-1"
              placeholder={user?.role === 'ADMIN' ? 'Type official admin message...' : 'Type a message...'}
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            />
            <button
              onClick={send}
              disabled={sending || !newMsg.trim()}
              className="btn-primary px-5 disabled:opacity-50 flex items-center justify-center"
              title="Send Message"
            >
              <HiPaperAirplane className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-dark-900">
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-border flex items-center justify-center mx-auto mb-4 text-primary-400">
              <HiPaperAirplane className="w-8 h-8" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Your Conversations</h3>
            <p className="text-gray-400 text-sm max-w-sm">
              Select a conversation from the left or contact users directly from profile and report pages.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
