import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../NotificationBell';
import ThemeToggle from '../ThemeToggle';
import { TRACKER_DOWNLOAD_URL } from '../../constants/tracker';
import {
  HiHome, HiUser, HiBriefcase, HiChatAlt2, HiClipboardList,
  HiChartBar, HiCog, HiLogout, HiMenuAlt3, HiX, HiAcademicCap,
  HiSearch, HiDocumentText, HiQuestionMarkCircle, HiStar, HiExclamation, HiCode,
  HiCalendar, HiLightBulb, HiDownload, HiExternalLink, HiDesktopComputer
} from 'react-icons/hi';
import { HiBuildingOffice2 } from 'react-icons/hi2';

const getNavItems = (role, basePath) => {
  if (role === 'CANDIDATE') return [
    { to: `${basePath}`, icon: HiHome, label: 'Dashboard', exact: true },
    { to: `${basePath}/profile`, icon: HiUser, label: 'My Profile' },
    { to: `${basePath}/interview`, icon: HiAcademicCap, label: 'Take Interview' },
    { to: `${basePath}/history`, icon: HiClipboardList, label: 'Interview History' },
    { to: `${basePath}/practice`, icon: HiCode, label: 'Coding Practice' },
    { to: `${basePath}/jobs`, icon: HiBriefcase, label: 'Job Board' },
    { to: `${basePath}/applications`, icon: HiDocumentText, label: 'My Applications' },
    { to: `${basePath}/contests`, icon: HiStar, label: 'Contests' },
    { to: `${basePath}/messages`, icon: HiChatAlt2, label: 'Messages' },
  ];
  if (role === 'RECRUITER') return [
    { to: `${basePath}`, icon: HiHome, label: 'Dashboard', exact: true },
    { to: `${basePath}/profile`, icon: HiBuildingOffice2, label: 'Company Profile' },
    { to: `${basePath}/jobs`, icon: HiBriefcase, label: 'My Jobs' },
    { to: `${basePath}/jobs/new`, icon: HiDocumentText, label: 'Post a Job' },
    { to: `${basePath}/candidates`, icon: HiSearch, label: 'Find Candidates' },
    { to: `${basePath}/contests`, icon: HiStar, label: 'Contests' },
    { to: `${basePath}/messages`, icon: HiChatAlt2, label: 'Messages' },
  ];
  if (role === 'INTERVIEWER') return [
    { to: `${basePath}`, icon: HiHome, label: 'Dashboard', exact: true },
    { to: `${basePath}/assignments`, icon: HiCalendar, label: 'My Assignments' },
    { to: `${basePath}/profile`, icon: HiLightBulb, label: 'My Profile & Availability' },
  ];
  if (role === 'ADMIN') return [
    { to: `${basePath}`, icon: HiChartBar, label: 'Analytics', exact: true },
    { to: `${basePath}/levels`, icon: HiAcademicCap, label: 'Interview Levels' },
    { to: `${basePath}/questions`, icon: HiQuestionMarkCircle, label: 'Question Bank' },
    { to: `${basePath}/users`, icon: HiUser, label: 'Users' },
    { to: `${basePath}/candidates`, icon: HiSearch, label: 'Candidates' },
    { to: `${basePath}/reports`, icon: HiExclamation, label: 'Reports & Appeals' },
    { to: `${basePath}/messages`, icon: HiChatAlt2, label: 'Messages' },
  ];
  return [];
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [seenCount, setSeenCount] = useState(0);
  const [totalMatched, setTotalMatched] = useState(0);
  const [seenMatched, setSeenMatched] = useState(0);

  const basePath = user?.role === 'ADMIN' ? '/admin' : user?.role === 'RECRUITER' ? '/recruiter' : user?.role === 'INTERVIEWER' ? '/interviewer' : '/candidate';
  const navItems = getNavItems(user?.role, basePath);

  useEffect(() => {
    if (!user) return;
    const fetchData = () => {
      api.get('/messages/unread').then(({ data }) => {
        const count = data.count || 0;
        setTotalUnread(count);
        if (count === 0) setSeenCount(0);
      }).catch(() => {});

      if (user.role === 'CANDIDATE') {
        api.get('/jobs/matched-count').then(({ data }) => {
          const count = data.count || 0;
          setTotalMatched(count);
          if (count === 0) setSeenMatched(0);
        }).catch(() => {});
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    
    // Prevent "My Jobs" (/jobs) from being active when "Post a Job" (/jobs/new) is active
    if (to.endsWith('/jobs') && location.pathname.endsWith('/jobs/new')) return false;

    return location.pathname.startsWith(to) && (to !== basePath || location.pathname === to);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-dark-900">
      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-30 w-64 flex flex-col bg-dark-card border-r border-dark-border transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-dark-border">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center p-1.5 flex-shrink-0 shadow-md shadow-primary-500/20">
            <img src="/images/logo.png" alt="AIH Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg tracking-wide">A<span className="text-cyan-500 dark:text-cyan-400">I</span><span className="text-accent-500 dark:text-accent-400">H</span></span>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user?.profileImage ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" /> : <span className="text-white font-semibold text-sm">{user?.name?.[0]?.toUpperCase()}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 dark:text-white text-sm font-semibold truncate">{user?.name}</p>
              <span className={`badge text-xs ${
                user?.role === 'ADMIN' ? 'badge-warning' 
                : user?.role === 'RECRUITER' ? 'badge-primary' 
                : user?.role === 'INTERVIEWER' ? 'badge-success' 
                : 'badge-primary'
              }`}>
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <Link
              key={to}
              to={to}
              onClick={() => {
                setSidebarOpen(false);
                if (label === 'Messages') setSeenCount(totalUnread);
                if (label === 'Job Board') setSeenMatched(totalMatched);
              }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to, exact) ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-gray-400 hover:bg-dark-800'}`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </div>
              {label === 'Messages' && totalUnread > seenCount && (
                <span className="bg-danger-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {totalUnread - seenCount > 99 ? '99+' : totalUnread - seenCount}
                </span>
              )}
              {label === 'Job Board' && totalMatched > seenMatched && (
                <span className="bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {totalMatched - seenMatched > 99 ? '99+' : totalMatched - seenMatched}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Download Tracker Card for Candidate */}
        {user?.role === 'CANDIDATE' && (
          <div className="p-3 mx-3 mb-2 rounded-xl bg-gradient-to-br from-primary-500/10 via-primary-500/5 to-transparent border border-primary-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-500 dark:text-primary-400">
                <HiDesktopComputer className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">Interview Tracker</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-snug mb-2.5">
              Required desktop proctoring app for candidate interviews.
            </p>
            <a
              href={TRACKER_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 px-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold transition-all shadow-md shadow-primary-600/20 flex items-center justify-center gap-1.5"
            >
              <HiDownload className="w-3.5 h-3.5" />
              <span>Download Tracker</span>
              <HiExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        )}

        {/* Logout */}
        <div className="p-3 border-t border-dark-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-danger-600/20 hover:text-danger-400 transition-all duration-200"
          >
            <HiLogout className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-dark-card border-b border-dark-border px-4 py-3 flex items-center gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <HiMenuAlt3 className="w-6 h-6" />
          </button>

          <div className="flex-1">
            <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-300 capitalize">
              {location.pathname.split('/').slice(-1)[0]?.replace(/-/g, ' ') || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <NotificationBell />
            <div className="flex items-center gap-1.5 pl-1 border-l border-dark-border">
              <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-xs text-gray-400 hidden sm:inline font-medium">Live</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
