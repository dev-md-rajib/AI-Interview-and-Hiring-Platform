import React from 'react';
import { X, ShieldCheck, Info, ExternalLink, LogOut, FileText } from 'lucide-react';
import { User } from '../../../shared/types';

interface SettingsProps {
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onClose, onLogout }) => {
  const handleOpenPrivacyPolicy = () => {
    if (window.electronAPI) {
      window.electronAPI.openExternal('http://localhost:5000/privacy-policy');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="w-full max-w-lg glass-panel border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 relative transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">Tracker Preferences</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Application details & data disclosure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          {/* App Info */}
          <div className="p-4 glass-card rounded-xl border border-slate-200 dark:border-zinc-800 space-y-2">
            <div className="flex justify-between items-center text-zinc-700 dark:text-zinc-300">
              <span className="font-semibold">Application Version</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">v1.0.0 (Desktop)</span>
            </div>
            <div className="flex justify-between items-center text-zinc-700 dark:text-zinc-300">
              <span className="font-semibold">Proctoring Engine</span>
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Electron Native / Win32 Shell API</span>
            </div>
          </div>

          {/* Monitoring Transparency & Limits Disclosure */}
          <div className="p-4 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-200 font-bold mb-1">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>System & Privacy Disclosures</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              <li>Screenshots are taken only during active interview sessions.</li>
              <li>macOS users must grant Accessibility and Screen Recording permissions.</li>
              <li>Second physical devices or external monitors are unmonitored.</li>
              <li>Data is encrypted in transit and at rest per platform security policies.</li>
            </ul>
          </div>

          {/* External Links */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleOpenPrivacyPolicy}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold inline-flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>View Privacy & Data Policy</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          {user && (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-4 py-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-5 py-2 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
