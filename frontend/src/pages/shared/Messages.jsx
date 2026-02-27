import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HiPaperAirplane, HiSearch } from 'react-icons/hi';
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
  const messagesEndRef = useRef(null);

  useEffect(() => {
    api.get('/messages/conversations').then(({ data }) => {
      setConversations(data.conversations || []);
      if (state?.conversationId) {
        const found = data.conversations?.find((c) => c._id === state.conversationId);
        if (found) setActiveConv(found);
      }
    }).finally(() => setLoading(false));
  }, []);

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
      setConversations((c) => c.map((conv) => conv._id === activeConv._id ? { ...conv, lastMessage: newMsg } : conv));
    } catch { toast.error('Failed to send message'); }
    finally { setSending(false); }
  };

  const getOtherParticipant = (conv) => conv.participants?.find((p) => p._id !== user?._id);

  return (
    <div className="h-full flex" style={{ height: 'calc(100vh - 140px)' }}>
      {/* Conversation list */}
      <div className="w-72 flex-shrink-0 border-r border-dark-border flex flex-col">
        <div className="p-3 border-b border-dark-border">
          <h2 className="text-white font-semibold">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="flex justify-center p-8"><div className="w-6 h-6 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
            : conversations.length === 0 ? <p className="text-gray-500 text-sm text-center p-6">No conversations yet</p>
            : conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              return (
                <div key={conv._id} onClick={() => setActiveConv(conv)} className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-dark-800 transition-colors ${activeConv?._id === conv._id ? 'bg-dark-800 border-l-2 border-primary-500' : ''}`}>
                  <div className="w-9 h-9 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{other?.name?.[0]?.toUpperCase()}</div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{other?.name}</p>
                    <p className="text-gray-500 text-xs truncate">{conv.lastMessage || 'Start conversation'}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Chat area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 border-b border-dark-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold text-sm">{getOtherParticipant(activeConv)?.name?.[0]?.toUpperCase()}</div>
            <div>
              <p className="text-white font-semibold text-sm">{getOtherParticipant(activeConv)?.name}</p>
              <p className="text-gray-500 text-xs">{getOtherParticipant(activeConv)?.role}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => {
              const isOwn = msg.sender?._id === user?._id || msg.sender === user?._id;
              return (
                <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm ${isOwn ? 'bg-primary-600 text-white rounded-br-none' : 'bg-dark-800 text-gray-100 rounded-bl-none border border-dark-border'}`}>
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-primary-200' : 'text-gray-500'}`}>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-3 border-t border-dark-border flex gap-3">
            <input
              className="input flex-1"
              placeholder="Type a message..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            />
            <button onClick={send} disabled={sending || !newMsg.trim()} className="btn-primary px-4 disabled:opacity-50">
              <HiPaperAirplane className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <HiPaperAirplane className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
