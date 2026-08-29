import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HiUserGroup, HiArrowLeft, HiCalendar, HiClock, HiExternalLink,
  HiX, HiCheck, HiChip, HiRefresh, HiLockClosed, HiStar, HiCode, HiBriefcase,
  HiVideoCamera, HiClipboardCopy, HiArrowsExpand, HiShieldCheck, HiCheckCircle, HiPlay,
} from 'react-icons/hi';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { SECTORS, TECH_STACKS, getSectorById, isSector } from '../../constants/sectors';
import TrackerRequiredModal from '../../components/TrackerRequiredModal';
import LiveWebRTCInterviewRoom from '../../components/interview/LiveWebRTCInterviewRoom';

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
  const { user } = useAuth();
  const location = useLocation();
  const initialStack = location.state?.stack || '';
  const initialLevel = location.state?.level || 1;
  const initialInterviewType = location.state?.interviewType || (initialStack && isSector(initialStack) ? 'business' : 'tech');

  const [view, setView] = useState(initialStack ? 'request' : 'status'); // 'status' | 'request'
  const [inMeeting, setInMeeting] = useState(false);
  const [showTrackerModal, setShowTrackerModal] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);

  // Request form state
  const [interviewType, setInterviewType] = useState(initialInterviewType);
  const [stack, setStack] = useState(initialStack);
  const [level, setLevel] = useState(initialLevel);
  const [submitting, setSubmitting] = useState(false);

  const handleJoinMeeting = async () => {
    try {
      const { data: trackerData } = await api.get('/tracker/status');
      if (!trackerData.active) {
        setShowTrackerModal(true);
        return;
      }
    } catch {
      setShowTrackerModal(true);
      return;
    }
    setInMeeting(true);
  };

  useEffect(() => {
    if (location.state?.openMeeting) {
      handleJoinMeeting();
    }
  }, [location.state]);

  const fetchData = useCallback(async () => {
    try {
      const [intRes, eligRes] = await Promise.all([
        api.get('/team-interviews/my'),
        api.get(`/team-interviews/eligibility?level=${level}`),
      ]);
      const fetched = intRes.data.interviews || [];
      setInterviews(fetched);
      setEligibility(eligRes.data);

      const hasActive = fetched.some((i) => ['pending', 'scheduled', 'active'].includes(i.status));
      if (hasActive) {
        setView('status');
      }
    } catch {
      toast.error('Failed to load interview data');
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const activeInterview = interviews.find((i) => ['pending', 'scheduled', 'active'].includes(i.status));
  const pastInterviews = interviews.filter((i) => !['pending', 'scheduled', 'active'].includes(i.status));

  const handleTypeChange = (type) => {
    setInterviewType(type);
    setStack('');
  };

  const handleRequest = async () => {
    if (!stack) return toast.error(`Please select a ${interviewType === 'business' ? 'business sector' : 'tech stack'}`);
    if (eligibility && !eligibility.eligible) {
      return toast.error(eligibility.reason || `Level ${level} is locked! You must pass Level ${level - 1} first.`);
    }

    setSubmitting(true);
    try {
      const { data } = await api.post('/team-interviews/request', {
        stack,
        level,
        interviewType,
      });

      if (data.noInterviewer) {
        toast(data.message || 'No interviewer with matching expertise is available right now. Please try again later or select another stack.', { icon: '⚠️' });
      } else {
        toast.success(data.message || 'Interview scheduled! Check details below. 🎉');
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

  const selectedSector = interviewType === 'business' && isSector(stack) ? getSectorById(stack) : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (inMeeting && activeInterview) {
    return (
      <LiveWebRTCInterviewRoom
        interview={activeInterview}
        user={user}
        onLeave={() => setInMeeting(false)}
      />
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
              A real human interviewer matched to your stack or domain will conduct a live Zoom session.
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

          {/* Select Interview Type */}
          <div>
            <label className="label">Select Interview Type</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Choose whether you want a technical engineering interview or a business domain interview to find the right interviewer.</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => handleTypeChange('tech')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                  interviewType === 'tech'
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 text-gray-900 dark:text-white shadow-sm'
                    : 'border-dark-border hover:border-cyan-500/50 bg-dark-card text-gray-600 dark:text-gray-400'
                }`}
              >
                <HiCode className={`w-6 h-6 flex-shrink-0 ${interviewType === 'tech' ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-500 dark:text-gray-400'}`} />
                <div>
                  <div className={`font-bold text-sm ${interviewType === 'tech' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Tech Stack</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Software, coding, systems</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('business')}
                className={`p-3.5 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                  interviewType === 'business'
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-gray-900 dark:text-white shadow-sm'
                    : 'border-dark-border hover:border-amber-500/50 bg-dark-card text-gray-600 dark:text-gray-400'
                }`}
              >
                <HiBriefcase className={`w-6 h-6 flex-shrink-0 ${interviewType === 'business' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`} />
                <div>
                  <div className={`font-bold text-sm ${interviewType === 'business' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>General & Professional Fields</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Marketing, Sales, HR, Finance, Analysis & more</div>
                </div>
              </button>
            </div>

            {/* Tech Stack Options */}
            {interviewType === 'tech' && (
              <div>
                <label className="label text-xs text-gray-500 dark:text-gray-400 mb-2">Choose Tech Stack</label>
                <div className="flex flex-wrap gap-2">
                  {TECH_STACKS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStack(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        stack === s
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 shadow-sm'
                          : 'border-dark-border text-gray-700 dark:text-gray-400 bg-dark-card hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {stack && (
                  <p className="mt-2 text-xs text-cyan-600 dark:text-cyan-400">
                    Selected: <span className="font-bold text-gray-900 dark:text-white">{stack}</span>
                  </p>
                )}
              </div>
            )}

            {/* General & Professional Fields Options */}
            {interviewType === 'business' && (
              <div>
                <label className="label text-xs text-gray-500 dark:text-gray-400 mb-2">Choose Field / Domain</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SECTORS.map((sector) => {
                    const isSelected = stack === sector.id;
                    const Icon = sector.Icon;
                    return (
                      <button
                        key={sector.id}
                        type="button"
                        onClick={() => setStack(sector.id)}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? `${sector.border} ${sector.bg}`
                            : 'border-dark-border hover:border-gray-400 bg-dark-card'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? `${sector.bg} ${sector.color} border ${sector.border}` : 'bg-dark-card text-gray-400 border border-dark-border'}`}>
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className={`font-semibold text-xs truncate ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                            {sector.label}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {stack && selectedSector && (
                  <p className="mt-2 text-xs flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded flex items-center justify-center ${selectedSector.bg} ${selectedSector.color} border ${selectedSector.border}`}>
                      {selectedSector.Icon && <selectedSector.Icon className="w-3 h-3" />}
                    </span>
                    <span className={`font-semibold ${selectedSector.color}`}>{selectedSector.id}</span>
                    <span className="text-gray-500 dark:text-gray-400">selected</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Level */}
          <div>
            <label className="label">Interview Level</label>
            {eligibility && !eligibility.eligible && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl mb-3 flex items-start gap-2.5 text-xs text-red-300">
                <HiLockClosed className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-red-300">Level {level} Locked</p>
                  <p className="text-red-300/80 mt-0.5">{eligibility.reason || `You must pass Level ${level - 1} first before requesting Level ${level}.`}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((lvl) => {
                const isSelected = level === lvl;
                const isLvlLocked = isSelected && eligibility && !eligibility.eligible;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`py-3 rounded-xl border-2 text-center transition-all ${
                      isSelected
                        ? isLvlLocked
                          ? 'border-red-500 bg-red-950/30 text-red-300 shadow-sm'
                          : 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-gray-900 dark:text-white shadow-sm'
                        : 'border-dark-border bg-dark-card text-gray-700 dark:text-gray-400 hover:border-cyan-500/50'
                    }`}
                  >
                    <p className={`font-bold text-sm ${isSelected ? (isLvlLocked ? 'text-red-300' : 'text-gray-900 dark:text-white') : 'text-gray-700 dark:text-gray-300'}`}>
                      Level {lvl}
                    </p>
                    <p className={`text-xs ${isSelected ? (isLvlLocked ? 'text-red-400 font-semibold' : 'text-cyan-700 dark:text-cyan-300 font-semibold') : 'text-gray-500 dark:text-gray-400'}`}>
                      {LEVEL_LABELS[lvl]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Automated Slot Matching Info Card */}
          <div className="p-4 bg-cyan-50/70 dark:bg-gradient-to-r dark:from-cyan-950/40 dark:via-dark-800 dark:to-dark-800 rounded-xl border border-cyan-200 dark:border-cyan-500/30 text-xs space-y-2">
            <div className="flex items-center gap-2 text-cyan-800 dark:text-cyan-400 font-bold text-sm">
              <HiClock className="w-5 h-5" />
              <span>Automated First-Available Slot Matching</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              You don't need to guess or enter a time slot. We will automatically locate the best available interviewer qualified in <strong className="text-gray-900 dark:text-white font-bold">{stack || (interviewType === 'business' ? 'your sector' : 'your tech stack')}</strong> and assign you their <strong className="text-gray-900 dark:text-white font-bold">first available opening</strong> (enforcing a guaranteed 30-minute rest buffer between interviews).
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-gray-600 dark:text-gray-400 font-medium">
              <span className="flex items-center gap-1 text-cyan-700 dark:text-cyan-300 font-semibold">✓ Instant Zoom Link</span>
              <span className="flex items-center gap-1 text-cyan-700 dark:text-cyan-300 font-semibold">✓ 30-min Rest Gap</span>
              <span className="flex items-center gap-1 text-cyan-700 dark:text-cyan-300 font-semibold">✓ 2-Minute Reminder</span>
            </div>
          </div>

          <button
            onClick={handleRequest}
            disabled={submitting || !stack || (eligibility && !eligibility.eligible)}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-600 via-primary-600 to-indigo-600 hover:from-cyan-500 hover:via-primary-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-md shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Searching Interviewer & Scheduling...
              </>
            ) : eligibility && !eligibility.eligible ? (
              <>🔒 Level {level} Locked (Not Allowed)</>
            ) : (
              <>⚡ Find Interviewer & Auto-Schedule Zoom</>
            )}
          </button>
        </div>
      )}

      {/* ── Status View ── */}
      {view === 'status' && (
        <>
          {/* Active interview */}
          {activeInterview ? (
            <ActiveInterviewCard
              interview={activeInterview}
              onCancel={handleCancel}
              onRefresh={fetchData}
              onJoinMeeting={handleJoinMeeting}
            />
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

      {/* Tracker Required Prompt Modal */}
      <TrackerRequiredModal
        isOpen={showTrackerModal}
        onClose={() => setShowTrackerModal(false)}
        onSuccess={() => setInMeeting(true)}
      />
    </div>
  );
}

// ── Active Interview Card ──
function ActiveInterviewCard({ interview, onCancel, onRefresh, onJoinMeeting }) {
  const statusCfg = STATUS_CONFIG[interview.status] || STATUS_CONFIG.pending;
  const scheduledDate = interview.scheduledAt ? new Date(interview.scheduledAt) : null;
  const canCancel = ['pending', 'scheduled'].includes(interview.status);
  const sectorInfo = isSector(interview.stack || interview.sector) ? getSectorById(interview.stack || interview.sector) : null;

  return (
    <div className={`card border-2 ${statusCfg.bg} space-y-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.color}`}>
            ● {statusCfg.label}
          </span>
          <h2 className="text-gray-900 dark:text-white font-bold">Your Upcoming Interview</h2>
        </div>
        <button onClick={onRefresh} className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded transition-colors" title="Refresh">
          <HiRefresh className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">
            {sectorInfo ? 'Business Sector' : 'Tech Stack'}
          </p>
          <p className="text-gray-900 dark:text-white font-bold flex items-center gap-1.5">
            {sectorInfo ? (
              <>
                <span>{sectorInfo.icon}</span>
                <span>{interview.stack}</span>
              </>
            ) : (
              interview.stack
            )}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Level</p>
          <p className="text-gray-900 dark:text-white font-bold">{LEVEL_LABELS[interview.level] || `Level ${interview.level}`}</p>
        </div>
        {scheduledDate && (
          <>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Date (BST, Bangladesh Time)</p>
              <p className="text-gray-900 dark:text-white font-bold">
                {scheduledDate.toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Time (BST, Bangladesh Time)</p>
              <p className="text-cyan-700 dark:text-cyan-300 font-bold font-mono">
                {scheduledDate.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            </div>
          </>
        )}
        {interview.interviewer && (
          <div className="col-span-2">
            <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Your Interviewer</p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
                {interview.interviewer.profileImage
                  ? <img src={interview.interviewer.profileImage} alt="" className="w-full h-full object-cover" />
                  : interview.interviewer.name?.[0]?.toUpperCase()}
              </div>
              <p className="text-gray-900 dark:text-white font-bold text-sm">{interview.interviewer.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Countdown */}
      {scheduledDate && scheduledDate > new Date() && (
        <div className="p-3 bg-dark-800 rounded-lg border border-dark-border flex items-center gap-3">
          <HiClock className="w-5 h-5 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Starts in</p>
            <CountdownTimer scheduledAt={scheduledDate} />
          </div>
        </div>
      )}

      {/* Embedded In-App Video Meeting Join */}
      <button
        type="button"
        onClick={onJoinMeeting}
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:via-cyan-500 hover:to-teal-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-cyan-600/20 active:scale-[0.99]"
      >
        <HiVideoCamera className="w-5 h-5" />
        Join Live Interview (In-App Video)
      </button>

      {interview.zoomPassword && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Meeting Password: <span className="text-gray-900 dark:text-gray-200 font-mono font-semibold">{interview.zoomPassword}</span>
        </p>
      )}

      {/* Cancel */}
      {canCancel && (
        <button
          onClick={() => onCancel(interview._id)}
          className="w-full py-2 bg-dark-800 border border-red-500/20 hover:bg-red-900/20 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 rounded-xl text-sm font-medium transition-all"
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
  const sectorInfo = isSector(interview.stack || interview.sector) ? getSectorById(interview.stack || interview.sector) : null;

  return (
    <div className="card hover:border-dark-border transition-all">
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${hasResult && interview.passed ? 'bg-emerald-400' : hasResult && !interview.passed ? 'bg-red-400' : 'bg-gray-500'}`} />
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-gray-900 dark:text-white text-sm font-bold flex items-center gap-1.5">
                {sectorInfo && <span>{sectorInfo.icon}</span>}
                <span>{interview.stack} · {LEVEL_LABELS[interview.level] || `Level ${interview.level}`}</span>
                {sectorInfo && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                    Business
                  </span>
                )}
              </p>
              {scheduledDate && (
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">{scheduledDate.toLocaleDateString()}</p>
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
