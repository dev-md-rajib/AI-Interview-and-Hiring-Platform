import React, { useState } from 'react';
import { HiShieldCheck, HiX, HiRefresh, HiDesktopComputer, HiLockClosed, HiCheckCircle, HiDownload, HiExternalLink } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';
import { TRACKER_DOWNLOAD_URL } from '../constants/tracker';

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
            <div className="w-10 h-10 rounded-xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-500 dark:text-primary-400">
              <HiShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Interview Tracker Required</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Proctoring desktop application must be active</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-lg">
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 text-xs leading-relaxed flex items-start gap-3">
            <HiLockClosed className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-bold text-amber-800 dark:text-amber-300">Proctoring Rule Enforced</p>
              <p className="mt-0.5 text-gray-700 dark:text-gray-300">
                To guarantee fairness and integrity, all candidates must start their proctoring session from the <strong className="text-gray-900 dark:text-white font-bold">Interview Tracker Desktop App</strong> before beginning the interview on the website.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Quick 3-Step Setup:</p>
              <a
                href={TRACKER_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                <HiDownload className="w-3.5 h-3.5" />
                <span>Download Tracker App</span>
                <HiExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-800 border border-dark-border">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary-300 dark:border-primary-500/30">
                1
              </span>
              <div className="text-xs flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 dark:text-white font-bold">Open Interview Tracker</p>
                  <a
                    href={TRACKER_DOWNLOAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-0.5"
                  >
                    Need app? Download here <HiExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-0.5">Launch the desktop app and log in with your candidate account.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-800 border border-dark-border">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary-300 dark:border-primary-500/30">
                2
              </span>
              <div className="text-xs">
                <p className="text-gray-900 dark:text-white font-bold">Consent & Select Window</p>
                <p className="text-gray-500 dark:text-gray-400 mt-0.5">Accept proctoring consent and pick your interview browser window.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-dark-800 border border-dark-border">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-300 dark:border-emerald-500/30">
                3
              </span>
              <div className="text-xs">
                <p className="text-gray-900 dark:text-white font-bold">Click "Start Lockdown"</p>
                <p className="text-gray-500 dark:text-gray-400 mt-0.5">Once lockdown is active, return here and click "Check & Continue".</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-dark-border bg-dark-900/50 flex items-center justify-between gap-3">
          <a
            href={TRACKER_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 border border-dark-border text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <HiDownload className="w-4 h-4 text-primary-500" />
            <span>Download Tracker</span>
            <HiExternalLink className="w-3 h-3 text-gray-400" />
          </a>

          <div className="flex items-center gap-3">
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
    </div>
  );
}
