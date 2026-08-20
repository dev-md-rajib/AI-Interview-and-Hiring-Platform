import React, { useState, useEffect } from 'react';
import {
  Power,
  Clock,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { User, NextInterviewResponse } from '../../../shared/types';

interface ActiveLockdownProps {
  user: User;
  interview: NextInterviewResponse;
  onEndComplete: () => void;
}

export const ActiveLockdown: React.FC<ActiveLockdownProps> = ({
  user,
  interview,
  onEndComplete
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmittingEnd, setIsSubmittingEnd] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format timer as HH:MM:SS
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenModal = () => {
    setShowConfirmModal(true);
    if (window.electronAPI) {
      window.electronAPI.setWindowHeight(220);
    }
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
    if (window.electronAPI) {
      window.electronAPI.setWindowHeight(56);
    }
  };

  const handleConfirmEnd = async () => {
    setIsSubmittingEnd(true);
    const endedAt = new Date().toISOString();

    try {
      if (window.electronAPI) {
        await window.electronAPI.endInterview({
          candidateId: user.id,
          interviewId: interview.interviewId,
          endedBy: 'candidate',
          endedAt
        });
      }
      setIsSubmittingEnd(false);
      setShowConfirmModal(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to end interview:', err);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Interview Submitted Successfully</h2>
        <p className="text-sm text-zinc-400 max-w-md mt-2">
          Your interview session has been ended and submitted for scoring. You may now safely close the desktop tracker app.
        </p>
        <button
          onClick={onEndComplete}
          className="mt-6 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl text-sm transition-colors"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900 text-white overflow-hidden">
      {/* Slim Top Bar — only visible UI during lockdown */}
      <header className="h-14 bg-zinc-900 px-4 flex items-center justify-between">
        {/* Left: Active Interview Title & Stack */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-red-950/60 border border-red-800/60 text-red-400 rounded-md text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-red" />
            <span>REC PROCTORED</span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-700" />
          <div>
            <h3 className="text-xs font-semibold text-white leading-tight">{interview.jobTitle}</h3>
            <p className="text-[11px] text-zinc-400 truncate max-w-xs">{interview.stack}</p>
          </div>
        </div>

        {/* Center: Elapsed Timer */}
        <div className="flex items-center gap-2 px-3 py-1 bg-zinc-800/80 border border-zinc-700/60 rounded-lg text-xs font-mono text-zinc-200">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>

        {/* Right: End Interview Button */}
        <button
          onClick={handleOpenModal}
          className="px-3.5 py-1.5 bg-red-600/10 border border-red-600/40 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-semibold transition-all duration-150 flex items-center gap-1.5"
        >
          <Power className="w-3.5 h-3.5" />
          <span>End Interview</span>
        </button>
      </header>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">End Interview Now?</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Are you sure you want to end the interview? This will immediately submit your answers, end desktop proctoring, and cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={handleCancelModal}
                disabled={isSubmittingEnd}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEnd}
                disabled={isSubmittingEnd}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-red-600/20 transition-all flex items-center gap-1.5"
              >
                {isSubmittingEnd ? (
                  'Submitting...'
                ) : (
                  <>
                    <Power className="w-3.5 h-3.5" />
                    <span>Yes, End Interview</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
