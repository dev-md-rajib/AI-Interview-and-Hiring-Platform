import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiCalendar, HiCheckCircle, HiClipboardList, HiChartBar,
  HiClock, HiUserGroup, HiTrendingUp, HiStar, HiPlay,
  HiExternalLink, HiShieldCheck, HiArrowRight, HiVideoCamera
} from 'react-icons/hi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const LEVEL_LABELS = { 1: 'Junior', 2: 'Mid-level', 3: 'Senior' };
const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', color: 'text-cyan-400', bg: 'bg-cyan-900/30 border-cyan-500/30' },
  active: { label: 'In Progress', color: 'text-yellow-400', bg: 'bg-yellow-900/30 border-yellow-500/30' },
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-900/30 border-emerald-500/30' },
};

export default function InterviewerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [isVerified, setIsVerified] = useState(user?.isVerified ?? false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/interviewer/dashboard')
      .then(({ data }) => {
        setStats(data.stats);
        setUpcoming(data.upcoming || []);
        if (data.isVerified !== undefined) {
          setIsVerified(data.isVerified);
        }
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
    <div className="max-w-5xl mx-auto animate-fade-in space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/40 via-dark-card to-dark-card border border-cyan-500/20 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center">
                <HiUserGroup className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name} 👋</h1>
                <p className="text-cyan-600 dark:text-cyan-300 text-sm font-medium">Live Human Interviewer Dashboard</p>
              </div>
            </div>

            <div>
              {isVerified ? (
                <span className="badge bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1 flex items-center gap-1.5 font-bold shadow-sm">
                  <HiShieldCheck className="w-4 h-4 text-emerald-400" /> Verified by Admin
                </span>
              ) : (
                <span className="badge bg-amber-900/40 text-amber-300 border border-amber-500/30 text-xs px-3 py-1 flex items-center gap-1.5 font-bold shadow-sm">
                  ⏳ Pending Admin Verification
                </span>
              )}
            </div>
          </div>

          {!isVerified && (
            <div className="mt-4 p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">⚠️</span>
              <div className="text-xs">
                <p className="text-amber-300 font-bold text-sm">Admin Verification Required</p>
                <p className="text-amber-200/80 mt-1 leading-relaxed">
                  Your interviewer account must be approved and verified by an Administrator before you can be assigned or take live interviews with candidates. Once an Admin verifies your profile, you will automatically start receiving interview assignments during your active availability slots.
                </p>
              </div>
            </div>
          )}

          {!hasProfile && (
            <div className="mt-4 p-3.5 bg-yellow-900/20 border border-yellow-500/30 rounded-xl">
              <p className="text-yellow-300 text-sm font-semibold">⚠️ Your profile is incomplete!</p>
              <p className="text-yellow-400/80 text-xs mt-1">Set your expertise and availability slots so candidates can be matched to you for live interviews.</p>
              <Link to="/interviewer/profile" className="inline-block mt-2.5 text-xs bg-yellow-600 hover:bg-yellow-500 text-white px-3.5 py-1.5 rounded-lg font-medium transition-colors shadow-sm">
                Complete Profile & Availability →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Assigned', value: stats?.total ?? 0, icon: HiClipboardList, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-900/20 border-blue-500/20' },
          { label: 'Upcoming / Active', value: stats?.pending ?? 0, icon: HiClock, color: 'text-cyan-500 dark:text-cyan-400', bg: 'bg-cyan-900/20 border-cyan-500/20' },
          { label: 'Completed', value: stats?.completed ?? 0, icon: HiCheckCircle, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-500/20' },
          { label: 'Avg. Score Given', value: stats?.avgScore ? `${stats.avgScore}%` : '—', icon: HiStar, color: 'text-yellow-500 dark:text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-500/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`card border ${bg} text-center p-4`}>
            <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming interviews */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-dark-border">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HiCalendar className="text-cyan-600 dark:text-cyan-400" /> Upcoming & Active Interviews ({upcoming.length})
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Live sessions scheduled or ready to launch.</p>
          </div>
          <Link to="/interviewer/assignments" className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-white">
            View All Assignments <HiArrowRight />
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-dark-border rounded-xl">
            <HiCalendar className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600 opacity-40" />
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">No upcoming interviews scheduled right now.</p>
            <p className="text-xs text-gray-500 mt-1">When candidates book an interview during your active availability slots, they will appear here.</p>
            {!hasProfile && (
              <Link to="/interviewer/profile" className="btn-primary text-xs px-4 py-2 mt-4 inline-flex items-center gap-1.5">
                Set availability slots →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((interview) => {
              const statusCfg = STATUS_CONFIG[interview.status] || STATUS_CONFIG.scheduled;
              const scheduledDate = interview.scheduledAt ? new Date(interview.scheduledAt) : null;
              const isOngoing = interview.status === 'active';

              return (
                <div
                  key={interview._id}
                  className="p-4 bg-slate-50 dark:bg-dark-800/80 rounded-xl border border-dark-border hover:border-cyan-500/40 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0 overflow-hidden text-white font-bold text-base shadow-sm">
                        {interview.candidate?.profileImage ? (
                          <img src={interview.candidate.profileImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                          interview.candidate?.name?.[0]?.toUpperCase() || 'C'
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-gray-900 dark:text-white font-bold text-base">{interview.candidate?.name || 'Candidate'}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
                            {statusCfg.label}
                          </span>
                          <span className="badge-primary text-[10px]">
                            Level {interview.level} ({LEVEL_LABELS[interview.level] || 'Mid'})
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {interview.sector ? `${interview.sector} • ` : ''}{interview.stack}
                          {interview.candidate?.email && <span className="text-gray-500 ml-2">({interview.candidate.email})</span>}
                        </p>
                      </div>
                    </div>

                    {scheduledDate && (
                      <div className="sm:text-right bg-dark-900/60 p-2.5 rounded-lg border border-dark-border/60">
                        <p className="text-cyan-400 text-xs font-bold flex items-center sm:justify-end gap-1 font-mono">
                          <HiClock className="w-3.5 h-3.5 text-cyan-400" />
                          {scheduledDate.toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-gray-400 text-xs font-mono mt-0.5">
                          {scheduledDate.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true })} BST
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-dark-border/60 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        to={`/interviewer/interview/${interview._id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                      >
                        <HiPlay className="w-3.5 h-3.5" /> Start In-App Meeting
                      </Link>
                    </div>

                    <Link
                      to="/interviewer/assignments"
                      className="text-xs text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1"
                    >
                      Open in Assignments →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick navigation actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/interviewer/assignments" className="card hover:border-cyan-500/30 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 border border-cyan-300 dark:border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/50 transition-colors">
            <HiClipboardList className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-bold group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">My Assignments</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Submit feedback, review history, and manage all assigned live interviews</p>
          </div>
        </Link>
        <Link to="/interviewer/profile" className="card hover:border-primary-500/30 transition-all group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-500/20 flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
            <HiChartBar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-bold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Profile & Availability</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Set weekly time slots, tech stack & business sector expertise</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
