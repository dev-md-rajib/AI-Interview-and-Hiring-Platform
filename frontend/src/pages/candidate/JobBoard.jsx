import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiLocationMarker, HiBriefcase, HiCurrencyDollar, HiAcademicCap, HiSearch } from 'react-icons/hi';

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

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
                  <h2 className="text-white font-bold text-lg group-hover:text-primary-400 transition-colors">{job.title}</h2>
                  <p className="text-gray-400 text-sm">{job.recruiter?.name}</p>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{job.description}</p>

              {job.requirements && job.requirements.length > 0 && (
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Requirements</span>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, i) => (
                      <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-dark-800 border border-dark-border">
                        <span className="text-white text-sm font-medium">{req.stack}</span>
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
    </div>
  );
}
