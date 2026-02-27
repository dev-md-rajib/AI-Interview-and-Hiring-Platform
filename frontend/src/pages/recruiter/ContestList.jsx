import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { HiPlus, HiEye, HiPencil, HiTrash, HiUsers } from 'react-icons/hi';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  draft: 'badge bg-gray-700 text-gray-300',
  active: 'badge bg-emerald-900 text-emerald-300',
  ended: 'badge bg-yellow-900 text-yellow-300',
  published: 'badge bg-blue-900 text-blue-300',
};

export default function RecruiterContestList() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/contests').then(({ data }) => setContests(data.contests || [])).finally(() => setLoading(false));
  }, []);

  const deleteContest = async (id) => {
    if (!window.confirm('Delete this draft contest?')) return;
    try {
      await api.delete(`/contests/${id}`);
      setContests(c => c.filter(x => x._id !== id));
      toast.success('Deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">My Contests</h1>
        <Link to="/recruiter/contests/new" className="btn-primary flex items-center gap-2"><HiPlus />New Contest</Link>
      </div>

      {contests.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400 mb-4">No contests yet. Create your first one!</p>
          <Link to="/recruiter/contests/new" className="btn-primary inline-flex items-center gap-2"><HiPlus />Create Contest</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contests.map(c => (
            <div key={c._id} className="card hover:border-primary-500/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-bold text-lg">{c.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-1">{c.description || 'No description'}</p>
                </div>
                <span className={STATUS_STYLES[c.status] || 'badge bg-gray-700 text-gray-300'}>{c.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                <div className="bg-dark-800 rounded-lg px-3 py-2">
                  <p className="text-gray-500 text-xs">Starts</p>
                  <p className="text-gray-200">{new Date(c.scheduledAt).toLocaleString()}</p>
                </div>
                <div className="bg-dark-800 rounded-lg px-3 py-2">
                  <p className="text-gray-500 text-xs">Ends</p>
                  <p className="text-gray-200">{new Date(c.endsAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4 flex-wrap">
                {c.mcqRound?.enabled && <span className="badge-gray">MCQ</span>}
                <span className="badge-primary">{c.codingRound?.questions?.length || 0} Coding</span>
                <span className="badge bg-yellow-900 text-yellow-300">{c.totalCodingMarks || 0} pts</span>
              </div>

              <div className="flex gap-2">
                <Link to={`/recruiter/contests/${c._id}/results`} className="btn-secondary flex-1 flex items-center justify-center gap-1 text-sm py-1.5">
                  <HiUsers className="w-4 h-4" />Results
                </Link>
                {c.status === 'draft' && (
                  <>
                    <Link to={`/recruiter/contests/${c._id}/edit`} className="btn-secondary flex items-center gap-1 text-sm py-1.5 px-3">
                      <HiPencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => deleteContest(c._id)} className="btn-danger flex items-center gap-1 text-sm py-1.5 px-3">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
