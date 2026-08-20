import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  HiAcademicCap, HiClock, HiCheckCircle, HiChip,
  HiUserGroup, HiLightningBolt, HiInformationCircle, HiCode, HiBriefcase,
} from 'react-icons/hi';
import { SECTORS, TECH_STACKS, getSectorById, isSector, SECTOR_LEVEL_DESCRIPTIONS } from '../../constants/sectors';

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
  const [eligibility, setEligibility] = useState(null);
  const [activeTeamInterview, setActiveTeamInterview] = useState(null);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);

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

  // Check eligibility based on mode
  useEffect(() => {
    setEligibility(null);
    if (mode === 'standard') {
      setEligibility({ eligible: true });
    } else if (mode === 'ai_agent' || mode === 'interview_team') {
      if (level === 1) {
        setEligibility({ eligible: true });
      } else {
        api.get(`/team-interviews/eligibility?level=${level}`)
          .then(({ data }) => setEligibility(data))
          .catch(() => setEligibility({ eligible: true }));
      }
    }
  }, [level, mode]);

  const handleModeClick = (selectedMode) => {
    if (selectedMode === 'interview_team' && activeTeamInterview) {
      navigate('/candidate/interview/team');
      return;
    }
    setMode(selectedMode);
  };

  const handleStart = async () => {
    if (mode === 'interview_team') {
      if (activeTeamInterview) {
        navigate('/candidate/interview/team');
        return;
      }
      if (!stack) return toast.error(`Please select a ${interviewType === 'business' ? 'sector' : 'tech stack'}`);
      navigate('/candidate/interview/team', { state: { stack, level, interviewType } });
      return;
    }
    if (!stack) return toast.error(`Please select a ${interviewType === 'business' ? 'sector' : 'tech stack'}`);
    if (mode === 'standard' && !eligibility?.eligible) {
      return toast.error(eligibility?.reason || 'Not eligible');
    }
    setStarting(true);
    try {
      if (mode === 'ai_agent') {
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
                    : 'border-dark-border hover:border-gray-600 bg-dark-800/50'
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
                <div className={`font-bold text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{m.label}</div>
                <div className="text-xs text-gray-400 leading-snug">{m.description}</div>
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
                ? 'border-primary-500 bg-primary-900/30'
                : 'border-dark-border hover:border-gray-600 bg-dark-800/50'
            }`}
          >
            <HiCode className={`w-6 h-6 flex-shrink-0 ${interviewType === 'tech' ? 'text-primary-400' : 'text-gray-400'}`} />
            <div>
              <div className={`font-bold text-sm ${interviewType === 'tech' ? 'text-white' : 'text-gray-300'}`}>Tech Stack</div>
              <div className="text-xs text-gray-400">Software, programming, engineering</div>
            </div>
          </button>
          <button
            onClick={() => setInterviewType('business')}
            className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
              interviewType === 'business'
                ? 'border-amber-500 bg-amber-900/20'
                : 'border-dark-border hover:border-gray-600 bg-dark-800/50'
            }`}
          >
            <HiBriefcase className={`w-6 h-6 flex-shrink-0 ${interviewType === 'business' ? 'text-amber-400' : 'text-gray-400'}`} />
            <div>
              <div className={`font-bold text-sm ${interviewType === 'business' ? 'text-white' : 'text-gray-300'}`}>Business Sector</div>
              <div className="text-xs text-gray-400">Marketing, Sales, HR, Finance, and more</div>
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
                      ? 'border-primary-500 bg-primary-900/40 text-primary-300'
                      : 'border-dark-border text-gray-400 hover:border-primary-700 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {stack && <p className="mt-3 text-sm text-accent-400">Selected: <span className="font-semibold">{stack}</span></p>}
          </>
        )}

        {/* Business Sector Picker */}
        {interviewType === 'business' && (
          <>
            <p className="text-sm text-gray-400 mb-3">Choose the business sector you want to be interviewed on</p>
            {mode === 'ai_agent' && (
              <div className="mb-4 p-3 rounded-lg bg-amber-900/10 border border-amber-500/30 text-xs text-amber-300">
                🎙️ Business sector AI interviews are <strong>entirely voice/scenario-based</strong> — no coding challenges. The AI adapts its persona based on the sector (e.g., acts as a customer for Sales).
              </div>
            )}
            {mode === 'interview_team' && (
              <div className="mb-4 p-3 rounded-lg bg-cyan-900/10 border border-cyan-500/30 text-xs text-cyan-300">
                👥 In Business Sector team interviews, an expert human interviewer matching this business domain will conduct your live Zoom session.
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SECTORS.map((sector) => {
                const isSelected = stack === sector.id;
                return (
                  <button
                    key={sector.id}
                    onClick={() => setStack(sector.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all group ${
                      isSelected
                        ? `${sector.border} ${sector.bg}`
                        : 'border-dark-border hover:border-gray-500 bg-dark-800/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{sector.icon}</div>
                    <div className={`font-semibold text-xs leading-tight ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {sector.label}
                    </div>
                  </button>
                );
              })}
            </div>
            {stack && selectedSector && (
              <p className="mt-3 text-sm flex items-center gap-2">
                <span>{selectedSector.icon}</span>
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
            return (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  level === lvl ? `${colors.border} ${colors.bg}` : 'border-dark-border hover:border-primary-700'
                }`}
              >
                <HiAcademicCap className={`w-6 h-6 mx-auto mb-2 ${level === lvl ? colors.color : 'text-gray-400'}`} />
                <div className={`font-bold text-sm ${level === lvl ? 'text-white' : 'text-gray-300'}`}>Level {lvl}</div>
                <div className="text-xs text-gray-500 mt-1">{LEVEL_LABELS[lvl]}</div>
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
                <p className="text-gray-300 text-xs italic">"{sectorLevelDesc.scenario}"</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {sectorLevelDesc.topics.map((topic) => (
                <span key={topic} className="text-xs px-2 py-1 rounded-md bg-dark-800 text-gray-300 border border-dark-border">
                  {topic}
                </span>
              ))}
            </div>
            {levelConfig && (
              <div className="grid grid-cols-3 gap-4 text-sm text-center mt-4 pt-4 border-t border-dark-border">
                <div><p className="text-gray-400 text-xs">Duration</p><p className="text-white font-medium">{levelConfig.durationMinutes} min</p></div>
                <div><p className="text-gray-400 text-xs">Questions</p><p className="text-white font-medium">{levelConfig.questionCount}</p></div>
                <div><p className="text-gray-400 text-xs">Pass Score</p><p className="text-white font-medium">{levelConfig.minimumPassScore}%</p></div>
              </div>
            )}
          </div>
        ) : techLevelDesc && (
          <div className={`p-4 rounded-lg border ${techLevelDesc.border} ${techLevelDesc.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <HiInformationCircle className={`w-4 h-4 ${techLevelDesc.color}`} />
              <span className={`text-sm font-semibold ${techLevelDesc.color}`}>{techLevelDesc.label} Level — What you'll be tested on:</span>
            </div>
            <p className="text-gray-400 text-xs mb-3">{techLevelDesc.description}</p>
            <div className="flex flex-wrap gap-2">
              {techLevelDesc.topics.map((topic) => (
                <span key={topic} className="text-xs px-2 py-1 rounded-md bg-dark-800 text-gray-300 border border-dark-border">
                  {topic}
                </span>
              ))}
            </div>
            {levelConfig && (
              <div className="grid grid-cols-3 gap-4 text-sm text-center mt-4 pt-4 border-t border-dark-border">
                <div><p className="text-gray-400 text-xs">Duration</p><p className="text-white font-medium">{levelConfig.durationMinutes} min</p></div>
                <div><p className="text-gray-400 text-xs">Questions</p><p className="text-white font-medium">{levelConfig.questionCount}</p></div>
                <div><p className="text-gray-400 text-xs">Pass Score</p><p className="text-white font-medium">{levelConfig.minimumPassScore}%</p></div>
              </div>
            )}
          </div>
        )}
      </div>

      {mode === 'interview_team' && (
        <div className="card mb-6 border border-cyan-500/30 bg-cyan-900/10">
          <p className="text-cyan-300 font-semibold text-sm">🎥 How Interview Team Works</p>
          <ul className="mt-2 space-y-1 text-xs text-gray-400">
            <li>• You'll be matched with a real human interviewer</li>
            <li>• A Zoom meeting is automatically created for your session</li>
            <li>• You receive a 2-minute notification before it starts ⏰</li>
            <li>• You can only have one team interview queued at a time</li>
            <li>• Must pass previous levels sequentially (Level 1 → 2 → 3) 🔒</li>
            <li>• A passed Zoom interview shows as top priority on your profile 🏆</li>
          </ul>
        </div>
      )}

      {mode === 'ai_agent' && (
        <div className="card mb-6 border border-violet-500/30 bg-violet-900/10">
          <p className="text-violet-300 font-semibold text-sm">🤖 How AI Agent Interview Works</p>
          <ul className="mt-2 space-y-1 text-xs text-gray-400">
            <li>• A live voice AI (powered by Gemini) asks you questions</li>
            <li>• Dynamic follow-ups based on your answers</li>
            {interviewType === 'tech'
              ? <li>• Coding challenges may be included 💻</li>
              : <li>• Scenario-based voice conversation — no coding 🎙️</li>
            }
            {interviewType === 'business' && (
              <li>• For Sales & Customer Service, the AI acts as a real customer 👥</li>
            )}
            <li>• Must pass previous levels sequentially (Level 1 → 2 → 3) 🔒</li>
          </ul>
        </div>
      )}

      {(mode === 'standard' || mode === 'ai_agent' || mode === 'interview_team') && eligibility && (
        <div className={`card mb-6 border-2 ${
          eligibility.eligible
            ? 'border-accent-500/40 bg-emerald-900/10'
            : 'border-danger-500/40 bg-red-900/10'
        }`}>
          <div className="flex items-center gap-3">
            {eligibility.eligible
              ? <HiCheckCircle className="w-6 h-6 text-accent-400" />
              : <div className="w-6 h-6 rounded-full border-2 border-danger-400 flex items-center justify-center text-danger-400 text-xs font-bold">✗</div>}
            <div>
              <p className={`font-medium ${eligibility.eligible ? 'text-accent-400' : 'text-danger-400'}`}>
                {eligibility.eligible
                  ? mode === 'standard'
                    ? '✅ Open to all — Standard level has no prerequisites'
                    : '✅ You are eligible for this level'
                  : '🔒 Level locked'}
              </p>
              {!eligibility.eligible && <p className="text-gray-400 text-sm mt-0.5">{eligibility.reason}</p>}
              {eligibility.eligible && eligibility.attemptsToday != null && (
                <p className="text-gray-400 text-sm">{eligibility.attemptsToday}/{eligibility.maxAttemptsPerDay} attempts used today</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="card bg-gradient-to-r from-primary-900/40 to-dark-card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white font-semibold">
              {mode === 'ai_agent' ? '🤖 Ready to talk to the AI Interviewer?' : mode === 'interview_team' ? '👥 Interview Team Mode' : '🚀 Ready to begin?'}
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
              <HiClock />
              {mode === 'ai_agent'
                ? interviewType === 'business'
                  ? 'AI will conduct a voice scenario interview tailored to your sector.'
                  : 'AI will ask questions via voice. You reply via voice or code.'
                : mode === 'interview_team'
                ? 'Click to schedule your session — a Zoom link will be auto-created.'
                : 'Timer starts once you click start'}
            </p>
          </div>
          <button
            onClick={handleStart}
            disabled={
              starting ||
              (mode !== 'interview_team' && !stack) ||
              (mode !== 'standard' && eligibility && !eligibility.eligible)
            }
            className={`px-8 py-3 text-base rounded-xl font-bold transition-all disabled:opacity-50 ${
              mode === 'ai_agent'
                ? 'bg-violet-600 hover:bg-violet-700 text-white'
                : mode === 'interview_team'
                ? 'bg-cyan-700 hover:bg-cyan-600 text-white'
                : 'btn-primary'
            }`}
          >
            {starting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {mode === 'ai_agent' ? 'Connecting...' : 'Preparing...'}
              </span>
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
  );
}
