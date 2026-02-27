import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiXCircle, HiClock, HiRefresh, HiDownload, HiUser, HiMail } from 'react-icons/hi';

const VERDICT_STYLES = {
  passed: 'bg-emerald-900 text-emerald-300',
  failed_mcq: 'bg-red-900 text-red-300',
  incomplete: 'bg-yellow-900 text-yellow-300',
  not_attempted: 'bg-gray-800 text-gray-400',
};

function fmtTime(secs) {
  if (!secs) return '—';
  const m = Math.floor(secs / 60), s = secs % 60;
  return `${m}m ${s}s`;
}

export default function ContestResults() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [ranked, setRanked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [contactingId, setContactingId] = useState(null);
  const [sortBy, setSortBy] = useState('rank'); // rank | codingScore | codingTimeTaken

  const contactCandidate = async (candidateId) => {
    setContactingId(candidateId);
    try {
      const { data } = await api.post('/messages/conversation', { recipientId: candidateId });
      navigate('/recruiter/messages', { state: { conversationId: data.conversation._id } });
    } catch (e) { toast.error(e.response?.data?.message || 'Failed to open conversation'); }
    finally { setContactingId(null); }
  };

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get(`/contests/${id}`),
      api.get(`/contests/${id}/participants`),
    ]).then(([cRes, pRes]) => {
      setContest(cRes.data.contest);
      setRanked(pRes.data.ranked || []);
    }).catch(e => toast.error(e.response?.data?.message || 'Load failed'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const doAction = async (action, label) => {
    if (!window.confirm(`${label}?`)) return;
    setActionLoading(action);
    try {
      await api.post(`/contests/${id}/${action}`);
      toast.success(`${label} successful`);
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Action failed'); }
    finally { setActionLoading(''); }
  };

  const exportCSV = () => {
    if (!contest || ranked.length === 0) return;
    const headers = ['Rank', 'Name', 'Email', 'Verdict', 'MCQ Score', 'MCQ %', 'Coding Score', 'Coding Time', 'Total', ...
      (contest.codingRound?.questions || []).map((_, i) => `P${i + 1}`)];
    const rows = ranked.map(r => [
      r.rank, r.candidate?.name, r.candidate?.email, r.verdict,
      r.mcqScore, r.mcqPct + '%', r.codingScore, fmtTime(r.codingTimeTaken), r.totalMarks,
      ...(contest.codingRound?.questions || []).map((_, i) => {
        const sp = r.solvedProblems?.find(s => s.questionIndex === i);
        return sp?.solved ? `✓ (${sp.marksGained}pts)` : '✗';
      }),
    ]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${contest.title}_results.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const sortedRanked = [...ranked].sort((a, b) => {
    if (sortBy === 'codingScore') return b.codingScore - a.codingScore || a.codingTimeTaken - b.codingTimeTaken;
    if (sortBy === 'codingTimeTaken') return a.codingTimeTaken - b.codingTimeTaken || b.codingScore - a.codingScore;
    return a.rank - b.rank;
  });

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  const codingQs = contest?.codingRound?.questions || [];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">{contest?.title}</h1>
          <p className="text-gray-400 text-sm mt-1">{ranked.length} participant{ranked.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={load} className="btn-secondary flex items-center gap-1 py-1.5 text-sm"><HiRefresh />Refresh</button>
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-1 py-1.5 text-sm"><HiDownload />Export CSV</button>
          {contest?.status === 'draft' && <button onClick={() => doAction('activate', 'Activate contest')} disabled={!!actionLoading} className="btn-primary text-sm py-1.5">Activate</button>}
          {contest?.status === 'active' && <button onClick={() => doAction('end', 'End contest')} disabled={!!actionLoading} className="btn-danger text-sm py-1.5">{actionLoading === 'end' ? 'Ending...' : 'End Contest'}</button>}
          {contest?.status === 'ended' && <button onClick={() => doAction('publish', 'Publish results for everyone')} disabled={!!actionLoading} className="btn-primary text-sm py-1.5">{actionLoading === 'publish' ? 'Publishing...' : '🚀 Publish Results'}</button>}
          {contest?.status === 'published' && <span className="badge-success text-sm px-3 py-1.5">✅ Results Published</span>}
        </div>
      </div>

      {/* Contest info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Status', val: contest?.status },
          { label: 'MCQ Round', val: contest?.mcqRound?.enabled ? `${contest.mcqRound.timeLimitMinutes}min (${contest.mcqRound.passThreshold}% pass)` : 'Disabled' },
          { label: 'Coding Time', val: `${contest?.codingRound?.timeLimitMinutes}min` },
          { label: 'Total Points', val: `${(contest?.totalMcqMarks || 0) + (contest?.totalCodingMarks || 0)} pts` },
        ].map(({ label, val }) => (
          <div key={label} className="card py-3 px-4">
            <p className="text-gray-500 text-xs uppercase tracking-wide">{label}</p>
            <p className="text-white font-semibold mt-1 capitalize">{val}</p>
          </div>
        ))}
      </div>

      {ranked.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">No participants yet.</div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <div className="flex items-center justify-between px-5 py-3 border-b border-dark-border">
            <h3 className="text-white font-semibold">Leaderboard</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Sort by:</span>
              {['rank', 'codingScore', 'codingTimeTaken'].map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${sortBy === s ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                  {s === 'rank' ? 'Default' : s === 'codingScore' ? 'Points' : 'Time'}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border text-gray-400 text-xs uppercase">
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-3 py-3 text-left">Candidate</th>
                <th className="px-3 py-3 text-center">Verdict</th>
                {contest?.mcqRound?.enabled && <th className="px-3 py-3 text-center">MCQ</th>}
                <th className="px-3 py-3 text-center">Coding Pts</th>
                <th className="px-3 py-3 text-center">Time</th>
                {/* Solved column per problem */}
                {codingQs.map((_, i) => <th key={i} className="px-3 py-3 text-center">P{i + 1}<br /><span className="text-gray-600 font-normal">({_.marks || 1}pt)</span></th>)}
                <th className="px-5 py-3 text-center">Total</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRanked.map((r, idx) => {
                const isFailedMcq = r.verdict === 'failed_mcq';
                return (
                  <tr key={r.candidate?._id} className={`border-b border-dark-border transition-colors hover:bg-dark-800/50 ${isFailedMcq ? 'opacity-60' : ''}`}>
                    <td className="px-5 py-3 text-gray-300 font-bold">{idx + 1}</td>
                    <td className="px-3 py-3">
                      <Link
                        to={`/recruiter/candidates/${r.candidate?._id}`}
                        className="text-white font-medium hover:text-primary-400 transition-colors underline-offset-2 hover:underline flex items-center gap-1 group"
                      >
                        {r.candidate?.name}
                      </Link>
                      <p className="text-gray-500 text-xs mt-0.5">{r.candidate?.email}</p>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`badge ${VERDICT_STYLES[r.verdict] || 'badge-gray'} text-xs`}>{r.verdict?.replace('_', ' ')}</span>
                    </td>
                    {contest?.mcqRound?.enabled && (
                      <td className="px-3 py-3 text-center">
                        <span className={r.mcqVerdict === 'pass' ? 'text-emerald-400' : r.mcqVerdict === 'fail' ? 'text-danger-400' : 'text-gray-500'}>
                          {r.mcqScore || 0}/{contest.totalMcqMarks} ({r.mcqPct || 0}%)
                        </span>
                      </td>
                    )}
                    <td className="px-3 py-3 text-center text-yellow-400 font-bold">{r.codingScore || 0}</td>
                    <td className="px-3 py-3 text-center text-gray-400">
                      <span className="flex items-center justify-center gap-1"><HiClock className="w-3 h-3" />{fmtTime(r.codingTimeTaken)}</span>
                    </td>
                    {codingQs.map((_, qi) => {
                      const sp = r.solvedProblems?.find(s => s.questionIndex === qi);
                      const solved = sp?.solved;
                      return (
                        <td key={qi} className="px-3 py-3 text-center">
                          {solved
                            ? <HiCheckCircle className="w-5 h-5 text-emerald-400 mx-auto" title={`+${sp.marksGained}pts · ${sp.language}`} />
                            : sp?.attempts > 0
                              ? <span className="text-yellow-500 text-xs" title={`${sp.attempts} attempt(s)`}>✗</span>
                              : <HiXCircle className="w-5 h-5 text-gray-600 mx-auto" />}
                          {sp?.attempts > 0 && <p className="text-gray-600 text-xs">{sp.attempts}att</p>}
                        </td>
                      );
                    })}
                    <td className="px-5 py-3 text-center text-white font-bold">{r.totalMarks || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/recruiter/candidates/${r.candidate?._id}`}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-dark-800 text-gray-300 hover:bg-primary-700 hover:text-white border border-dark-border hover:border-primary-500 transition-all"
                          title="View Profile"
                        >
                          <HiUser className="w-3.5 h-3.5" /> Profile
                        </Link>
                        <button
                          onClick={() => contactCandidate(r.candidate?._id)}
                          disabled={contactingId === r.candidate?._id}
                          title="Send Message"
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-dark-800 text-gray-300 hover:bg-emerald-700 hover:text-white border border-dark-border hover:border-emerald-500 transition-all disabled:opacity-50"
                        >
                          <HiMail className="w-3.5 h-3.5" />
                          {contactingId === r.candidate?._id ? '...' : 'Contact'}
                        </button>
                      </div>
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
