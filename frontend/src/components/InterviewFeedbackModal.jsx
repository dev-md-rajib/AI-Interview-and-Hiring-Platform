import React from 'react';
import {
  HiX, HiStar, HiCheckCircle, HiXCircle, HiChip, HiUser, HiAcademicCap,
  HiThumbUp, HiLightningBolt, HiLightBulb, HiCalendar
} from 'react-icons/hi';

const EVALUATOR_CONFIG = {
  'Human Team': {
    label: 'Human Team Interviewer',
    icon: HiUser,
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-300 dark:border-cyan-500/30',
    badge: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/30',
  },
  'AI Agent': {
    label: 'AI Agent Interviewer',
    icon: HiChip,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-500/30',
    badge: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-500/30',
  },
  'Normal Query': {
    label: 'Standard Evaluation',
    icon: HiAcademicCap,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-500/30',
    badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30',
  },
  'Standard': {
    label: 'Standard Evaluation',
    icon: HiAcademicCap,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-500/30',
    badge: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/30',
  },
};

export default function InterviewFeedbackModal({ interview, onClose }) {
  if (!interview) return null;

  const evaluatorType = interview.evaluator || interview.mode || 'AI Agent';
  const evalCfg = EVALUATOR_CONFIG[evaluatorType] || EVALUATOR_CONFIG['AI Agent'];
  const EvalIcon = evalCfg.icon;

  const score = interview.totalScore != null ? interview.totalScore : interview.interviewerScore;
  const isPassed = interview.passed;
  const feedbackText = interview.feedback || interview.interviewerFeedback || '';
  const strengths = interview.strengths || interview.interviewerStrengths || [];
  const weaknesses = interview.weaknesses || interview.interviewerWeaknesses || [];
  const recommendations = interview.recommendations || '';
  const interviewerName = interview.interviewer?.name || (typeof interview.interviewer === 'string' ? interview.interviewer : null);

  const completedDate = interview.completedAt ? new Date(interview.completedAt) : (interview.createdAt ? new Date(interview.createdAt) : null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-dark-border flex items-start justify-between bg-dark-800/40">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${evalCfg.bg}`}>
              <EvalIcon className={`w-5 h-5 ${evalCfg.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Interview Feedback & Evaluation</h2>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-gray-900 dark:text-white">{interview.stack}</span>
                <span>•</span>
                <span className="badge-primary text-[10px] px-2 py-0.2">Level {interview.level}</span>
                <span>•</span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${evalCfg.badge}`}>
                  {evalCfg.label}
                  {interviewerName ? ` (${interviewerName})` : ''}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Score & Verdict Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card border border-dark-border bg-dark-800/60 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Final Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {score != null ? `${score}` : '—'}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> / 100</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-900/30 border border-primary-500/20 flex items-center justify-center">
                <HiStar className="w-6 h-6 text-primary-500 dark:text-primary-400" />
              </div>
            </div>

            <div className={`card border p-4 flex items-center justify-between ${isPassed ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Result</p>
                <p className={`text-lg font-bold mt-1 ${isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-danger-600 dark:text-red-400'}`}>
                  {isPassed ? 'PASSED' : 'FAILED'}
                </p>
              </div>
              {isPassed ? (
                <HiCheckCircle className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
              ) : (
                <HiXCircle className="w-8 h-8 text-danger-500 dark:text-red-400" />
              )}
            </div>
          </div>

          {/* Feedback Text Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <HiStar className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <span>Overall Evaluator Feedback</span>
            </div>
            <div className="p-4 rounded-xl bg-dark-800/80 border border-dark-border/80 text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line font-normal">
              {feedbackText ? (
                feedbackText
              ) : (
                <span className="text-gray-500 italic">No detailed feedback comments were entered for this session.</span>
              )}
            </div>
          </div>

          {/* Key Strengths */}
          {strengths && strengths.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <HiThumbUp className="w-4 h-4" />
                <span>Demonstrated Strengths</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {strengths.map((str, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-300 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-medium"
                  >
                    <HiCheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    {str}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Areas for Improvement / Weaknesses */}
          {weaknesses && weaknesses.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <HiLightBulb className="w-4 h-4" />
                <span>Areas for Improvement</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {weaknesses.map((w, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-300 font-medium"
                  >
                    <HiLightningBolt className="w-3 h-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    {w}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Recommendations */}
          {recommendations && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400">
                <HiLightBulb className="w-4 h-4" />
                <span>Study & Career Recommendations</span>
              </div>
              <div className="p-3.5 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-300 dark:border-violet-500/20 text-xs text-violet-950 dark:text-violet-200 leading-relaxed font-medium">
                {recommendations}
              </div>
            </div>
          )}

          {/* Date Stamp */}
          {completedDate && (
            <div className="pt-2 flex items-center justify-between text-[11px] text-gray-500 border-t border-dark-border/50">
              <span className="flex items-center gap-1">
                <HiCalendar className="w-3.5 h-3.5" />
                Completed on:
              </span>
              <span className="font-mono text-gray-400">
                {completedDate.toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', month: 'short', day: 'numeric', year: 'numeric' })} at {completedDate.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true })} (BST)
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-dark-border bg-dark-800/40 flex justify-end">
          <button
            onClick={onClose}
            className="btn-secondary text-xs px-5 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
