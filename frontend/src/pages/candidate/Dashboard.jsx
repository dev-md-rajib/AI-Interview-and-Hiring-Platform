import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiAcademicCap, HiBriefcase, HiClipboardList, HiChartBar, HiArrowRight, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">{value ?? '-'}</p>
    </div>
  </div>
);

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, interviewRes] = await Promise.all([
          api.get('/profile/me'),
          api.get('/interviews/my'),
        ]);
        setProfile(profileRes.data.profile);
        setInterviews(interviewRes.data.interviews?.slice(0, 5) || []);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const passedInterviews = interviews.filter((i) => i.passed).length;
  const avgScore = interviews.length > 0
    ? Math.round(interviews.reduce((s, i) => s + (i.totalScore || 0), 0) / interviews.length)
    : 0;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div className="card bg-gradient-to-r from-primary-900/50 to-dark-card border-primary-500/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {user?.name}! 👋</h1>
            <p className="text-gray-400 mt-1">
              Current Level: <span className="text-primary-400 font-semibold">Level {profile?.currentLevel || 0}</span>
              {profile?.currentLevel === 0 && ' — Take your first interview to get started'}
            </p>
          </div>
          <Link to="/candidate/interview" className="btn-primary flex items-center gap-2">
            Start Interview <HiArrowRight />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={HiAcademicCap} label="Current Level" value={`L${profile?.currentLevel || 0}`} color="bg-primary-600" />
        <StatCard icon={HiChartBar} label="Overall Score" value={`${profile?.overallScore || 0}%`} color="bg-accent-500" />
        <StatCard icon={HiClipboardList} label="Interviews" value={interviews.length} color="bg-blue-600" />
        <StatCard icon={HiCheckCircle} label="Passed" value={passedInterviews} color="bg-emerald-600" />
      </div>

      {/* Interview levels */}
      <div>
        <h2 className="section-title">Interview Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((lvl) => {
            const passed = (profile?.currentLevel || 0) >= lvl;
            const current = (profile?.currentLevel || 0) === lvl - 1;
            return (
              <div key={lvl} className={`card border-2 transition-all ${passed ? 'border-accent-500/40' : current ? 'border-primary-500/40 glow-border' : 'border-dark-border'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-lg text-white">Level {lvl}</span>
                  {passed ? (
                    <span className="badge-success">Passed ✓</span>
                  ) : current ? (
                    <span className="badge-primary">Current</span>
                  ) : (
                    <span className="badge-gray">Locked</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  {lvl === 1 ? 'Junior — Foundational concepts' : lvl === 2 ? 'Mid — Architecture & patterns' : 'Senior — Complex systems design'}
                </p>
                {current && (
                  <Link to="/candidate/interview" className="btn-primary w-full text-center block py-2">
                    Take Level {lvl} →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent interviews */}
      {interviews.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0">Recent Interviews</h2>
            <Link to="/candidate/history" className="text-sm text-primary-400 hover:text-primary-300">View all →</Link>
          </div>
          <div className="card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-dark-800 text-gray-400 uppercase text-xs">
                <tr>
                  {['Stack', 'Level', 'Score', 'Result', 'Date'].map((h) => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {interviews.map((iv) => (
                  <tr key={iv._id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{iv.stack}</td>
                    <td className="px-4 py-3 text-gray-400">L{iv.level}</td>
                    <td className="px-4 py-3 font-bold text-primary-400">{iv.totalScore}%</td>
                    <td className="px-4 py-3">
                      {iv.passed
                        ? <span className="badge-success">Pass</span>
                        : <span className="badge-danger">Fail</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {iv.completedAt ? new Date(iv.completedAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: '/candidate/profile', icon: HiAcademicCap, label: 'Complete Profile', desc: 'Add skills, education, portfolio' },
          { to: '/candidate/jobs', icon: HiBriefcase, label: 'Browse Jobs', desc: 'Find your next opportunity' },
          { to: '/candidate/messages', icon: HiClipboardList, label: 'Messages', desc: 'Connect with recruiters' },
        ].map(({ to, icon: Icon, label, desc }) => (
          <Link key={to} to={to} className="card hover:border-primary-500/40 group transition-all cursor-pointer">
            <Icon className="w-8 h-8 text-primary-400 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-white">{label}</h3>
            <p className="text-sm text-gray-400 mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
