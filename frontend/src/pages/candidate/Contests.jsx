import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HiStar, HiClock, HiLockClosed, HiCheckCircle } from 'react-icons/hi';

const STATUS_LABELS = {
  active: { label: 'Join Now', color: 'badge-success' },
  ended: { label: 'Ended', color: 'badge-gray' },
  published: { label: 'Results Out', color: 'bg-blue-900 text-blue-300' },
};

export default function CandidateContests() {
  const { user } = useAuth();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/contests').then(({ data }) => setContests(data.contests || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Contests</h1>

      {contests.length === 0 ? (
        <div className="card text-center py-16">
          <HiStar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No active contests right now. Check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contests.map(c => {
            const statusInfo = STATUS_LABELS[c.status] || {};
            const isActive = c.status === 'active';
            const isPublished = c.status === 'published';

            return (
              <div key={c._id} className="card hover:border-primary-500/30 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg">{c.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{c.recruiter?.name}</p>
                  </div>
                  <span className={`badge ${statusInfo.color || 'badge-gray'}`}>{statusInfo.label || c.status}</span>
                </div>

                {c.description && <p className="text-gray-400 text-sm mb-3 line-clamp-2">{c.description}</p>}

                <div className="flex gap-2 mb-4 flex-wrap text-sm">
                  {c.mcqRound?.enabled && (
                    <span className="badge-primary flex items-center gap-1">
                      <HiClock className="w-3 h-3" /> MCQ {c.mcqRound?.timeLimitMinutes}min
                    </span>
                  )}
                  <span className="badge-gray flex items-center gap-1">
                    <HiStar className="w-3 h-3" /> {c.codingRound?.questions?.length || 0} problems
                  </span>
                  <span className="badge bg-yellow-900 text-yellow-300">
                    {c.totalCodingMarks || 0} pts
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="bg-dark-800 rounded px-2 py-1.5">
                    <p className="text-gray-500">Start</p>
                    <p className="text-gray-200">{new Date(c.scheduledAt).toLocaleString()}</p>
                  </div>
                  <div className="bg-dark-800 rounded px-2 py-1.5">
                    <p className="text-gray-500">End</p>
                    <p className="text-gray-200">{new Date(c.endsAt).toLocaleString()}</p>
                  </div>
                </div>

                {isActive && (
                  <Link to={`/candidate/contests/${c._id}/attempt`} className="btn-primary w-full text-center block py-2 text-sm font-semibold">
                    Enter Contest →
                  </Link>
                )}
                {isPublished && (
                  <Link to={`/candidate/contests/${c._id}/results`} className="btn-secondary w-full text-center block py-2 text-sm">
                    <HiCheckCircle className="inline mr-1 w-4 h-4" />View Results
                  </Link>
                )}
                {!isActive && !isPublished && (
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-2">
                    <HiLockClosed className="w-4 h-4" /> Results not published yet
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
