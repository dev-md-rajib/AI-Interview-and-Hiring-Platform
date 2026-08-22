import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiCalendar, HiCheckCircle, HiClipboardList, HiChartBar,
  HiClock, HiUserGroup, HiTrendingUp, HiStar,
} from 'react-icons/hi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const LEVEL_LABELS = { 1: 'Junior', 2: 'Mid-level', 3: 'Senior' };

export default function InterviewerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/interviewer/dashboard')
      .then(({ data }) => {
        setStats(data.stats);
        setUpcoming(data.upcoming || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hasProfile = user?.interviewerProfile?.expertise?.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/40 via-dark-card to-dark-card border border-cyan-500/20 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
              <HiUserGroup className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Welcome back, {user?.name} 👋</h1>
              <p className="text-cyan-300 text-sm">Interviewer Dashboard</p>
            </div>
          </div>
          {!hasProfile && (
            <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-sm font-medium">⚠️ Your profile is incomplete!</p>
              <p className="text-yellow-400/70 text-xs mt-1">Set your expertise and availability so candidates can be matched to you.</p>
              <Link to="/interviewer/profile" className="inline-block mt-2 text-xs bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors">
                Complete Profile →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assigned', value: stats?.total ?? 0, icon: HiClipboardList, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-500/20' },
          { label: 'Upcoming', value: stats?.pending ?? 0, icon: HiClock, color: 'text-cyan-400', bg: 'bg-cyan-900/20 border-cyan-500/20' },
          { label: 'Completed', value: stats?.completed ?? 0, icon: HiCheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-500/20' },
          { label: 'Avg. Score Given', value: stats?.avgScore ? `${stats.avgScore}` : '—', icon: HiStar, color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-500/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`card border ${bg} text-center`}>
            <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming interviews */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title flex items-center gap-2">
            <HiCalendar className="text-cyan-400" /> Upcoming Interviews
          </h2>
          <Link to="/interviewer/assignments" className="text-xs text-primary-400 hover:text-primary-300">
            View all →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <HiCalendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No upcoming interviews scheduled.</p>
            {!hasProfile && (
              <Link to="/interviewer/profile" className="text-primary-400 hover:text-primary-300 text-xs mt-2 inline-block">
                Set your availability to get matched →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((interview) => (
              <div
                key={interview._id}
                className="flex items-center gap-4 p-3 bg-dark-800 rounded-xl border border-dark-border hover:border-cyan-500/30 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {interview.candidate?.profileImage
                    ? <img src={interview.candidate.profileImage} alt="" className="w-full h-full object-cover" />
                    : <span className="text-white font-bold text-sm">{interview.candidate?.name?.[0]?.toUpperCase()}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{interview.candidate?.name}</p>
                  <p className="text-gray-400 text-xs">{interview.stack} · {LEVEL_LABELS[interview.level]}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-cyan-300 text-xs font-semibold">
                    {interview.scheduledAt ? new Date(interview.scheduledAt).toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', month: 'short', day: 'numeric' }) : '—'}
                  </p>
                  <p className="text-gray-400 text-[10px] font-mono">
                    {interview.scheduledAt ? new Date(interview.scheduledAt).toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true }) + ' BST' : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/interviewer/assignments" className="card hover:border-cyan-500/30 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-900/30 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-900/50 transition-colors">
            <HiClipboardList className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-white font-semibold">My Assignments</p>
            <p className="text-gray-400 text-xs">View all interviews assigned to you</p>
          </div>
        </Link>
        <Link to="/interviewer/profile" className="card hover:border-primary-500/30 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-900/30 border border-primary-500/20 flex items-center justify-center group-hover:bg-primary-900/50 transition-colors">
            <HiChartBar className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <p className="text-white font-semibold">Profile & Availability</p>
            <p className="text-gray-400 text-xs">Manage expertise and time slots</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
