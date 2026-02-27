import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiPencil, HiTrash, HiEye } from 'react-icons/hi';

export default function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/jobs/my').then(({ data }) => setJobs(data.jobs || [])).finally(() => setLoading(false)); }, []);

  const deleteJob = async (id) => {
    if (!confirm('Delete this job?')) return;
    try { await api.delete(`/jobs/${id}`); setJobs((j) => j.filter((job) => job._id !== id)); toast.success('Job deleted'); }
    catch { toast.error('Failed to delete job'); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">My Jobs ({jobs.length})</h1>
        <Link to="/recruiter/jobs/new" className="btn-primary text-sm">+ Post Job</Link>
      </div>
      {jobs.length === 0 ? (
        <div className="card text-center py-16"><p className="text-gray-400">No jobs yet</p></div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job._id} className="card flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-white font-semibold">{job.title}</h3>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {job.requiredStack?.slice(0, 4).map((s) => <span key={s} className="badge-gray">{s}</span>)}
                  <span className="badge-primary">L{job.requiredLevel}</span>
                  <span className={`badge ${job.status === 'Open' ? 'badge-success' : 'badge-danger'}`}>{job.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">{job.applicationCount || 0} apps</span>
                <Link to={`/recruiter/jobs/${job._id}/applications`} className="btn-secondary text-sm py-1.5 flex items-center gap-1"><HiEye />View Apps</Link>
                <Link to={`/recruiter/jobs/${job._id}/edit`} className="btn-secondary text-sm py-1.5 flex items-center gap-1"><HiPencil />Edit</Link>
                <button onClick={() => deleteJob(job._id)} className="btn-danger text-sm py-1.5 flex items-center gap-1"><HiTrash /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
