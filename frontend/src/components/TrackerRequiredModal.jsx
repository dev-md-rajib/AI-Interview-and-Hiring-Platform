import React, { useState } from 'react';
import { HiShieldCheck, HiX, HiRefresh, HiDesktopComputer, HiLockClosed, HiCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function TrackerRequiredModal({ isOpen, onClose, onSuccess }) {
  const [checking, setChecking] = useState(false);

  if (!isOpen) return null;

  const checkTracker = async () => {
    setChecking(true);
    try {
      const { data } = await api.get('/tracker/status');
      if (data.active) {
        toast.success('Interview Tracker detected! Proceeding... 🚀');
        onSuccess?.();
        onClose();
      } else {
        toast.error('Tracker app is not active yet. Please click "Start Lockdown" in the desktop app first.');
      }
    } catch {
      toast.error('Unable to verify tracker status. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-dark-card border border-primary-500/40 rounded-2xl w-full max-w-lg shadow-2xl shadow-primary-500/10 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-dark-border flex items-center justify-between bg-gradient-to-r from-primary-950/40 to-dark-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400">
              <HiShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Interview Tracker Required</h2>
              <p className="text-xs text-gray-400">Proctoring desktop application must be active</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-xl bg-amber-900/20 border border-amber-500/30 text-amber-200 text-xs leading-relaxed flex items-start gap-3">
            <HiLockClosed className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-semibold text-amber-300">Proctoring Rule Enforced</p>
              <p className="mt-0.5 text-gray-300">
                To guarantee fairness and integrity, all candidates must start their proctoring session from the <strong>Interview Tracker Desktop App</strong> before beginning the interview on the website.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick 3-Step Setup:</p>
            
            <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-800 border border-dark-border">
              <span className="w-6 h-6 rounded-full bg-primary-900/50 text-primary-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary-500/30">
                1
              </span>
              <div className="text-xs">
                <p className="text-white font-medium">Open Interview Tracker</p>
                <p className="text-gray-400 mt-0.5">Launch the desktop app and log in with your candidate account.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-800 border border-dark-border">
              <span className="w-6 h-6 rounded-full bg-primary-900/50 text-primary-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary-500/30">
                2
              </span>
              <div className="text-xs">
                <p className="text-white font-medium">Consent & Select Window</p>
                <p className="text-gray-400 mt-0.5">Accept proctoring consent and pick your interview browser window.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-800 border border-dark-border">
              <span className="w-6 h-6 rounded-full bg-emerald-900/50 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                3
              </span>
              <div className="text-xs">
                <p className="text-white font-medium">Click "Start Lockdown"</p>
                <p className="text-gray-400 mt-0.5">Once lockdown is active, return here and click "Check & Continue".</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-dark-border bg-dark-900/50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-secondary text-xs px-4 py-2.5">
            Cancel
          </button>
          <button
            onClick={checkTracker}
            disabled={checking}
            className="btn-primary text-xs px-5 py-2.5 flex items-center gap-2"
          >
            {checking ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Checking Tracker Status...
              </>
            ) : (
              <>
                <HiRefresh className="w-4 h-4" /> Check & Continue
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
