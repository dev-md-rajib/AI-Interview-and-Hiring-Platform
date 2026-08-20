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
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg glass-panel border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Tracker Preferences</h3>
              <p className="text-xs text-zinc-400">Application details & data disclosure</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800/60 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          {/* App Info */}
          <div className="p-4 glass-card rounded-xl border border-zinc-800 space-y-2">
            <div className="flex justify-between items-center text-zinc-300">
              <span className="font-medium">Application Version</span>
              <span className="font-mono text-blue-400 font-semibold">v1.0.0 (Desktop)</span>
            </div>
            <div className="flex justify-between items-center text-zinc-300">
              <span className="font-medium">Proctoring Engine</span>
              <span className="text-zinc-400">Electron Native / Win32 Shell API</span>
            </div>
          </div>

          {/* Monitoring Transparency & Limits Disclosure */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-zinc-200 font-semibold mb-1">
              <Info className="w-4 h-4 text-blue-400" />
              <span>System & Privacy Disclosures</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 leading-relaxed">
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
              className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>View Privacy & Data Policy</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          {user && (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-4 py-2 bg-red-950/40 border border-red-800/60 text-red-400 hover:bg-red-900/50 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
