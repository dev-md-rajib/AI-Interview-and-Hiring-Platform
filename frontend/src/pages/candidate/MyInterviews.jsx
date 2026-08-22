import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { HiVideoCamera, HiChip, HiAcademicCap, HiPhotograph, HiChatAlt2 } from 'react-icons/hi';
import InterviewScreenshotsModal from '../../components/InterviewScreenshotsModal';
import InterviewFeedbackModal from '../../components/InterviewFeedbackModal';
import InterviewHistoryFilter from '../../components/InterviewHistoryFilter';

const MODE_ICONS = {
  'Human Team': { icon: HiVideoCamera, color: 'text-cyan-400', bg: 'bg-cyan-900/20 border-cyan-500/30', label: 'Zoom Live' },
  'AI Agent':   { icon: HiChip,        color: 'text-violet-400', bg: 'bg-violet-900/20 border-violet-500/30', label: 'AI Agent' },
  'Normal Query':{ icon: HiAcademicCap, color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-500/30', label: 'Standard' },
  'Standard':   { icon: HiAcademicCap, color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-500/30', label: 'Standard' },
};

export default function MyInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [zoomInterviews, setZoomInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterviewForScreenshots, setSelectedInterviewForScreenshots] = useState(null);
  const [selectedInterviewForFeedback, setSelectedInterviewForFeedback] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [evaluator, setEvaluator] = useState('all');
  const [level, setLevel] = useState('all');
  const [result, setResult] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const handleResetFilters = () => {
    setSearch('');
    setEvaluator('all');
    setLevel('all');
    setResult('all');
    setSortBy('newest');
  };

  useEffect(() => {
    Promise.all([
      api.get('/interviews/my'),
      api.get('/team-interviews/my'),
    ]).then(([stdRes, zoomRes]) => {
      setInterviews(stdRes.data.interviews || []);
      setZoomInterviews(
        (zoomRes.data.interviews || [])
          .filter(i => i.status === 'completed' && i.resultReleasedAt)
          .map(i => ({
            _id: i._id,
            stack: i.stack,
            level: i.level,
            totalScore: i.interviewerScore,
            passed: i.passed,
            status: i.status,
            completedAt: i.completedAt,
            evaluator: 'Human Team',
            mode: 'Human Team',
            feedback: i.interviewerFeedback || '',
            strengths: i.interviewerStrengths || [],
            weaknesses: i.interviewerWeaknesses || [],
            interviewer: i.interviewer,
          }))
      );
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex justify-center h-64 items-center">
      <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  const combined = [
    ...interviews.map(i => ({ ...i, mode: i.mode || 'Normal Query' })),
    ...zoomInterviews,
  ];

  // Apply filters and sorting
  const filtered = combined
    .filter((item) => {
      if (search && search.trim()) {
        const q = search.trim().toLowerCase();
        const stackMatch = item.stack?.toLowerCase().includes(q);
        const sectorMatch = item.sector?.toLowerCase().includes(q);
        const evalMatch = (item.evaluator || item.mode)?.toLowerCase().includes(q);
        if (!stackMatch && !sectorMatch && !evalMatch) return false;
      }

      if (evaluator !== 'all') {
        const itemEval = item.evaluator || item.mode || '';
        if (evaluator === 'Standard') {
          if (!['Standard', 'Normal Query'].includes(itemEval)) return false;
        } else if (evaluator === 'AI Agent') {
          if (!['AI Agent', 'ai_agent'].includes(itemEval)) return false;
        } else if (evaluator === 'Human Team') {
          if (!['human team', 'zoom live', 'human'].includes(itemEval.toLowerCase())) return false;
        }
      }

      if (level !== 'all') {
        if (String(item.level) !== String(level)) return false;
      }

      if (result === 'passed') {
        if (!item.passed) return false;
      } else if (result === 'failed') {
        if (item.passed) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.completedAt || b.startedAt || 0) - new Date(a.completedAt || a.startedAt || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.completedAt || a.startedAt || 0) - new Date(b.completedAt || b.startedAt || 0);
      }
      if (sortBy === 'highest_score') {
        const scoreA = a.totalScore != null ? a.totalScore : 0;
        const scoreB = b.totalScore != null ? b.totalScore : 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'lowest_score') {
        const scoreA = a.totalScore != null ? a.totalScore : 0;
        const scoreB = b.totalScore != null ? b.totalScore : 0;
        return scoreA - scoreB;
      }
      return 0;
    });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Interview History</h1>
          <p className="text-gray-400 text-xs mt-1">Review all your past evaluations, proctoring records, and feedback.</p>
        </div>
      </div>

      {combined.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400 text-lg">No interviews yet</p>
          <p className="text-gray-500 text-sm mt-2">Start your first interview to see results here</p>
        </div>
      ) : (
        <>
          {/* Filters Bar */}
          <InterviewHistoryFilter
            search={search}
            onSearchChange={setSearch}
            evaluator={evaluator}
            onEvaluatorChange={setEvaluator}
            level={level}
            onLevelChange={setLevel}
            result={result}
            onResultChange={setResult}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onReset={handleResetFilters}
            totalCount={combined.length}
            filteredCount={filtered.length}
          />

          {filtered.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-400 text-sm">No interviews match your filter criteria.</p>
              <button onClick={handleResetFilters} className="btn-secondary text-xs mt-3">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="card p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-dark-800 text-gray-400 uppercase text-xs">
                  <tr>
                    {['Mode', 'Stack', 'Level', 'Score', 'Result', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {filtered.map((iv) => {
                    const modeInfo = MODE_ICONS[iv.mode] || MODE_ICONS['Normal Query'];
                    const ModeIcon = modeInfo.icon;
                    return (
                      <tr key={iv._id} className="hover:bg-dark-800/50 transition-colors">
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full border ${modeInfo.bg} ${modeInfo.color}`}>
                            <ModeIcon className="w-3.5 h-3.5" />
                            {modeInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-medium text-white">{iv.stack}</td>
                        <td className="px-4 py-4"><span className="badge-primary">Level {iv.level}</span></td>
                        <td className="px-4 py-4 font-bold text-xl text-primary-400">
                          {iv.totalScore != null ? `${iv.totalScore}` : '—'}
                          {iv.totalScore != null && <span className="text-sm text-gray-500">/100</span>}
                        </td>
                        <td className="px-4 py-4">
                          {iv.status === 'completed'
                            ? iv.passed
                              ? <span className="badge-success">✅ Passed</span>
                              : <span className="badge-danger">❌ Failed</span>
                            : <span className="badge-gray capitalize">{iv.status}</span>}
                        </td>
                        <td className="px-4 py-4 text-gray-400">
                          {iv.completedAt ? new Date(iv.completedAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedInterviewForFeedback(iv)}
                              className="px-2.5 py-1.5 rounded-lg bg-primary-900/30 hover:bg-primary-800/50 border border-primary-500/30 text-xs text-primary-300 flex items-center gap-1.5 font-medium transition-all"
                              title="View Evaluator Feedback"
                            >
                              <HiChatAlt2 className="w-3.5 h-3.5" />
                              <span>Feedback</span>
                            </button>
                            <button
                              onClick={() => setSelectedInterviewForScreenshots(iv)}
                              className="px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 border border-dark-border text-xs text-gray-300 flex items-center gap-1.5 transition-all"
                              title="View proctoring captures"
                            >
                              <HiPhotograph className="w-3.5 h-3.5 text-gray-400" />
                              <span>Captures</span>
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
        </>
      )}

      {selectedInterviewForFeedback && (
        <InterviewFeedbackModal
          interview={selectedInterviewForFeedback}
          onClose={() => setSelectedInterviewForFeedback(null)}
        />
      )}

      {selectedInterviewForScreenshots && (
        <InterviewScreenshotsModal
          interview={selectedInterviewForScreenshots}
          onClose={() => setSelectedInterviewForScreenshots(null)}
        />
      )}
    </div>
  );
}
