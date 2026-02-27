import React, { useEffect, useState } from 'react';
import api from '../../services/api';

export default function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/interviews/my').then(({ data }) => setInterviews(data.interviews || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Interview History</h1>
      {interviews.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400 text-lg">No interviews yet</p>
          <p className="text-gray-500 text-sm mt-2">Start your first AI interview to see results here</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-dark-800 text-gray-400 uppercase text-xs">
              <tr>{['Stack', 'Level', 'Score', 'Result', 'Attempt', 'Date'].map((h) => <th key={h} className="text-left px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {interviews.map((iv) => (
                <tr key={iv._id} className="hover:bg-dark-800/50 transition-colors">
                  <td className="px-4 py-4 font-medium text-white">{iv.stack}</td>
                  <td className="px-4 py-4"><span className="badge-primary">Level {iv.level}</span></td>
                  <td className="px-4 py-4 font-bold text-xl text-primary-400">{iv.totalScore ?? '-'}%</td>
                  <td className="px-4 py-4">
                    {iv.status === 'completed'
                      ? iv.passed ? <span className="badge-success">Passed</span> : <span className="badge-danger">Failed</span>
                      : <span className="badge-gray capitalize">{iv.status}</span>}
                  </td>
                  <td className="px-4 py-4 text-gray-400">#{iv.attemptNumber || 1}</td>
                  <td className="px-4 py-4 text-gray-400">{iv.completedAt ? new Date(iv.completedAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
