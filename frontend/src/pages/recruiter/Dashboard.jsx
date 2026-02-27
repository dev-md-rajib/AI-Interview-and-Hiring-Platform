import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiPlus, HiChartBar, HiBriefcase, HiUsers } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({ jobs: 0, applications: 0, shortlisted: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/my').then(({ data }) => {
      setJobs(data.jobs?.slice(0, 5) || []);
      setStats({ jobs: data.count || 0, applications: data.jobs?.reduce((s, j) => s + (j.applicationCount || 0), 0) || 0 });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Recruiter Dashboard</h1>
        <Link to="/recruiter/jobs/new" className="btn-primary flex items-center gap-2"><HiPlus /> Post a Job</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: HiBriefcase, label: 'My Jobs', value: stats.jobs, color: 'bg-primary-600' },
          { icon: HiUsers, label: 'Total Applications', value: stats.applications, color: 'bg-blue-600' },
          { icon: HiChartBar, label: 'Active Jobs', value: jobs.filter((j) => j.status === 'Open').length, color: 'bg-accent-600' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-6 h-6 text-white" /></div>
            <div><p className="text-gray-400 text-sm">{label}</p><p className="text-2xl font-bold text-white">{value}</p></div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="section-title mb-0">Recent Jobs</h2>
          <Link to="/recruiter/jobs" className="text-sm text-primary-400 hover:text-primary-300">View all →</Link>
        </div>
        {jobs.length === 0 ? (
          <div className="card text-center py-12"><p className="text-gray-400">No jobs posted yet</p><Link to="/recruiter/jobs/new" className="btn-primary mt-4 inline-flex items-center gap-2"><HiPlus />Post First Job</Link></div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job._id} className="card hover:border-primary-500/30 transition-all flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-white font-semibold">{job.title}</h3>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {job.requiredStack?.slice(0, 3).map((s) => <span key={s} className="badge-gray">{s}</span>)}
                    <span className="badge-primary">L{job.requiredLevel}</span>
                    <span className={`badge ${job.status === 'Open' ? 'badge-success' : 'badge-danger'}`}>{job.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{job.applicationCount || 0} <span className="text-gray-400 text-sm font-normal">apps</span></p>
                  <Link to={`/recruiter/jobs/${job._id}/applications`} className="text-primary-400 text-sm hover:text-primary-300">View →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
