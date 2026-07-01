import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiUserGroup, HiArrowLeft, HiCalendar, HiClock, HiExternalLink,
  HiX, HiCheck, HiChip, HiRefresh, HiLockClosed, HiStar,
} from 'react-icons/hi';
import api from '../../services/api';

const STACKS = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
  'Python', 'Java', 'PHP', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Go', 'C#',
];

const LEVEL_LABELS = { 1: 'Junior', 2: 'Mid-level', 3: 'Senior' };

const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', color: 'text-cyan-400', bg: 'border-cyan-500/30 bg-cyan-900/10' },
  pending: { label: 'Pending Match', color: 'text-yellow-400', bg: 'border-yellow-500/30 bg-yellow-900/10' },
  active: { label: 'In Progress', color: 'text-emerald-400', bg: 'border-emerald-500/30 bg-emerald-900/10' },
  completed: { label: 'Completed', color: 'text-gray-400', bg: 'border-gray-500/30 bg-dark-800/30' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'border-red-500/30 bg-red-900/10' },
  no_interviewer: { label: 'No Match Found', color: 'text-orange-400', bg: 'border-orange-500/30 bg-orange-900/10' },
};

function CountdownTimer({ scheduledAt }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = new Date(scheduledAt) - Date.now();
      if (diff <= 0) { setTimeLeft('Starting now!'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [scheduledAt]);

  return (
    <span className="text-cyan-300 font-mono font-bold">{timeLeft}</span>
  );
}

export default function InterviewTeamRoom() {
  const [view, setView] = useState('status'); // 'status' | 'request'
  const [interviews, setInterviews] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);

  // Request form state
  const [stack, setStack] = useState('');
  const [level, setLevel] = useState(1);
  const [preferredDateTime, setPreferredDateTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [intRes, eligRes] = await Promise.all([
        api.get('/team-interviews/my'),
        api.get(`/team-interviews/eligibility?level=${level}`),
      ]);
      setInterviews(intRes.data.interviews || []);
      setEligibility(eligRes.data);
    } catch {
      toast.error('Failed to load interview data');
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const activeInterview = interviews.find((i) => ['pending', 'scheduled', 'active'].includes(i.status));
  const pastInterviews = interviews.filter((i) => !['pending', 'scheduled', 'active'].includes(i.status));

  const handleRequest = async () => {
    if (!stack) return toast.error('Please select a tech stack');
    if (!preferredDateTime) return toast.error('Please select a preferred date/time');

    const selected = new Date(preferredDateTime);
    if (selected < new Date()) return toast.error('Please select a future date/time');

    setSubmitting(true);
    try {
      const { data } = await api.post('/team-interviews/request', {
        stack,
        level,
        preferredDateTime: selected.toISOString(),
      });

      if (data.noInterviewer) {
        toast('No interviewer available at that time. Please try a different slot.', { icon: '⚠️' });
      } else {
        toast.success('Interview scheduled! Check your notification for details. 🎉');
      }

      await fetchData();
      setView('status');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this interview? This action cannot be undone.')) return;
    try {
      const { data } = await api.post(`/team-interviews/${id}/cancel`);
      toast.success(data.message || 'Interview cancelled.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  // Min datetime for picker — at least 30 min from now
  const minDateTime = new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in space-y-6">
      <Link to="/candidate/interview" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
        <HiArrowLeft /> Back to Interview Options
      </Link>

      {/* Page header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/30 via-dark-card to-dark-card border border-cyan-500/20 p-6">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-600/5 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-900/40 border border-cyan-500/30 flex items-center justify-center">
            <HiUserGroup className="w-7 h-7 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Interview Team</h1>
            <p className="text-gray-400 text-sm mt-1">
              A real human interviewer will conduct a live Zoom session with you.
            </p>
          </div>
        </div>
      </div>

      {/* Cooldown notice */}
      {eligibility && !eligibility.eligible && eligibility.cooldownUntil && (
        <div className="card border-2 border-red-500/30 bg-red-900/10 flex items-start gap-3">
          <HiLockClosed className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-300 font-semibold text-sm">Interview Request Locked</p>
            <p className="text-gray-400 text-xs mt-1">{eligibility.reason}</p>
            <p className="text-gray-500 text-xs mt-1">
              Cooldown expires: <span className="text-red-300 font-medium">{new Date(eligibility.cooldownUntil).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      )}

      {/* Tab nav */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('status')}
          className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'status' ? 'bg-cyan-600 text-white' : 'bg-dark-800 text-gray-400 border border-dark-border hover:text-white'}`}
        >
          My Interviews
        </button>
        {eligibility?.eligible && (
          <button
            onClick={() => setView('request')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${view === 'request' ? 'bg-cyan-600 text-white' : 'bg-dark-800 text-gray-400 border border-dark-border hover:text-white'}`}
          >
            + Request Interview
          </button>
        )}
      </div>

      {/* ── Request Form ── */}
      {view === 'request' && eligibility?.eligible && (
        <div className="card space-y-5">
          <h2 className="section-title">Schedule a Team Interview</h2>

          {/* Tech stack */}
          <div>
            <label className="label">Tech Stack</label>
            <div className="flex flex-wrap gap-2">
              {STACKS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStack(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    stack === s
                      ? 'border-cyan-500 bg-cyan-900/30 text-cyan-300'
                      : 'border-dark-border text-gray-400 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="label">Interview Level</label>
            {eligibility?.levelLocked && (
              <p className="text-xs text-red-400 mb-2">🔒 {eligibility.reason}</p>
            )}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`py-3 rounded-xl border-2 text-center transition-all ${
                    level === lvl ? 'border-cyan-500 bg-cyan-900/20 text-white' : 'border-dark-border text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <p className="font-bold text-sm">Level {lvl}</p>
                  <p className="text-xs text-gray-400">{LEVEL_LABELS[lvl]}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Date/time picker */}
          <div>
            <label className="label">Preferred Date & Time</label>
            <p className="text-xs text-gray-500 mb-2">We'll match you with an interviewer available at this time (UTC). Select at least 30 minutes in the future.</p>
            <input
              type="datetime-local"
              min={minDateTime}
              value={preferredDateTime}
              onChange={(e) => setPreferredDateTime(e.target.value)}
              className="input"
            />
          </div>

          {/* Info box */}
          <div className="p-3 bg-dark-800 rounded-lg border border-dark-border text-xs text-gray-400 space-y-1">
            <p>📹 <strong className="text-gray-300">Zoom meeting</strong> will be auto-created and sent to both parties.</p>
            <p>⏰ <strong className="text-gray-300">2-minute reminder</strong> notification will be sent before the meeting starts.</p>
            <p>🔒 <strong className="text-gray-300">Levels are sequential</strong> — must pass Level 1 before Level 2, etc.</p>
            <p>🏆 <strong className="text-gray-300">Passed Zoom interviews</strong> show as top priority on your public profile.</p>
          </div>

          <button
            onClick={handleRequest}
            disabled={submitting || !stack || !preferredDateTime || (eligibility?.levelLocked)}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-primary-600 hover:from-cyan-700 hover:to-primary-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scheduling...
              </>
            ) : (
              <>🎥 Schedule Zoom Interview</>
            )}
          </button>
        </div>
      )}

      {/* ── Status View ── */}
      {view === 'status' && (
        <>
          {/* Active interview */}
          {activeInterview ? (
            <ActiveInterviewCard interview={activeInterview} onCancel={handleCancel} onRefresh={fetchData} />
          ) : (
            <div className="card text-center py-8">
              <HiCalendar className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No active team interview.</p>
              {eligibility?.eligible && (
                <button
                  onClick={() => setView('request')}
                  className="mt-3 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                >
                  Request one now →
                </button>
              )}
            </div>
          )}

          {/* Past interviews */}
          {pastInterviews.length > 0 && (
            <div>
              <h2 className="section-title mb-3">Interview History</h2>
              <div className="space-y-3">
                {pastInterviews.map((interview) => (
                  <PastInterviewCard key={interview._id} interview={interview} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Active Interview Card ──
function ActiveInterviewCard({ interview, onCancel, onRefresh }) {
  const statusCfg = STATUS_CONFIG[interview.status] || STATUS_CONFIG.pending;
  const scheduledDate = interview.scheduledAt ? new Date(interview.scheduledAt) : null;
  const canCancel = ['pending', 'scheduled'].includes(interview.status);

  return (
    <div className={`card border-2 ${statusCfg.bg} space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
            ● {statusCfg.label}
          </span>
          <h2 className="text-white font-semibold">Your Upcoming Interview</h2>
        </div>
        <button onClick={onRefresh} className="text-gray-400 hover:text-white p-1 rounded transition-colors" title="Refresh">
          <HiRefresh className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400 text-xs mb-1">Tech Stack</p>
          <p className="text-white font-semibold">{interview.stack}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Level</p>
          <p className="text-white font-semibold">{LEVEL_LABELS[interview.level] || `Level ${interview.level}`}</p>
        </div>
        {scheduledDate && (
          <>
            <div>
              <p className="text-gray-400 text-xs mb-1">Date</p>
              <p className="text-white font-semibold">{scheduledDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Time (local)</p>
              <p className="text-white font-semibold">{scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </>
        )}
        {interview.interviewer && (
          <div className="col-span-2">
            <p className="text-gray-400 text-xs mb-1">Your Interviewer</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                {interview.interviewer.profileImage
                  ? <img src={interview.interviewer.profileImage} alt="" className="w-full h-full object-cover" />
                  : interview.interviewer.name?.[0]?.toUpperCase()}
              </div>
              <p className="text-white font-semibold text-sm">{interview.interviewer.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Countdown */}
      {scheduledDate && scheduledDate > new Date() && (
        <div className="p-3 bg-dark-800 rounded-lg border border-dark-border flex items-center gap-3">
          <HiClock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-400">Starts in</p>
            <CountdownTimer scheduledAt={scheduledDate} />
          </div>
        </div>
      )}

      {/* Zoom join link */}
      {interview.zoomJoinUrl && (
        <a
          href={interview.zoomJoinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
        >
          <HiExternalLink className="w-5 h-5" />
          Join Zoom Meeting
        </a>
      )}

      {interview.zoomPassword && (
        <p className="text-xs text-gray-500 text-center">
          Meeting Password: <span className="text-gray-300 font-mono">{interview.zoomPassword}</span>
        </p>
      )}

      {/* Cancel */}
      {canCancel && (
        <button
          onClick={() => onCancel(interview._id)}
          className="w-full py-2 bg-dark-800 border border-red-500/20 hover:bg-red-900/20 text-red-400 hover:text-red-300 rounded-xl text-sm font-medium transition-all"
        >
          <HiX className="inline w-4 h-4 mr-1" />
          Cancel Interview
        </button>
      )}
    </div>
  );
}

// ── Past Interview Card ──
function PastInterviewCard({ interview }) {
  const statusCfg = STATUS_CONFIG[interview.status] || STATUS_CONFIG.pending;
  const scheduledDate = interview.scheduledAt ? new Date(interview.scheduledAt) : null;
  const hasResult = interview.resultReleasedAt != null;

  return (
    <div className="card hover:border-dark-border transition-all">
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${hasResult && interview.passed ? 'bg-emerald-400' : hasResult && !interview.passed ? 'bg-red-400' : 'bg-gray-500'}`} />
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-white text-sm font-semibold">
                {interview.stack} · {LEVEL_LABELS[interview.level] || `Level ${interview.level}`}
              </p>
              {scheduledDate && (
                <p className="text-gray-500 text-xs mt-0.5">{scheduledDate.toLocaleDateString()}</p>
              )}
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
          </div>

          {/* Result */}
          {hasResult && (
            <div className="mt-3 p-3 bg-dark-800 rounded-lg border border-dark-border">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-300">Interview Result</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${interview.passed ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
                  {interview.passed ? '✅ PASSED' : '❌ FAILED'}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-2xl font-bold ${interview.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                  {interview.interviewerScore}/100
                </span>
                <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${interview.passed ? 'bg-emerald-500' : 'bg-red-500'}`}
                    style={{ width: `${interview.interviewerScore}%` }}
                  />
                </div>
              </div>
              {interview.interviewerFeedback && (
                <p className="text-gray-400 text-xs leading-relaxed">{interview.interviewerFeedback}</p>
              )}
              {interview.interviewerStrengths?.length > 0 && (
                <div className="mt-2">
                  <p className="text-[10px] text-emerald-400 font-semibold mb-1">Strengths</p>
                  <div className="flex flex-wrap gap-1">
                    {interview.interviewerStrengths.map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-emerald-900/20 border border-emerald-500/20 text-emerald-300 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {interview.interviewerWeaknesses?.length > 0 && (
                <div className="mt-2">
                  <p className="text-[10px] text-orange-400 font-semibold mb-1">Areas to Improve</p>
                  <div className="flex flex-wrap gap-1">
                    {interview.interviewerWeaknesses.map((w, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-orange-900/20 border border-orange-500/20 text-orange-300 rounded-full">{w}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!hasResult && interview.status === 'completed' && (
            <p className="text-xs text-gray-500 mt-2 italic">Awaiting feedback from interviewer...</p>
          )}
        </div>
      </div>
    </div>
  );
}
