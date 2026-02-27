import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiHome, HiUser, HiBriefcase, HiChatAlt2, HiClipboardList,
  HiChartBar, HiCog, HiLogout, HiMenuAlt3, HiX, HiAcademicCap,
  HiSearch, HiDocumentText, HiQuestionMarkCircle, HiStar,
} from 'react-icons/hi';

const getNavItems = (role, basePath) => {
  if (role === 'CANDIDATE') return [
    { to: `${basePath}`, icon: HiHome, label: 'Dashboard', exact: true },
    { to: `${basePath}/profile`, icon: HiUser, label: 'My Profile' },
    { to: `${basePath}/interview`, icon: HiAcademicCap, label: 'Take Interview' },
    { to: `${basePath}/history`, icon: HiClipboardList, label: 'Interview History' },
    { to: `${basePath}/jobs`, icon: HiBriefcase, label: 'Job Board' },
    { to: `${basePath}/applications`, icon: HiDocumentText, label: 'My Applications' },
    { to: `${basePath}/contests`, icon: HiStar, label: 'Contests' },
    { to: `${basePath}/messages`, icon: HiChatAlt2, label: 'Messages' },
  ];
  if (role === 'RECRUITER') return [
    { to: `${basePath}`, icon: HiHome, label: 'Dashboard', exact: true },
    { to: `${basePath}/jobs`, icon: HiBriefcase, label: 'My Jobs' },
    { to: `${basePath}/jobs/new`, icon: HiDocumentText, label: 'Post a Job' },
    { to: `${basePath}/candidates`, icon: HiSearch, label: 'Find Candidates' },
    { to: `${basePath}/contests`, icon: HiStar, label: 'Contests' },
    { to: `${basePath}/messages`, icon: HiChatAlt2, label: 'Messages' },
  ];
  if (role === 'ADMIN') return [
    { to: `${basePath}`, icon: HiChartBar, label: 'Analytics', exact: true },
    { to: `${basePath}/levels`, icon: HiAcademicCap, label: 'Interview Levels' },
    { to: `${basePath}/questions`, icon: HiQuestionMarkCircle, label: 'Question Bank' },
    { to: `${basePath}/users`, icon: HiUser, label: 'Users' },
    { to: `${basePath}/candidates`, icon: HiSearch, label: 'Candidates' },
  ];
  return [];
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const basePath = user?.role === 'ADMIN' ? '/admin' : user?.role === 'RECRUITER' ? '/recruiter' : '/candidate';
  const navItems = getNavItems(user?.role, basePath);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
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
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <HiAcademicCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg">AI<span className="text-gradient">Hire</span></span>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-dark-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user?.profileImage ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" /> : <span className="text-white font-semibold text-sm">{user?.name?.[0]?.toUpperCase()}</span>}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <span className={`badge text-xs ${user?.role === 'ADMIN' ? 'bg-yellow-900 text-yellow-300' : user?.role === 'RECRUITER' ? 'bg-blue-900 text-blue-300' : 'bg-primary-900 text-primary-300'}`}>
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
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(to, exact) ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-gray-400 hover:bg-dark-800 hover:text-white'}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

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
            <h1 className="text-sm font-semibold text-gray-300 capitalize">
              {location.pathname.split('/').slice(-1)[0]?.replace(/-/g, ' ') || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            <span className="text-xs text-gray-400 hidden sm:inline">Live</span>
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
