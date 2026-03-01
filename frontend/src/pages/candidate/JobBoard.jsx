import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiLocationMarker, HiBriefcase, HiCurrencyDollar, HiSearch, HiFlag, HiX } from 'react-icons/hi';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [reportJobId, setReportJobId] = useState(null);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('stack', search);
    if (levelFilter) params.set('level', levelFilter);
    api.get(`/jobs?${params}`).then(({ data }) => setJobs(data.jobs || [])).finally(() => setLoading(false));
  }, [search, levelFilter]);

  const apply = async (jobId, e) => {
    e.stopPropagation();
    setApplying((a) => ({ ...a, [jobId]: true }));
    try {
      await api.post(`/jobs/${jobId}/apply`);
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying((a) => ({ ...a, [jobId]: false }));
    }
  };

  const submitReport = async () => {
    if (!reportReason.trim()) return toast.error('Please enter a reason');
    try {
      await api.post('/reports/job', { jobId: reportJobId, reason: reportReason });
      toast.success('Job reported successfully');
      setReportJobId(null);
      setReportReason('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report job');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-white">Job Board</h1>
        <div className="flex gap-3">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9 w-48" placeholder="Search stack..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input w-32" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
            <option value="">All Levels</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
      ) : jobs.length === 0 ? (
        <div className="card text-center py-16"><p className="text-gray-400">No jobs found</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job._id} className="card hover:border-primary-500/40 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-white font-bold text-lg group-hover:text-primary-400 transition-colors pr-8">{job.title}</h2>
                  <p className="text-gray-400 text-sm">{job.recruiter?.name}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setReportJobId(job._id); }}
                  className="text-gray-500 hover:text-danger-400 transition-colors p-1"
                  title="Report Job"
                >
                  <HiFlag className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{job.description}</p>

              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Requirements</span>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, i) => (
                      <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-dark-800 border border-dark-border">
                        <span className="text-white text-sm font-medium">
                          {req.stack}
                          {req.method && req.method !== 'Both' && (
                            <span className="ml-1 text-[10px] text-gray-400 font-normal">
                              ({req.method === 'Standard' ? 'Human' : 'AI'})
                            </span>
                          )}
                        </span>
                        <span className="text-primary-400 text-xs font-bold px-1.5 py-0.5 rounded bg-primary-500/10">L{req.level}</span>
                        <span className="text-gray-400 text-xs">{req.minScore}%+</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><HiLocationMarker />{job.isRemote ? 'Remote' : (job.location || 'On-site')}</span>
                {job.salaryMin && <span className="flex items-center gap-1"><HiCurrencyDollar />{job.salaryMin}–{job.salaryMax}k</span>}
                <span className="flex items-center gap-1"><HiBriefcase />{job.experienceRequired}+ years</span>
              </div>

              <button
                onClick={(e) => apply(job._id, e)}
                disabled={applying[job._id]}
                className="btn-primary w-full py-2 text-sm disabled:opacity-50"
              >
                {applying[job._id] ? 'Applying...' : 'Apply Now'}
              </button>
            </div>
          ))}
        </div>
      )}

      {reportJobId && (
        <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-dark-800 rounded-2xl border border-dark-border max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><HiFlag className="text-danger-500" /> Report Job</h3>
              <button onClick={() => setReportJobId(null)} className="text-gray-400 hover:text-white"><HiX className="w-6 h-6" /></button>
            </div>
            <p className="text-gray-400 text-sm">Please provide a reason for reporting this job. False reports may lead to account suspension.</p>
            <textarea
              className="input h-32 resize-none"
              placeholder="E.g., Scam, discriminatory, explicitly requires money..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setReportJobId(null)} className="btn-secondary px-4 py-2">Cancel</button>
              <button onClick={submitReport} className="bg-danger-600 hover:bg-danger-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">Submit Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
