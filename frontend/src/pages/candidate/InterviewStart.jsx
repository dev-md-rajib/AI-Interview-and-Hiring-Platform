import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  HiAcademicCap, HiClock, HiCheckCircle, HiXCircle, HiChip,
  HiUserGroup, HiLightningBolt, HiInformationCircle, HiCode, HiBriefcase,
  HiDownload, HiExternalLink, HiLockClosed, HiCamera, HiAdjustments
} from 'react-icons/hi';
import { SECTORS, TECH_STACKS, getSectorById, isSector, SECTOR_LEVEL_DESCRIPTIONS } from '../../constants/sectors';
import { TRACKER_DOWNLOAD_URL } from '../../constants/tracker';
import TrackerRequiredModal from '../../components/TrackerRequiredModal';
import MediaDeviceTroubleshootModal from '../../components/interview/MediaDeviceTroubleshootModal';

// ─── Tech Level Descriptions ────────────────────────────────
const TECH_LEVEL_DESCRIPTIONS = {
  1: {
    label: 'Junior',
    topics: ['Core language basics', 'Data types & structures', 'Functions & control flow', 'Basic OOP / FP', 'Simple algorithms'],
    description: 'Foundational concepts, basic syntax, common patterns, simple problem-solving.',
    color: 'text-emerald-400',
    border: 'border-emerald-500',
    bg: 'bg-emerald-900/20',
  },
  2: {
    label: 'Mid-level',
    topics: ['Design patterns', 'API design', 'Performance & optimization', 'Error handling', 'Testing strategies', 'Database design'],
    description: 'System design basics, optimization, architectural patterns, debugging skills.',
    color: 'text-yellow-400',
    border: 'border-yellow-500',
    bg: 'bg-yellow-900/20',
  },
  3: {
    label: 'Senior',
    topics: ['Distributed systems', 'Scalability & caching', 'Security best practices', 'CI/CD & DevOps', 'Code review standards', 'Complex algorithm design'],
    description: 'Complex system architecture, scalability, leadership decisions, deep-dive analysis.',
    color: 'text-rose-400',
    border: 'border-rose-500',
    bg: 'bg-rose-900/20',
  },
};

const LEVEL_COLORS = {
  1: { color: 'text-emerald-400', border: 'border-emerald-500', bg: 'bg-emerald-900/20' },
  2: { color: 'text-yellow-400', border: 'border-yellow-500', bg: 'bg-yellow-900/20' },
  3: { color: 'text-rose-400', border: 'border-rose-500', bg: 'bg-rose-900/20' },
};

const LEVEL_LABELS = { 1: 'Junior', 2: 'Mid-level', 3: 'Senior' };

const INTERVIEW_MODES = [
  {
    id: 'standard',
    label: 'Standard',
    icon: HiAcademicCap,
    description: 'Traditional question-answer format. Pick questions at your own pace.',
    color: 'from-primary-900/50 to-primary-800/30',
    border: 'border-primary-500',
    iconColor: 'text-primary-400',
  },
  {
    id: 'ai_agent',
    label: 'AI Agent',
    icon: HiChip,
    description: 'Live voice conversation with an AI interviewer powered by Gemini. Dynamic follow-ups, coding & scenario challenges.',
    color: 'from-violet-900/50 to-violet-800/30',
    border: 'border-violet-500',
    iconColor: 'text-violet-400',
    badge: 'LIVE',
  },
  {
    id: 'interview_team',
    label: 'Interview Team',
    icon: HiUserGroup,
    description: 'A real interviewer will conduct a live Zoom session. Auto-matched by availability and expertise.',
    color: 'from-cyan-900/50 to-cyan-800/30',
    border: 'border-cyan-500',
    iconColor: 'text-cyan-400',
    badge: 'ZOOM LIVE',
  },
];

export default function InterviewStart() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('standard');
  const [level, setLevel] = useState(1);
  const [stack, setStack] = useState('');
  const [interviewType, setInterviewType] = useState('tech'); // 'tech' | 'business'
  const [levelStatus, setLevelStatus] = useState({ 1: { eligible: true }, 2: null, 3: null });
  const [eligibility, setEligibility] = useState(null);
  const [activeTeamInterview, setActiveTeamInterview] = useState(null);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  useEffect(() => {
    api.get('/admin/levels').then(({ data }) => setLevels(data.levels || []));
    api.get('/team-interviews/my').then(({ data }) => {
      const active = (data.interviews || []).find((i) => ['pending', 'scheduled', 'active'].includes(i.status));
      setActiveTeamInterview(active || null);
    }).catch(() => {});
  }, []);

  // Clear selection when switching type
  useEffect(() => {
    setStack('');
    setEligibility(null);
  }, [interviewType]);

  // Check eligibility for all levels
  useEffect(() => {
    if (mode === 'standard') {
      const allOpen = { 1: { eligible: true }, 2: { eligible: true }, 3: { eligible: true } };
      setLevelStatus(allOpen);
      setEligibility({ eligible: true });
    } else {
      Promise.all([
        api.get('/team-interviews/eligibility?level=2').catch(() => ({ data: { eligible: false, reason: 'You must pass Level 1 first' } })),
        api.get('/team-interviews/eligibility?level=3').catch(() => ({ data: { eligible: false, reason: 'You must pass Level 2 first' } })),
      ]).then(([res2, res3]) => {
        const status = {
          1: { eligible: true },
          2: res2.data,
          3: res3.data,
        };
        setLevelStatus(status);
        setEligibility(status[level] || { eligible: true });
      });
    }
  }, [mode, stack]);

  useEffect(() => {
    setEligibility(levelStatus[level] || (level === 1 ? { eligible: true } : null));
  }, [level, levelStatus]);

  const handleModeClick = (selectedMode) => {
    if (selectedMode === 'interview_team' && activeTeamInterview) {
      navigate('/candidate/interview/team');
      return;
    }
    setMode(selectedMode);
  };

  const [showTrackerModal, setShowTrackerModal] = useState(false);

  const executeStart = async () => {
    if (!stack) return toast.error(`Please select a ${interviewType === 'business' ? 'sector' : 'tech stack'}`);
    if (eligibility && !eligibility.eligible) {
      return toast.error(eligibility.reason || `Level ${level} is locked! You must pass Level ${level - 1} first.`);
    }

    setStarting(true);
    try {
      if (mode === 'interview_team') {
        if (activeTeamInterview) {
          navigate('/candidate/interview/team');
          return;
        }

        const { data } = await api.post('/team-interviews/request', {
          stack,
          level,
          interviewType,
        });

        if (data.noInterviewer) {
          toast(data.message || 'No interviewer with matching expertise is available right now. Please try again later or select another field.', { icon: '⚠️' });
        } else {
          toast.success(data.message || 'Live Human Interview Scheduled! 🎉');
        }

        navigate('/candidate/interview/team');
      } else if (mode === 'ai_agent') {
        const { data } = await api.post('/interviews/ai-agent/start', { level, stack });
        toast.success('Interview started! 🚀');
        navigate(`/candidate/interview/ai-agent/${data.interviewId}`, { state: { interview: data } });
      } else {
        const { data } = await api.post('/interviews/start', { level, stack });
        toast.success('Interview started! Good luck 🚀');
        navigate(`/candidate/interview/${data.interviewId}`, { state: { interview: data } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setStarting(false);
    }
  };

  const handleStart = async () => {
    if (mode !== 'interview_team' && !stack) {
      return toast.error(`Please select a ${interviewType === 'business' ? 'sector' : 'tech stack'}`);
    }

    if (eligibility && !eligibility.eligible) {
      return toast.error(eligibility.reason || `Level ${level} is locked! You must pass Level ${level - 1} first.`);
    }

    // For Human Team interview, booking a future schedule does not require tracker at creation time.
    // Tracker is checked when the candidate actually starts/joins the live meeting room.
    if (mode === 'interview_team') {
      executeStart();
      return;
    }

    try {
      const { data: trackerData } = await api.get('/tracker/status');
      if (!trackerData.active) {
        setShowTrackerModal(true);
        return;
      }
    } catch {
      // If error checking tracker, open prompt
      setShowTrackerModal(true);
      return;
    }

    executeStart();
  };

  const selectedSector = isSector(stack) ? getSectorById(stack) : null;
  const levelConfig = levels.find((l) => l.level === level);
  const levelColors = LEVEL_COLORS[level];

  // Level description — adapts to sector or tech
  const sectorLevelDesc = (interviewType === 'business' && stack && isSector(stack))
    ? SECTOR_LEVEL_DESCRIPTIONS[stack]?.[level]
    : null;
  const techLevelDesc = TECH_LEVEL_DESCRIPTIONS[level];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Start Interview</h1>
        <p className="text-gray-400 mt-1">Choose your interview mode, level, and field</p>
      </div>

      {/* Interview Mode selector */}
      <div className="card mb-6">
        <h2 className="section-title mb-4">Select Interview Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INTERVIEW_MODES.map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModeClick(m.id)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? `${m.border} bg-gradient-to-br ${m.color}`
                    : 'border-dark-border hover:border-gray-400 dark:hover:border-gray-600 bg-dark-800/50'
                }`}
              >
                {m.badge && (
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.badge === 'LIVE' ? 'bg-violet-600 text-white'
                    : m.badge === 'ZOOM LIVE' ? 'bg-cyan-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                  }`}>
                    {m.badge}
                  </span>
                )}
                <Icon className={`w-7 h-7 mb-2 ${isSelected ? m.iconColor : 'text-gray-400'}`} />
                <div className={`font-bold text-sm mb-1 ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{m.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{m.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interview Type Toggle (Tech vs Business) */}
      <div className="card mb-6">
        <h2 className="section-title mb-4">Select Interview Type</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setInterviewType('tech')}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              interviewType === 'tech'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                : 'border-dark-border hover:border-gray-400 dark:hover:border-gray-600 bg-dark-800/50'
            }`}
          >
            <HiCode className={`w-6 h-6 flex-shrink-0 ${interviewType === 'tech' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400'}`} />
            <div>
              <div className={`font-bold text-sm ${interviewType === 'tech' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>Tech Stack</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Software, programming, engineering</div>
            </div>
          </button>
          <button
            onClick={() => setInterviewType('business')}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              interviewType === 'business'
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                : 'border-dark-border hover:border-gray-400 dark:hover:border-gray-600 bg-dark-800/50'
            }`}
          >
            <HiBriefcase className={`w-6 h-6 flex-shrink-0 ${interviewType === 'business' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}`} />
            <div>
              <div className={`font-bold text-sm ${interviewType === 'business' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>General & Professional Fields</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Marketing, Sales, HR, Finance, Analysis & more</div>
            </div>
          </button>
        </div>

        {/* Tech Stack Picker */}
        {interviewType === 'tech' && (
          <>
            <p className="text-sm text-gray-400 mb-3">Choose the technology you want to be interviewed on</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {TECH_STACKS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStack(s)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    stack === s
                      ? 'border-primary-500 bg-primary-100 text-primary-800 font-semibold dark:bg-primary-900/40 dark:text-primary-300 shadow-sm'
                      : 'border-dark-border text-gray-700 dark:text-gray-400 bg-dark-800/40 hover:border-primary-500 hover:text-primary-600 dark:hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {stack && <p className="mt-3 text-sm text-accent-400">Selected: <span className="font-semibold">{stack}</span></p>}
          </>
        )}

        {/* General & Professional Fields Picker */}
        {interviewType === 'business' && (
          <>
            <p className="text-sm text-gray-400 mb-3">Choose the field or domain you want to be interviewed on</p>
            {mode === 'ai_agent' && (
              <div className="mb-4 p-3 rounded-lg bg-amber-900/10 border border-amber-500/30 text-xs text-amber-300">
                🎙️ General & professional field AI interviews are <strong>entirely voice/scenario-based</strong> — no coding challenges. The AI adapts its persona based on the domain (e.g., acts as a customer for Sales).
              </div>
            )}
            {mode === 'interview_team' && (
              <div className="mb-4 p-3 rounded-lg bg-cyan-900/10 border border-cyan-500/30 text-xs text-cyan-300">
                👥 In domain & professional field team interviews, an expert human interviewer matching this domain will conduct your live Zoom session.
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SECTORS.map((sector) => {
                const isSelected = stack === sector.id;
                const Icon = sector.Icon;
                return (
                  <button
                    key={sector.id}
                    onClick={() => setStack(sector.id)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all group flex flex-col justify-between ${
                      isSelected
                        ? `${sector.border} ${sector.bg} shadow-lg shadow-black/20`
                        : 'border-dark-border hover:border-gray-400 dark:hover:border-gray-600 bg-dark-800/40 hover:bg-dark-800'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                      isSelected
                        ? `${sector.bg} ${sector.color} border ${sector.border}`
                        : `bg-dark-card border border-dark-border text-gray-400 group-hover:${sector.color} group-hover:border-gray-600`
                    }`}>
                      {Icon && <Icon className="w-5 h-5" />}
                    </div>
                    <div className={`font-semibold text-xs leading-tight ${isSelected ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                      {sector.label}
                    </div>
                  </button>
                );
              })}
            </div>
            {stack && selectedSector && (
              <p className="mt-3 text-sm flex items-center gap-2">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${selectedSector.bg} ${selectedSector.color} border ${selectedSector.border}`}>
                  {selectedSector.Icon && <selectedSector.Icon className="w-3.5 h-3.5" />}
                </span>
                <span className={`font-semibold ${selectedSector.color}`}>{selectedSector.id}</span>
                <span className="text-gray-500">selected</span>
              </p>
            )}
          </>
        )}
      </div>

      {/* Level selector */}
      <div className="card mb-6">
        <h2 className="section-title">Select Interview Level</h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3].map((lvl) => {
            const colors = LEVEL_COLORS[lvl];
            const isLocked = mode !== 'standard' && lvl > 1 && levelStatus[lvl] && !levelStatus[lvl].eligible;
            return (
              <button
                key={lvl}
                onClick={() => {
                  setLevel(lvl);
                  if (isLocked) {
                    toast.error(levelStatus[lvl]?.reason || `Level ${lvl} is locked. You must pass Level ${lvl - 1} first.`, { id: `lvl-lock-${lvl}` });
                  }
                }}
                className={`relative p-4 rounded-xl border-2 text-center transition-all ${
                  level === lvl
                    ? isLocked
                      ? 'border-red-500 bg-red-900/20 shadow-sm'
                      : `${colors.border} ${colors.bg}`
                    : isLocked
                    ? 'border-red-500/30 bg-red-950/20 opacity-80 hover:border-red-500/60'
                    : 'border-dark-border hover:border-primary-700'
                }`}
              >
                {isLocked && (
                  <span className="absolute top-2 right-2 text-[10px] text-red-400 bg-red-900/50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-red-500/30 font-bold">
                    <HiLockClosed className="w-3 h-3" /> Locked
                  </span>
                )}
                <HiAcademicCap className={`w-6 h-6 mx-auto mb-2 ${isLocked ? 'text-red-400' : level === lvl ? colors.color : 'text-gray-400'}`} />
                <div className={`font-bold text-sm ${isLocked ? 'text-red-300' : level === lvl ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                  Level {lvl}
                </div>
                <div className={`text-xs mt-1 ${isLocked ? 'text-red-400/80 font-medium' : 'text-gray-500'}`}>
                  {isLocked ? `Requires L${lvl - 1}` : LEVEL_LABELS[lvl]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Level spec info — adapts to selected sector */}
        {sectorLevelDesc ? (
          <div className={`p-4 rounded-lg border ${levelColors.border} ${levelColors.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <HiInformationCircle className={`w-4 h-4 ${levelColors.color}`} />
              <span className={`text-sm font-semibold ${levelColors.color}`}>{sectorLevelDesc.label} — What you'll be tested on:</span>
            </div>
            <p className="text-gray-400 text-xs mb-3">{selectedSector && (
              <span className="mr-2">{selectedSector.icon}</span>
            )}{techLevelDesc.description}</p>
            {sectorLevelDesc.scenario && (
              <div className="mb-3 p-3 rounded-lg bg-dark-900/60 border border-dark-border">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1 tracking-wider">Example Scenario</p>
                <p className="text-gray-700 dark:text-gray-300 text-xs italic">"{sectorLevelDesc.scenario}"</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {sectorLevelDesc.topics.map((topic) => (
                <span key={topic} className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-dark-border">
                  {topic}
                </span>
              ))}
            </div>
            {levelConfig && (
              <div className="grid grid-cols-3 gap-4 text-sm text-center mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                <div><p className="text-gray-500 dark:text-gray-400 text-xs">Duration</p><p className="text-gray-900 dark:text-white font-bold">{levelConfig.durationMinutes} min</p></div>
                <div><p className="text-gray-500 dark:text-gray-400 text-xs">Questions</p><p className="text-gray-900 dark:text-white font-bold">{levelConfig.questionCount}</p></div>
                <div><p className="text-gray-500 dark:text-gray-400 text-xs">Pass Score</p><p className="text-gray-900 dark:text-white font-bold">{levelConfig.minimumPassScore}%</p></div>
              </div>
            )}
          </div>
        ) : techLevelDesc && (
          <div className={`p-4 rounded-lg border ${techLevelDesc.border} ${techLevelDesc.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <HiInformationCircle className={`w-4 h-4 ${techLevelDesc.color}`} />
              <span className={`text-sm font-semibold ${techLevelDesc.color}`}>{techLevelDesc.label} Level — What you'll be tested on:</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs mb-3">{techLevelDesc.description}</p>
            <div className="flex flex-wrap gap-2">
              {techLevelDesc.topics.map((topic) => (
                <span key={topic} className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-border">
                  {topic}
                </span>
              ))}
            </div>
            {levelConfig && (
              <div className="grid grid-cols-3 gap-4 text-sm text-center mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                <div><p className="text-gray-500 dark:text-gray-400 text-xs">Duration</p><p className="text-gray-900 dark:text-white font-bold">{levelConfig.durationMinutes} min</p></div>
                <div><p className="text-gray-500 dark:text-gray-400 text-xs">Questions</p><p className="text-gray-900 dark:text-white font-bold">{levelConfig.questionCount}</p></div>
                <div><p className="text-gray-500 dark:text-gray-400 text-xs">Pass Score</p><p className="text-gray-900 dark:text-white font-bold">{levelConfig.minimumPassScore}%</p></div>
              </div>
            )}
          </div>
        )}
      </div>

      {mode === 'interview_team' && (
        <div className="card mb-6 border border-cyan-500/30 bg-cyan-50 dark:bg-cyan-900/10">
          <p className="text-cyan-700 dark:text-cyan-300 font-semibold text-sm">🎥 How Interview Team Works</p>
          <ul className="mt-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <li>• You'll be matched with a real human interviewer</li>
            <li>• You will pick a topic, level, and scheduled date/time</li>
            <li>• A Zoom meeting link will be automatically generated for your session</li>
            <li>• Join at the scheduled time to complete your live interview</li>
          </ul>
        </div>
      )}

      {/* Sector mode overview info */}
      {selectedSector && mode === 'ai_agent' && (
        <div className="card mb-6 border border-violet-500/30 bg-violet-50 dark:bg-violet-900/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{selectedSector.icon}</span>
            <p className="text-violet-700 dark:text-violet-300 font-semibold text-sm">{selectedSector.label} — Scenario AI Interview</p>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{selectedSector.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-dark-border">
              <p className="text-gray-500">Target Role</p>
              <p className="text-gray-900 dark:text-white font-medium">{selectedSector.targetRole}</p>
            </div>
            <div className="p-2 rounded bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-dark-border">
              <p className="text-gray-500">Format</p>
              <p className="text-gray-900 dark:text-white font-medium">Scenario + Q&A</p>
            </div>
            <div className="p-2 rounded bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-dark-border">
              <p className="text-gray-500">Language</p>
              <p className="text-gray-900 dark:text-white font-medium">English (Voice/Text)</p>
            </div>
            <div className="p-2 rounded bg-white dark:bg-dark-800/60 border border-gray-200 dark:border-dark-border">
              <p className="text-gray-500">Evaluation</p>
              <p className="text-gray-900 dark:text-white font-medium">Domain Rubric (0-100)</p>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility status */}
      {eligibility && (
        <div className={`p-4 rounded-xl border mb-6 flex items-start gap-3.5 ${
          eligibility.eligible
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
            : 'bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300'
        }`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
            eligibility.eligible ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'
          }`}>
            {eligibility.eligible ? <HiCheckCircle className="w-5 h-5" /> : <HiLockClosed className="w-5 h-5" />}
          </div>
          <div>
            <p className="font-bold text-sm">
              {eligibility.eligible
                ? mode === 'standard'
                  ? 'Open to all — Standard level has no prerequisites'
                  : `Level ${level} Unlocked — You are eligible to take this interview`
                : `Level ${level} Locked — Candidate Not Allowed`}
            </p>
            {!eligibility.eligible && (
              <p className="text-xs text-red-400 dark:text-red-300 mt-1 leading-relaxed font-medium">
                {eligibility.reason || `You must pass Level ${level - 1} first before you are allowed to attempt Level ${level}.`}
              </p>
            )}
            {eligibility.eligible && eligibility.attemptsToday != null && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{eligibility.attemptsToday}/{eligibility.maxAttemptsPerDay} attempts used today</p>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-gray-900 dark:text-white font-bold text-base">
              {mode === 'ai_agent' ? '🤖 Ready to talk to the AI Interviewer?' : mode === 'interview_team' ? '👥 Interview Team Mode' : '🚀 Ready to begin?'}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5 mt-1">
              <HiClock className="w-4 h-4 text-primary-500 dark:text-primary-400 flex-shrink-0" />
              {mode === 'ai_agent'
                ? interviewType === 'business'
                  ? 'AI will conduct a voice scenario interview tailored to your sector.'
                  : 'AI will ask questions via voice. You reply via voice or code.'
                : mode === 'interview_team'
                ? 'Click to schedule your session — a Zoom link will be auto-created.'
                : 'Timer starts once you click start'}
            </p>
            <p className="text-xs text-primary-600 dark:text-primary-400 mt-2 flex items-center gap-1 font-semibold">
              <HiDownload className="w-3.5 h-3.5" />
              <span>
                {mode === 'interview_team'
                  ? 'Interview Tracker required when joining your live Zoom interview.'
                  : 'Interview Tracker Desktop App required to take interview.'}
              </span>
              <a
                href={TRACKER_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary-700 dark:hover:text-primary-300 inline-flex items-center gap-0.5 ml-1"
              >
                Download here <HiExternalLink className="w-2.5 h-2.5" />
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDeviceModal(true)}
              className="px-4 py-3 text-sm rounded-xl font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:text-white"
              title="Test Webcam and Microphone Permissions"
            >
              <HiCamera className="w-4 h-4 text-violet-400" />
              <span>Test Camera &amp; Mic</span>
            </button>

            <button
              onClick={handleStart}
              disabled={
                starting ||
                (mode !== 'interview_team' && !stack) ||
                (eligibility && !eligibility.eligible)
              }
              className={`px-8 py-3 text-base rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                eligibility && !eligibility.eligible
                  ? 'bg-gray-700 text-gray-400 border border-gray-600'
                  : mode === 'ai_agent'
                  ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-900/40'
                  : mode === 'interview_team'
                  ? 'bg-cyan-700 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                  : 'btn-primary'
              }`}
            >
              {starting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'ai_agent' ? 'Connecting...' : 'Preparing...'}
                </span>
              ) : eligibility && !eligibility.eligible ? (
                <span className="flex items-center gap-2">🔒 Level {level} Locked</span>
              ) : mode === 'ai_agent' ? (
                <span className="flex items-center gap-2"><HiLightningBolt /> Start AI Interview</span>
              ) : mode === 'interview_team' ? (
                <span className="flex items-center gap-2">🎥 Schedule Team Interview</span>
              ) : (
                '🚀 Start Interview'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tracker Required Prompt Modal */}
      <TrackerRequiredModal
        isOpen={showTrackerModal}
        onClose={() => setShowTrackerModal(false)}
        onSuccess={executeStart}
      />

      {/* Camera & Microphone Diagnostic Modal */}
      <MediaDeviceTroubleshootModal
        isOpen={showDeviceModal}
        onClose={() => setShowDeviceModal(false)}
      />
    </div>
  );
}
