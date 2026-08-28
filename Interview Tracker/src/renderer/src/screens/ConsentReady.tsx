import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Shield,
  Globe,
  Activity,
  Power,
  Database,
  CheckSquare,
  Square,
  Settings as SettingsIcon,
  LogOut,
  User as UserIcon,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { User, NextInterviewResponse } from '../../../shared/types';

interface ConsentReadyProps {
  user: User;
  onReadyClick: (interview: NextInterviewResponse) => void;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const ConsentReady: React.FC<ConsentReadyProps> = ({
  user,
  onReadyClick,
  onOpenSettings,
  onLogout
}) => {
  const [interview, setInterview] = useState<NextInterviewResponse | null>(null);
  const [consented, setConsented] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchInterview() {
      if (window.electronAPI) {
        const data = await window.electronAPI.getNextInterview();
        setInterview(data);
      } else {
        setInterview({
          interviewId: 'intv_77210',
          candidateId: user.id || 'cand_9921',
          jobTitle: 'Senior Full Stack Engineer',
          stack: 'React • Node.js • TypeScript',
          level: 'Senior Level',
          scheduledAt: new Date().toISOString(),
          interviewUrl: 'http://localhost:5000/interview/intv_77210'
        });
      }
    }
    fetchInterview();
  }, [user]);

  const handleProceedReady = async () => {
    if (!consented || !interview || isSubmitting) return;

    setIsSubmitting(true);
    const nowISO = new Date().toISOString();

    try {
      if (window.electronAPI) {
        await window.electronAPI.sendConsent({
          candidateId: user.id,
          interviewId: interview.interviewId,
          consentedAt: nowISO,
          consentVersion: 'v1'
        });

        await window.electronAPI.sendReady({
          candidateId: user.id,
          interviewId: interview.interviewId
        });
      }
      onReadyClick(interview);
    } catch (err) {
      console.error('Consent error:', err);
      onReadyClick(interview);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenPrivacyPolicy = () => {
    if (window.electronAPI) {
      window.electronAPI.openExternal('http://localhost:5000/privacy-policy');
    }
  };

  const getAvatarUrl = (u: User | null | undefined): string | null => {
    if (!u) return null;
    const img = u.profileImage || u.avatar;
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
      return img;
    }
    const apiBase = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || 'http://localhost:5000';
    return `${apiBase.replace(/\/$/, '')}${img.startsWith('/') ? img : `/${img}`}`;
  };

  const avatarUrl = getAvatarUrl(user);

  return (
    <div className="h-screen w-full flex bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-x-hidden relative transition-colors">
      {/* Top drag bar for frameless window */}
      <div className="absolute top-0 left-0 right-24 h-8 drag-region z-40" />

      {/* Left Sidebar */}
      <aside className="w-80 flex-shrink-0 border-r border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 flex flex-col justify-between p-6 transition-colors">
        <div>
          {/* App Branding */}
          <div className="flex items-center gap-2.5 pb-5 mb-5 border-b border-slate-200 dark:border-zinc-800/80">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-1.5 flex items-center justify-center shadow-sm">
              <img src="/app-icon.svg" alt="App Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">Interview Tracker</h2>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Candidate Client</span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-3.5 pb-6 border-b border-slate-200 dark:border-zinc-800">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/50 shadow-md flex-shrink-0"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
            ) : null}
            <div
              className={`w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 flex-shrink-0 ${
                avatarUrl ? 'hidden' : ''
              }`}
            >
              <UserIcon className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-zinc-900 dark:text-white truncate text-base">{user.name}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
            </div>
          </div>

          {/* Current Interview Card */}
          <div className="mt-6">
            <span className="text-xs font-bold uppercase text-zinc-500 dark:text-zinc-400 tracking-wider">
              Upcoming Interview
            </span>
            {interview ? (
              <div className="mt-3 p-4 glass-card rounded-xl border border-slate-200 dark:border-zinc-800/80 space-y-3">
                <div className="flex items-start gap-2.5">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm leading-tight">{interview.jobTitle}</h4>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 rounded text-[11px] font-bold">
                      {interview.level}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 pt-2 border-t border-slate-200 dark:border-zinc-800">
                  <Layers className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                  <span className="truncate font-medium">{interview.stack}</span>
                </div>
              </div>
            ) : (
              <div className="mt-3 p-4 bg-slate-100 dark:bg-zinc-900/40 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center">
                Loading interview details...
              </div>
            )}
          </div>
        </div>

        {/* Bottom Sidebar Action Buttons */}
        <div className="pt-6 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            onClick={onOpenSettings}
            className="p-2.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80 rounded-xl transition-colors flex items-center gap-2 text-xs font-semibold"
            title="Settings"
          >
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </button>
          <button
            onClick={onLogout}
            className="p-2.5 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors flex items-center gap-2 text-xs font-semibold"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel — Data Collection Disclosure */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto bg-slate-50/50 dark:bg-zinc-950 min-h-0 transition-colors">
        <div>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Proctoring & Monitoring Consent</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Please review the required monitoring policies below before starting your interview session.
            </p>
          </div>

          {/* Itemized Disclosures */}
          <div className="space-y-3.5">
            {/* 1. Screen monitoring */}
            <div className="p-4 glass-panel rounded-xl border border-slate-200 dark:border-zinc-800/80 flex items-start gap-4">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg flex-shrink-0">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Screen Monitoring</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  Screenshots of your screen are captured periodically (approx. every 30 seconds, at randomized times) and stored with this interview record.
                </p>
              </div>
            </div>

            {/* 2. Application lockdown */}
            <div className="p-4 glass-panel rounded-xl border border-slate-200 dark:border-zinc-800/80 flex items-start gap-4">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg flex-shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Application Lockdown</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  Other applications on your computer will be closed and blocked from opening while the interview is active.
                </p>
              </div>
            </div>

            {/* 3. Browser lockdown */}
            <div className="p-4 glass-panel rounded-xl border border-slate-200 dark:border-zinc-800/80 flex items-start gap-4">
              <div className="p-2.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg flex-shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Browser Lockdown</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  Only the interview window will be usable. Other browser tabs and windows will be closed.
                </p>
              </div>
            </div>

            {/* 4. Website activity */}
            <div className="p-4 glass-panel rounded-xl border border-slate-200 dark:border-zinc-800/80 flex items-start gap-4">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg flex-shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Website & Activity Logging</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  Any site or app you attempt to open during the interview is logged and sent to the interview platform.
                </p>
              </div>
            </div>

            {/* 5. Manual end / auto-flag */}
            <div className="p-4 glass-panel rounded-xl border border-slate-200 dark:border-zinc-800/80 flex items-start gap-4">
              <div className="p-2.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg flex-shrink-0">
                <Power className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Manual End & Scoring</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  You may end the interview at any time using the on-screen End button. Doing so immediately submits and scores your interview based on progress so far.
                </p>
              </div>
            </div>

            {/* 6. Data retention note */}
            <div className="p-4 glass-panel rounded-xl border border-slate-200 dark:border-zinc-800/80 flex items-start gap-4">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex-shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Data Retention Policy</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  Collected data is tied to this interview record and retained per the platform's data policy.{' '}
                  <button
                    onClick={handleOpenPrivacyPolicy}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-semibold inline-flex items-center gap-0.5 ml-1"
                  >
                    Read Privacy Policy <ExternalLink className="w-3 h-3" />
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Consent Checkbox & Primary Button — sticky at bottom */}
        <div className="sticky bottom-0 mt-6 pt-6 pb-2 border-t border-slate-200 dark:border-zinc-800 space-y-4 bg-slate-50/95 dark:bg-zinc-950/95 backdrop-blur-sm">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => setConsented(!consented)}
              className="text-blue-600 dark:text-blue-500 focus:outline-none flex-shrink-0"
            >
              {consented ? (
                <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-500 fill-blue-500/20" />
              ) : (
                <Square className="w-6 h-6 text-slate-400 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-500" />
              )}
            </button>
            <span className="text-xs text-zinc-800 dark:text-zinc-300 font-bold leading-tight">
              I understand and consent to the monitoring described above
            </span>
          </label>

          <button
            onClick={handleProceedReady}
            disabled={!consented || isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-200 disabled:to-slate-200 dark:disabled:from-zinc-800 dark:disabled:to-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 disabled:shadow-none focus:outline-none transition-all duration-200 text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Preparing Lockdown Session...</span>
            ) : (
              <>
                <span>Ready for Interview</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};
