import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiCalendar, HiClock, HiExternalLink, HiX, HiCheck, HiStar,
  HiChevronDown, HiChevronUp, HiBadgeCheck, HiPlay, HiShieldCheck,
} from 'react-icons/hi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const LEVEL_LABELS = { 1: 'Junior', 2: 'Mid-level', 3: 'Senior' };
const STATUS_CONFIG = {
  scheduled: { label: 'Scheduled', color: 'text-cyan-400', bg: 'bg-cyan-900/20 border-cyan-500/20' },
  active: { label: 'In Progress', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-500/20' },
  completed: { label: 'Completed', color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-500/20' },
  cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-900/20 border-red-500/20' },
  pending: { label: 'Pending', color: 'text-gray-400', bg: 'bg-dark-800/40 border-dark-border' },
};

function FeedbackModal({ interview, onClose, onSubmit }) {
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [strengthInput, setStrengthInput] = useState('');
  const [weaknessInput, setWeaknessInput] = useState('');
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const addTag = (type, value) => {
    if (!value.trim()) return;
    if (type === 'strength') { setStrengths((p) => [...p, value.trim()]); setStrengthInput(''); }
    else { setWeaknesses((p) => [...p, value.trim()]); setWeaknessInput(''); }
  };

  const removeTag = (type, idx) => {
    if (type === 'strength') setStrengths((p) => p.filter((_, i) => i !== idx));
    else setWeaknesses((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    const s = parseInt(score);
    if (isNaN(s) || s < 0 || s > 100) return toast.error('Score must be 0–100');
    if (!feedback.trim()) return toast.error('Please provide feedback text');
    setSubmitting(true);
    try {
      await onSubmit(interview._id, { score: s, feedback, strengths, weaknesses });
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-dark-border">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Submit Interview Feedback</h2>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">{interview.candidate?.name} · {interview.stack} · Level {interview.level}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white"><HiX className="w-5 h-5" /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Score */}
          <div>
            <label className="label">Score (0–100) <span className="text-red-400">*</span></label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="e.g. 75"
                className="input w-28 text-center font-bold text-lg"
              />
              {score !== '' && !isNaN(parseInt(score)) && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${parseInt(score) >= 50 ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
                  {parseInt(score) >= 50 ? <HiCheck /> : <HiX />}
                  {parseInt(score) >= 50 ? 'PASS' : 'FAIL'}
                </div>
              )}
            </div>
            <div className="mt-2 h-2 rounded-full bg-dark-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, Math.max(0, score || 0))}%` }}
              />
            </div>
          </div>

          {/* Feedback */}
          <div>
            <label className="label">Overall Feedback <span className="text-red-400">*</span></label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Describe the candidate's performance, communication style, problem-solving approach..."
              className="input h-28 resize-none text-sm"
            />
          </div>

          {/* Strengths */}
          <div>
            <label className="label">Strengths</label>
            <div className="flex gap-2 mb-2">
              <input
                value={strengthInput}
                onChange={(e) => setStrengthInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag('strength', strengthInput)}
                placeholder="e.g. Strong algorithm skills"
                className="input flex-1 text-sm"
              />
              <button onClick={() => addTag('strength', strengthInput)} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {strengths.map((s, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-1 bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs">
                  {s}
                  <button onClick={() => removeTag('strength', i)}><HiX className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>

          {/* Weaknesses */}
          <div>
            <label className="label">Areas to Improve</label>
            <div className="flex gap-2 mb-2">
              <input
                value={weaknessInput}
                onChange={(e) => setWeaknessInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag('weakness', weaknessInput)}
                placeholder="e.g. Needs to improve system design"
                className="input flex-1 text-sm"
              />
              <button onClick={() => addTag('weakness', weaknessInput)} className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium">Add</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {weaknesses.map((w, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-1 bg-orange-900/30 text-orange-300 border border-orange-500/30 rounded-lg text-xs">
                  {w}
                  <button onClick={() => removeTag('weakness', i)}><HiX className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-dark-border flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 py-2.5">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-accent-700 transition-all disabled:opacity-50">
            {submitting ? 'Submitting...' : '✅ Submit Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InterviewerAssignments() {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [isVerified, setIsVerified] = useState(user?.isVerified ?? false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [declining, setDeclining] = useState(null);

  const fetchInterviews = async () => {
    try {
      const { data } = await api.get('/team-interviews/interviewer/assigned');
      setInterviews(data.interviews || []);
      if (data.isVerified !== undefined) {
        setIsVerified(data.isVerified);
      }
    } catch {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInterviews(); }, []);

  const handleDecline = async (interviewId) => {
    if (!window.confirm('Are you sure you want to decline this interview? It will be reassigned or cancelled.')) return;
    setDeclining(interviewId);
    try {
      const { data } = await api.post(`/team-interviews/${interviewId}/decline`);
      toast.success(data.message);
      fetchInterviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to decline');
    } finally {
      setDeclining(null);
    }
  };

  const handleSubmitFeedback = async (interviewId, payload) => {
    await api.post(`/team-interviews/${interviewId}/submit-result`, payload);
    toast.success('Feedback submitted! 🎉');
    fetchInterviews();
  };

  const handleOpenFeedback = (interview) => {
    const scheduledDate = interview.scheduledAt ? new Date(interview.scheduledAt) : null;
    const now = new Date();

    if (scheduledDate && now < scheduledDate && interview.status !== 'completed' && interview.status !== 'active') {
      const timeStr = scheduledDate.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const dateStr = scheduledDate.toLocaleDateString('en-US', {
        timeZone: 'Asia/Dhaka',
        month: 'short',
        day: 'numeric',
      });
      toast.error(
        `Please wait until the interview time starts! Scheduled for ${dateStr} at ${timeStr} (BST, Bangladesh Time).`,
        { id: `feedback-wait-${interview._id}`, duration: 5000, icon: '⏳' }
      );
      return;
    }

    setFeedbackModal(interview);
  };

  const filtered = interviews.filter((i) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return ['scheduled', 'active'].includes(i.status);
    if (filter === 'completed') return i.status === 'completed';
    if (filter === 'cancelled') return i.status === 'cancelled';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HiCalendar className="text-cyan-600 dark:text-cyan-400" /> My Assignments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Manage all your assigned live interviews.</p>
        </div>

        {isVerified ? (
          <span className="badge bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1 flex items-center gap-1.5 font-bold">
            <HiShieldCheck className="w-4 h-4 text-emerald-400" /> Verified by Admin
          </span>
        ) : (
          <span className="badge bg-amber-900/40 text-amber-300 border border-amber-500/30 text-xs px-3 py-1 flex items-center gap-1.5 font-bold">
            ⏳ Pending Admin Verification
          </span>
        )}
      </div>

      {!isVerified && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div className="text-xs">
            <p className="text-amber-300 font-bold text-sm">Admin Verification Required</p>
            <p className="text-amber-200/80 mt-1 leading-relaxed">
              Your interviewer account is currently pending verification from the platform administration. To ensure high interview standards, only verified interviewers are assigned candidate interviews. Once an Admin verifies your account, you will receive assignment notifications here.
            </p>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {[['all', 'All'], ['upcoming', 'Upcoming'], ['completed', 'Completed'], ['cancelled', 'Cancelled']].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === val
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'bg-dark-800 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-white border border-dark-border'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <HiCalendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No interviews found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((interview) => {
            const statusCfg = STATUS_CONFIG[interview.status] || STATUS_CONFIG.pending;
            const isExpanded = expandedId === interview._id;
            const isUpcoming = ['scheduled', 'active'].includes(interview.status);
            const scheduledDate = interview.scheduledAt ? new Date(interview.scheduledAt) : null;

            return (
              <div key={interview._id} className={`card border ${statusCfg.bg} transition-all`}>
                {/* Header row */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {interview.candidate?.profileImage
                      ? <img src={interview.candidate.profileImage} alt="" className="w-full h-full object-cover" />
                      : <span className="text-white font-bold text-sm">{interview.candidate?.name?.[0]?.toUpperCase()}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-gray-900 dark:text-white font-bold">{interview.candidate?.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                      {interview.feedbackSubmittedAt && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <HiBadgeCheck className="w-3 h-3" /> Feedback Done
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5">
                      {interview.stack} · {LEVEL_LABELS[interview.level] || `Level ${interview.level}`}
                    </p>
                    {scheduledDate && (
                      <p className="text-cyan-700 dark:text-cyan-300 text-xs mt-1 flex items-center gap-1 font-mono font-medium">
                        <HiClock className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        {scheduledDate.toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', month: 'short', day: 'numeric', year: 'numeric' })} at {scheduledDate.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true })} (BST, Bangladesh Time)
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : interview._id)}
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1"
                  >
                    {isExpanded ? <HiChevronUp /> : <HiChevronDown />}
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {isUpcoming && (
                    <Link
                      to={`/interviewer/interview/${interview._id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                    >
                      <HiPlay className="w-3.5 h-3.5" /> Start In-App Meeting
                    </Link>
                  )}
                  {isUpcoming && !interview.feedbackSubmittedAt && (
                    <button
                      onClick={() => handleDecline(interview._id)}
                      disabled={declining === interview._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-xs font-medium border border-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <HiX className="w-3.5 h-3.5" />
                      {declining === interview._id ? 'Declining...' : "I'm Not Available"}
                    </button>
                  )}
                  {!interview.feedbackSubmittedAt && !['cancelled', 'declined'].includes(interview.status) && (
                    <button
                      onClick={() => handleOpenFeedback(interview)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg text-xs font-semibold hover:from-primary-700 hover:to-accent-700 transition-all"
                    >
                      <HiStar className="w-3.5 h-3.5" /> Submit Feedback
                    </button>
                  )}
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-dark-border/50 space-y-3">
                    {interview.zoomPassword && (
                      <div className="text-xs">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Meeting Password: </span>
                        <span className="text-gray-900 dark:text-white font-mono font-bold">{interview.zoomPassword}</span>
                      </div>
                    )}
                    {interview.interviewerScore != null && (
                      <div className="bg-dark-800 rounded-lg p-3 space-y-2">
                        <p className="text-xs font-semibold text-gray-300">Your Submitted Feedback</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${interview.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                            {interview.interviewerScore}/100
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${interview.passed ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                            {interview.passed ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                        {interview.interviewerFeedback && <p className="text-gray-400 text-xs">{interview.interviewerFeedback}</p>}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Interview ID: <span className="font-mono text-gray-400">{interview._id}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Feedback modal */}
      {feedbackModal && (
        <FeedbackModal
          interview={feedbackModal}
          onClose={() => setFeedbackModal(null)}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </div>
  );
}
