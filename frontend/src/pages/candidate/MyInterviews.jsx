import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { HiVideoCamera, HiChip, HiAcademicCap } from 'react-icons/hi';

const MODE_ICONS = {
  'Human Team': { icon: HiVideoCamera, color: 'text-cyan-400', bg: 'bg-cyan-900/20 border-cyan-500/30', label: 'Zoom Live' },
  'AI Agent':   { icon: HiChip,        color: 'text-violet-400', bg: 'bg-violet-900/20 border-violet-500/30', label: 'AI Agent' },
  'Normal Query':{ icon: HiAcademicCap, color: 'text-primary-400', bg: 'bg-primary-900/20 border-primary-500/30', label: 'Standard' },
};

export default function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [zoomInterviews, setZoomInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/interviews/my'),
      api.get('/team-interviews/my'),
    ]).then(([stdRes, zoomRes]) => {
      setInterviews(stdRes.data.interviews || []);
      setZoomInterviews(
        (zoomRes.data.interviews || [])
          .filter(i => i.status === 'completed' && i.resultReleasedAt)
          .map(i => ({
            _id: i._id,
            stack: i.stack,
            level: i.level,
            totalScore: i.interviewerScore,
            passed: i.passed,
            status: i.status,
            completedAt: i.completedAt,
            evaluator: 'Human Team',
            mode: 'Human Team',
          }))
      );
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center h-64 items-center">
      <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  const combined = [
    ...interviews.map(i => ({ ...i, mode: i.mode || 'Normal Query' })),
    ...zoomInterviews,
  ].sort((a, b) => new Date(b.completedAt || b.startedAt) - new Date(a.completedAt || a.startedAt));

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Interview History</h1>
      {combined.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400 text-lg">No interviews yet</p>
          <p className="text-gray-500 text-sm mt-2">Start your first interview to see results here</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-dark-800 text-gray-400 uppercase text-xs">
              <tr>
                {['Mode', 'Stack', 'Level', 'Score', 'Result', 'Date'].map((h) => (
                  <th key={h} className="text-left px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {combined.map((iv) => {
                const modeInfo = MODE_ICONS[iv.mode] || MODE_ICONS['Normal Query'];
                const ModeIcon = modeInfo.icon;
                return (
                  <tr key={iv._id} className="hover:bg-dark-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${modeInfo.bg} ${modeInfo.color}`}>
                        <ModeIcon className="w-3.5 h-3.5" />
                        {modeInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-white">{iv.stack}</td>
                    <td className="px-4 py-4"><span className="badge-primary">Level {iv.level}</span></td>
                    <td className="px-4 py-4 font-bold text-xl text-primary-400">
                      {iv.totalScore != null ? `${iv.totalScore}` : '—'}
                      {iv.totalScore != null && <span className="text-sm text-gray-500">/100</span>}
                    </td>
                    <td className="px-4 py-4">
                      {iv.status === 'completed'
                        ? iv.passed
                          ? <span className="badge-success">✅ Passed</span>
                          : <span className="badge-danger">❌ Failed</span>
                        : <span className="badge-gray capitalize">{iv.status}</span>}
                    </td>
                    <td className="px-4 py-4 text-gray-400">
                      {iv.completedAt ? new Date(iv.completedAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
