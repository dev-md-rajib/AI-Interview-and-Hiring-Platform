import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const STATUS_COLORS = { Applied: 'badge-primary', Shortlisted: 'badge-warning', Rejected: 'badge-danger', Hired: 'badge-success' };

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/applications/my').then(({ data }) => setApps(data.applications || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">My Applications</h1>
      {apps.length === 0 ? (
        <div className="card text-center py-16"><p className="text-gray-400">No applications yet. Browse the job board!</p></div>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => (
            <div key={app._id} className="card hover:border-primary-500/30 transition-all">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-white font-bold">{app.job?.title}</h2>
                  <p className="text-gray-400 text-sm">{app.job?.recruiter?.name || 'Recruiter'} • Level {app.job?.requiredLevel}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {app.job?.requiredStack?.map((s) => <span key={s} className="badge-gray">{s}</span>)}
                  </div>
                </div>
                <div className="text-right">
                  <span className={STATUS_COLORS[app.status] || 'badge-gray'}>{app.status}</span>
                  <p className="text-xs text-gray-500 mt-2">Match: <span className="text-primary-400 font-bold">{app.matchScore}%</span></p>
                  <p className="text-xs text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {app.recruiterNote && (
                <div className="mt-3 pt-3 border-t border-dark-border">
                  <p className="text-xs text-gray-400">Recruiter note: <span className="text-gray-300">{app.recruiterNote}</span></p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
