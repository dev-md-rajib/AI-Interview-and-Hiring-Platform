import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LiveWebRTCInterviewRoom from '../../components/interview/LiveWebRTCInterviewRoom';

export default function InterviewerInterviewRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [score, setScore] = useState(75);
  const [feedback, setFeedback] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [submittingResult, setSubmittingResult] = useState(false);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const { data } = await api.get(`/team-interviews/${id}`);
        if (data.interview) {
          setInterview(data.interview);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load interview');
        navigate('/interviewer/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [id, navigate]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setSubmittingResult(true);
    try {
      const payload = {
        score: Number(score),
        feedback,
        strengths: strengths.split(',').map((s) => s.trim()).filter(Boolean),
        weaknesses: weaknesses.split(',').map((w) => w.trim()).filter(Boolean),
      };
      await api.post(`/team-interviews/${id}/submit-result`, payload);
      toast.success('Interview result and feedback submitted! 🎉');
      navigate('/interviewer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmittingResult(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-400">Loading Live Interview Room...</span>
        </div>
      </div>
    );
  }

  if (!interview) return null;

  return (
    <>
      <LiveWebRTCInterviewRoom
        interview={interview}
        user={user}
        onLeave={() => setShowFeedbackModal(true)}
      />

      {/* Post-Interview Feedback / Evaluation Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-cyan-500/30 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 text-gray-900 dark:text-white">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submit Interview Result</h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Candidate: <strong className="text-cyan-600 dark:text-cyan-300">{interview.candidate?.name}</strong> · {interview.stack} (Level {interview.level})
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  Evaluation Score (0 - 100): <strong className="text-cyan-600 dark:text-cyan-400 font-mono text-sm">{score}</strong> {score >= 70 ? '🟢 Pass' : '🔴 Needs Practice'}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Overall Feedback</label>
                <textarea
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback for the candidate..."
                  className="w-full p-2.5 bg-gray-50 dark:bg-dark-800 border border-gray-300 dark:border-dark-border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Strengths (comma separated)</label>
                <input
                  type="text"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="e.g. System Design, Clean Code, Problem Solving"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-800 border border-gray-300 dark:border-dark-border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Areas to Improve (comma separated)</label>
                <input
                  type="text"
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  placeholder="e.g. Edge cases, Concurrency handling"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-800 border border-gray-300 dark:border-dark-border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/interviewer')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-transparent rounded-xl transition-colors font-medium"
                >
                  Skip for now
                </button>
                <button
                  type="submit"
                  disabled={submittingResult}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {submittingResult ? 'Submitting...' : 'Submit Result & Finish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
