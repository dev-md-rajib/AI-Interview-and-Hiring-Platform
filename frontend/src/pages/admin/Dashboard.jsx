import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { HiChartBar, HiUsers, HiAcademicCap, HiBriefcase, HiClipboardList } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/admin/analytics').then(({ data }) => setData(data)).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  const chartData = (data?.interviewsByLevel || []).map((l) => ({
    name: `Level ${l._id}`,
    Interviews: l.count,
    Passed: l.passed,
    'Avg Score': Math.round(l.avgScore),
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: HiUsers, label: 'Total Users', value: data?.stats?.totalUsers, color: 'bg-primary-600' },
          { icon: HiUsers, label: 'Candidates', value: data?.stats?.totalCandidates, color: 'bg-blue-600' },
          { icon: HiBriefcase, label: 'Recruiters', value: data?.stats?.totalRecruiters, color: 'bg-purple-600' },
          { icon: HiBriefcase, label: 'Jobs', value: data?.stats?.totalJobs, color: 'bg-amber-600' },
          { icon: HiAcademicCap, label: 'Interviews', value: data?.stats?.totalInterviews, color: 'bg-teal-600' },
          { icon: HiChartBar, label: 'Pass Rate', value: `${data?.stats?.passRate}%`, color: 'bg-accent-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card flex flex-col items-center text-center gap-2 p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}><Icon className="w-5 h-5 text-white" /></div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="card">
          <h2 className="section-title">Interviews by Level</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d42" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#9ca3af' }} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d42', color: '#f1f5f9' }} />
              <Bar dataKey="Interviews" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Passed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Avg Score" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card">
        <h2 className="section-title">Recent Activity</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {(data?.recentActivity || []).map((log) => (
            <div key={log._id} className="flex items-center gap-3 py-2 border-b border-dark-border">
              <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 truncate"><span className="text-primary-400">{log.user?.name}</span> — {log.action}</p>
              </div>
              <p className="text-xs text-gray-500 flex-shrink-0">{new Date(log.createdAt).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
