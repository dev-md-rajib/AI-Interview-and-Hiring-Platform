import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HiMail, HiFlag, HiX, HiPhotograph, HiChatAlt2, HiArrowLeft, HiShieldCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import InterviewScreenshotsModal from '../../components/InterviewScreenshotsModal';
import InterviewFeedbackModal from '../../components/InterviewFeedbackModal';
import InterviewHistoryFilter from '../../components/InterviewHistoryFilter';

export default function CandidateView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [selectedInterviewForScreenshots, setSelectedInterviewForScreenshots] = useState(null);
  const [selectedFeedbackInterview, setSelectedFeedbackInterview] = useState(null);

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
    api.get(`/profile/${id}`).then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, [id]);

  const startConversation = async () => {
    try {
      const { data: convData } = await api.post('/messages/conversation', { recipientId: id });
      const targetPath = currentUser?.role === 'ADMIN' ? '/admin/messages' : '/recruiter/messages';
      navigate(targetPath, { state: { conversationId: convData.conversation._id } });
    } catch { toast.error('Failed to open message'); }
  };

  const submitReport = async () => {
    if (!reportReason.trim()) return toast.error('Please enter a reason');
    try {
      await api.post('/reports/candidate', { candidateId: id, reason: reportReason });
      toast.success('Candidate reported successfully');
      setIsReporting(false);
      setReportReason('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to report candidate');
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;
  if (!data) return <div className="text-center py-16 text-gray-400">Profile not found</div>;

  const { profile, interviewHistory = [], levelVerdicts } = data;

  // Filter and sort
  const filteredHistory = interviewHistory
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
        return new Date(b.completedAt || b.createdAt || 0) - new Date(a.completedAt || a.createdAt || 0);
      }
      if (sortBy === 'oldest') {
        return new Date(a.completedAt || a.createdAt || 0) - new Date(b.completedAt || b.createdAt || 0);
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
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 text-gray-400 hover:text-white"
        >
          <HiArrowLeft /> Back
        </button>
        {currentUser?.role === 'ADMIN' && (
          <span className="badge bg-purple-900/60 text-purple-300 border border-purple-500/30 flex items-center gap-1 text-xs">
            <HiShieldCheck className="w-3.5 h-3.5" /> Admin Profile Inspection
          </span>
        )}
      </div>

      <div className="card">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-700 flex items-center justify-center text-2xl font-bold text-white overflow-hidden shadow-md flex-shrink-0">
              {profile?.user?.profileImage ? <img src={profile.user.profileImage} alt="" className="w-full h-full object-cover" /> : profile?.user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.user?.name}</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{profile?.user?.email}</p>
              <div className="flex gap-2 mt-2 flex-wrap items-center">
                <span className="badge-primary">Level {profile?.currentLevel || 0}</span>
                <span className={`badge ${profile?.availability === 'Available' ? 'badge-success' : 'badge-gray'}`}>{profile?.availability || 'Available'}</span>
                <span className="badge bg-amber-100 text-amber-800 border border-amber-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700/50">Score: {profile?.overallScore || 0}%</span>
                {profile?.user?.role && profile?.user?.role !== 'CANDIDATE' && (
                  <span className="badge bg-blue-900/50 text-blue-300 border border-blue-500/30 text-xs">
                    {profile.user.role}
                  </span>
                )}
                {profile?.user?.isBanned && (
                  <span className="badge bg-danger-900/50 text-danger-400 border border-danger-500/30 text-xs">
                    Banned
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {currentUser?.role !== 'ADMIN' && (
              <button onClick={() => setIsReporting(true)} className="btn-secondary text-danger-500 dark:text-danger-400 hover:text-danger-600 dark:hover:text-danger-300 hover:border-danger-500/50 flex items-center gap-2"><HiFlag /> Report</button>
            )}
            <button onClick={startConversation} className="btn-primary flex items-center gap-2"><HiMail /> Message</button>
          </div>
        </div>
        {profile?.bio && <p className="text-gray-700 dark:text-gray-300 mt-4 border-t border-dark-border pt-4 text-sm leading-relaxed">{profile.bio}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="section-title">Professional Info</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
            Experience: <span className="font-semibold text-gray-900 dark:text-white">{profile?.yearsOfExperience != null ? `${profile.yearsOfExperience} years` : '0 years'}</span>
          </p>
          <div>
            <span className="text-gray-600 dark:text-gray-400 text-xs font-semibold block mb-2">Expertise / Tech Stacks</span>
            {profile?.expertise?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {profile.expertise.map((e) => <span key={e} className="badge-primary">{e}</span>)}
              </div>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 text-xs italic">No tech stack expertise listed yet</span>
            )}
          </div>
        </div>
        {profile?.skills?.length > 0 && (
          <div className="card">
            <h2 className="section-title">Top Skills</h2>
            <div className="space-y-2">
              {profile.skills.slice(0, 5).map((s) => (
                <div key={s.name} className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{s.name}</span>
                  <span className="text-primary-600 dark:text-primary-400 font-medium">{s.score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Level Achievements */}
      {levelVerdicts?.length > 0 && (
        <div className="card">
          <h2 className="section-title">Highest Level Verdicts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {levelVerdicts.map((lv) => {
              const isHumanTeam = lv.evaluator === 'Human Team';
              const isAiAgent = lv.evaluator === 'AI Agent';
              return (
                <div
                  key={`lv-${lv.level}`}
                  className={`p-4 rounded-xl border transition-colors relative overflow-hidden flex flex-col justify-between ${
                    isHumanTeam
                      ? 'bg-cyan-50 dark:bg-gradient-to-br dark:from-cyan-900/30 dark:to-dark-800 border-cyan-300 dark:border-cyan-500/40 hover:border-cyan-500'
                      : isAiAgent
                      ? 'bg-violet-50 dark:bg-gradient-to-br dark:from-violet-900/20 dark:to-dark-800 border-violet-300 dark:border-violet-500/30 hover:border-violet-500'
                      : 'bg-dark-card border-dark-border dark:bg-dark-800/50 hover:border-primary-500/50'
                  }`}
                >
                  {isHumanTeam && (
                    <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-600/30 dark:border-cyan-500/50 dark:text-cyan-300">
                      🏆 Top
                    </span>
                  )}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">L{lv.level} Passed</span>
                      <span className={`text-2xl font-black ${isHumanTeam ? 'text-cyan-600 dark:text-cyan-400' : isAiAgent ? 'text-violet-600 dark:text-violet-400' : 'text-primary-600 dark:text-primary-400'}`}>
                        {lv.totalScore}
                        <span className="text-sm font-medium opacity-80">/100</span>
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Stack: <span className="font-semibold text-gray-900 dark:text-white">{lv.stack}</span></div>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold border ${
                      isHumanTeam
                        ? 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-500/30'
                        : isAiAgent
                        ? 'bg-violet-100 text-violet-800 border-violet-300 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-500/30'
                        : 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-dark-700 dark:text-gray-300 dark:border-dark-600'
                    }`}>
                      {isHumanTeam ? '🎥' : isAiAgent ? '🤖' : '📝'} {lv.evaluator}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedInterviewForScreenshots({ ...lv, candidate: id })}
                    className="mt-3 w-full py-1.5 rounded-lg bg-dark-card hover:bg-dark-800 border border-dark-border text-xs text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium flex items-center justify-center gap-1.5 transition-all"
                  >
                    <HiPhotograph className="w-3.5 h-3.5 text-primary-500 dark:text-primary-400" />
                    <span>View Captures</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {interviewHistory?.length > 0 && (
        <div className="card">
          <h2 className="section-title">Interview History & Evaluations</h2>

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
            totalCount={interviewHistory.length}
            filteredCount={filteredHistory.length}
          />

          {filteredHistory.length === 0 ? (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
              No interviews match your filter criteria.
              <div className="mt-2">
                <button onClick={handleResetFilters} className="btn-secondary text-xs">
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-500 dark:text-gray-400 uppercase text-xs border-b border-dark-border">
                  <tr>
                    {['Stack', 'Level', 'Evaluator', 'Score', 'Result', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="text-left pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border">
                  {filteredHistory.map((iv) => (
                    <tr key={iv._id} className="hover:bg-dark-800/20 transition-colors">
                      <td className="py-3 pr-4 text-gray-900 dark:text-white font-medium">{iv.stack}</td>
                      <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">L{iv.level}</td>
                      <td className="py-3 pr-4 text-gray-600 dark:text-gray-400">{iv.evaluator}</td>
                      <td className="py-3 pr-4 font-bold text-primary-600 dark:text-primary-400">{iv.totalScore}%</td>
                      <td className="py-3 pr-4">
                        {iv.passed ? <span className="badge-success">Passed</span> : <span className="badge-danger">Failed</span>}
                      </td>
                      <td className="py-3 pr-4 text-gray-500 dark:text-gray-400 text-xs">
                        {iv.completedAt ? new Date(iv.completedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedFeedbackInterview(iv)}
                            className="px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-800/50 border border-primary-300 dark:border-primary-500/30 text-xs text-primary-700 dark:text-primary-300 flex items-center gap-1.5 font-medium transition-all"
                            title="View Evaluator Feedback"
                          >
                            <HiChatAlt2 className="w-3.5 h-3.5" />
                            <span>Feedback</span>
                          </button>
                          <button
                            onClick={() => setSelectedInterviewForScreenshots({ ...iv, candidate: id })}
                            className="px-2.5 py-1 rounded-lg bg-dark-card hover:bg-dark-800 border border-dark-border text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1.5 transition-all"
                            title="View interval and violation screenshots"
                          >
                            <HiPhotograph className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                            <span>Captures</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {selectedFeedbackInterview && (
        <InterviewFeedbackModal
          interview={selectedFeedbackInterview}
          onClose={() => setSelectedFeedbackInterview(null)}
        />
      )}

      {isReporting && (
        <div className="fixed inset-0 bg-dark-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-dark-800 rounded-2xl border border-dark-border max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><HiFlag className="text-danger-500" /> Report Candidate</h3>
              <button onClick={() => setIsReporting(false)} className="text-gray-400 hover:text-white"><HiX className="w-6 h-6" /></button>
            </div>
            <p className="text-gray-400 text-sm">Please provide a valid reason for reporting this candidate. False flags will be penalized.</p>
            <textarea
              className="input h-32 resize-none"
              placeholder="Why are you reporting this user?"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setIsReporting(false)} className="btn-secondary px-4 py-2">Cancel</button>
              <button onClick={submitReport} className="bg-danger-600 hover:bg-danger-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">Submit Report</button>
            </div>
          </div>
        </div>
      )}

      {/* Proctoring Screenshots Inspection Modal */}
      {selectedInterviewForScreenshots && (
        <InterviewScreenshotsModal
          interview={selectedInterviewForScreenshots}
          onClose={() => setSelectedInterviewForScreenshots(null)}
        />
      )}
    </div>
  );
}
