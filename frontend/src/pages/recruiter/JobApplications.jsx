import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const STATUSES = ['Applied', 'Shortlisted', 'Rejected', 'Hired'];
const STATUS_COLORS = { Applied: 'badge-primary', Shortlisted: 'badge-warning', Rejected: 'badge-danger', Hired: 'badge-success' };

export default function JobApplications() {
  const { id } = useParams();
  const [apps, setApps] = useState([]);
  const [job, setJob] = useState(null);
  const [sortBy, setSortBy] = useState('matchScore');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/jobs/${id}`), api.get(`/jobs/${id}/applications?sortBy=${sortBy}`)]).then(([jobRes, appsRes]) => {
      setJob(jobRes.data.job);
      setApps(appsRes.data.applications || []);
    }).finally(() => setLoading(false));
  }, [id, sortBy]);

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/jobs/applications/${appId}/status`, { status });
      setApps((a) => a.map((app) => app._id === appId ? { ...app, status } : app));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{job?.title}</h1>
        <p className="text-gray-400">{apps.length} Applications</p>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <span className="text-gray-400 text-sm self-center">Sort by:</span>
        {['matchScore', 'createdAt'].map((s) => (
          <button key={s} onClick={() => setSortBy(s)} className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${sortBy === s ? 'bg-primary-600 text-white' : 'bg-dark-card text-gray-400'}`}>
            {s === 'matchScore' ? 'Match Score' : 'Date Applied'}
          </button>
        ))}
      </div>

      {apps.length === 0 ? (
        <div className="card text-center py-16"><p className="text-gray-400">No applications yet</p></div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <div key={app._id} className="card flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center text-white font-bold">
                  {app.candidate?.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <Link to={`/recruiter/candidates/${app.candidate?._id}`} className="text-white font-semibold hover:text-primary-400">{app.candidate?.name}</Link>
                  <p className="text-gray-400 text-sm">{app.candidate?.email}</p>
                  {app.coverLetter && <p className="text-gray-500 text-xs mt-1 line-clamp-1">{app.coverLetter}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-primary-400 font-bold text-lg">{app.matchScore}%</p>
                  <p className="text-gray-500 text-xs">Match</p>
                </div>
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  className="input py-1.5 text-sm w-36"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
