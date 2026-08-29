import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiBell, HiX, HiCheck, HiExternalLink,
  HiCalendar, HiClock, HiRefresh, HiSwitchHorizontal,
  HiBan, HiChartBar, HiCheckCircle, HiSpeakerphone,
} from 'react-icons/hi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const NOTIFICATION_CONFIG = {
  interview_scheduled: {
    icon: HiCalendar,
    bg: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
  },
  interview_2min: {
    icon: HiClock,
    bg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
  },
  interview_declined: {
    icon: HiRefresh,
    bg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
  },
  interview_reassigned: {
    icon: HiSwitchHorizontal,
    bg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
  },
  interview_cancelled: {
    icon: HiBan,
    bg: 'bg-red-500/15 border-red-500/30 text-red-400',
  },
  interview_result: {
    icon: HiChartBar,
    bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  },
  interview_feedback_submitted: {
    icon: HiCheckCircle,
    bg: 'bg-teal-500/15 border-teal-500/30 text-teal-400',
  },
  system: {
    icon: HiSpeakerphone,
    bg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
  },
};

function NotificationTypeIcon({ type }) {
  const config = NOTIFICATION_CONFIG[type] || {
    icon: HiBell,
    bg: 'bg-primary-500/15 border-primary-500/30 text-primary-400',
  };
  const Icon = config.icon;
  return (
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border shadow-sm mt-0.5 ${config.bg}`}>
      <Icon className="w-4 h-4" />
    </div>
  );
}

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const prevUnreadRef = useRef(0);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.notifications || []);
      const newCount = data.unreadCount || 0;

      // Check for new 2-min alert notifications
      if (newCount > prevUnreadRef.current) {
        const fresh = (data.notifications || []).filter(
          (n) => !n.read && n.type === 'interview_2min'
        );
        if (fresh.length > 0 && 'Notification' in window) {
          if (Notification.permission === 'granted') {
            fresh.forEach((n) => {
              new Notification(n.title, {
                body: n.message,
                icon: '/images/logo.png',
              });
            });
          } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((perm) => {
              if (perm === 'granted') {
                fresh.forEach((n) => {
                  new Notification(n.title, {
                    body: n.message,
                    icon: '/images/logo.png',
                  });
                });
              }
            });
          }
        }
      }

      prevUnreadRef.current = newCount;
      setUnreadCount(newCount);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async () => {
    setLoading(true);
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
    setLoading(false);
  };

  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      const wasUnread = notifications.find((n) => n._id === id && !n.read);
      if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) await markRead(notification._id);

    // Navigate to in-app room for candidates and interviewers
    if (notification.type === 'interview_2min' || notification.type === 'interview_scheduled') {
      if (user?.role === 'CANDIDATE') {
        navigate('/candidate/interview/team', { state: { openMeeting: true } });
        setOpen(false);
      } else if (user?.role === 'INTERVIEWER') {
        const interviewId = notification.data?.teamInterviewId;
        if (interviewId) {
          navigate(`/interviewer/interview/${interviewId}`);
        } else {
          navigate('/interviewer/assignments');
        }
        setOpen(false);
      }
    }
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        id="notification-bell"
        onClick={() => { setOpen((v) => !v); if (!open) fetchNotifications(); }}
        className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-800 transition-all"
      >
        <HiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-dark-card border border-dark-border rounded-xl shadow-2xl shadow-black/40 z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-dark-border">
            <div className="flex items-center gap-2">
              <HiBell className="w-4 h-4 text-primary-500 dark:text-primary-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={loading}
                className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 font-medium"
              >
                <HiCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-sm">
                <HiBell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`group flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-dark-border/50 transition-all ${
                    n.read ? 'opacity-60 hover:opacity-80' : 'bg-primary-500/5 hover:bg-gray-100 dark:hover:bg-dark-800'
                  }`}
                >
                  <NotificationTypeIcon type={n.type} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${n.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-500 dark:text-gray-600">{timeAgo(n.createdAt)}</span>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400" />
                      )}
                      {n.data?.zoomJoinUrl && n.type === 'interview_2min' && (
                        <span className="text-[10px] text-cyan-400 flex items-center gap-0.5">
                          <HiExternalLink className="w-3 h-3" /> Join Meeting
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteNotification(n._id, e)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-300 p-0.5 flex-shrink-0 transition-opacity"
                  >
                    <HiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
