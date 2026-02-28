import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  HiAcademicCap, HiClock, HiCheckCircle, HiChip,
  HiUserGroup, HiLightningBolt, HiInformationCircle,
} from 'react-icons/hi';

const STACKS = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
  'Python', 'Java', 'PHP', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Go', 'C#',
];

const LEVEL_DESCRIPTIONS = {
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
    description: 'Live voice conversation with an AI interviewer powered by Gemini. Dynamic follow-ups, coding challenges.',
    color: 'from-violet-900/50 to-violet-800/30',
    border: 'border-violet-500',
    iconColor: 'text-violet-400',
    badge: 'LIVE',
  },
  {
    id: 'interview_team',
    label: 'Interview Team',
    icon: HiUserGroup,
    description: 'A panel of interviewers will review your profile and conduct a scheduled session.',
    color: 'from-cyan-900/50 to-cyan-800/30',
    border: 'border-cyan-500',
    iconColor: 'text-cyan-400',
    badge: 'Coming Soon',
  },
];

export default function InterviewStart() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('standard');
  const [level, setLevel] = useState(1);
  const [stack, setStack] = useState('');
  const [eligibility, setEligibility] = useState(null);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    api.get('/admin/levels').then(({ data }) => setLevels(data.levels || []));
  }, []);

  useEffect(() => {
    if (level && mode === 'standard') {
      setEligibility(null);
      api.get(`/interviews/eligibility/${level}`).then(({ data }) => setEligibility(data)).catch(() => {});
    } else if (mode === 'ai_agent') {
      setEligibility({ eligible: true });
    }
  }, [level, mode]);

  const handleStart = async () => {
    if (!stack) return toast.error('Please select a tech stack');
    if (mode === 'interview_team') {
      toast('Interview Team mode is coming soon!', { icon: '🔜' });
      return;
    }
    if (mode === 'standard' && !eligibility?.eligible) {
      return toast.error(eligibility?.reason || 'Not eligible');
    }
    setStarting(true);
    try {
      if (mode === 'ai_agent') {
        const { data } = await api.post('/interviews/ai-agent/start', { level, stack });
        toast.success('AI Agent interview started! 🤖');
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

  const levelConfig = levels.find((l) => l.level === level);
  const levelDesc = LEVEL_DESCRIPTIONS[level];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Start Interview</h1>
        <p className="text-gray-400 mt-1">Choose your interview mode, level, and tech stack</p>
      </div>

      {/* Mode selector */}
      <div className="card mb-6">
        <h2 className="section-title mb-4">Select Interview Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INTERVIEW_MODES.map((m) => {
            const Icon = m.icon;
            const isSelected = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? `${m.border} bg-gradient-to-br ${m.color}`
                    : 'border-dark-border hover:border-gray-600 bg-dark-800/50'
                }`}
              >
                {m.badge && (
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.badge === 'LIVE' ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300'
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

      {/* Level selector */}
      <div className="card mb-6">
        <h2 className="section-title">Select Interview Level</h2>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[1, 2, 3].map((lvl) => {
            const desc = LEVEL_DESCRIPTIONS[lvl];
            return (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  level === lvl ? `${desc.border} ${desc.bg}` : 'border-dark-border hover:border-primary-700'
                }`}
              >
                <HiAcademicCap className={`w-6 h-6 mx-auto mb-2 ${level === lvl ? desc.color : 'text-gray-400'}`} />
                <div className={`font-bold text-sm ${level === lvl ? 'text-white' : 'text-gray-300'}`}>Level {lvl}</div>
                <div className="text-xs text-gray-500 mt-1">{desc.label}</div>
              </button>
            );
          })}
        </div>

        {/* Level specification */}
        {levelDesc && (
          <div className={`p-4 rounded-lg border ${levelDesc.border} ${levelDesc.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <HiInformationCircle className={`w-4 h-4 ${levelDesc.color}`} />
              <span className={`text-sm font-semibold ${levelDesc.color}`}>{levelDesc.label} Level — What you'll be tested on:</span>
            </div>
            <p className="text-gray-400 text-xs mb-3">{levelDesc.description}</p>
            <div className="flex flex-wrap gap-2">
              {levelDesc.topics.map((topic) => (
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

      {/* Eligibility check (standard mode only) */}
      {mode === 'standard' && eligibility && (
        <div className={`card mb-6 border-2 ${eligibility.eligible ? 'border-accent-500/40 bg-emerald-900/10' : 'border-danger-500/40 bg-red-900/10'}`}>
          <div className="flex items-center gap-3">
            {eligibility.eligible
              ? <HiCheckCircle className="w-6 h-6 text-accent-400" />
              : <div className="w-6 h-6 rounded-full border-2 border-danger-400 flex items-center justify-center text-danger-400 text-xs font-bold">✗</div>}
            <div>
              <p className={`font-medium ${eligibility.eligible ? 'text-accent-400' : 'text-danger-400'}`}>
                {eligibility.eligible ? 'You are eligible for this level' : 'Not eligible'}
              </p>
              {!eligibility.eligible && <p className="text-gray-400 text-sm">{eligibility.reason}</p>}
              {eligibility.eligible && eligibility.attemptsToday != null && (
                <p className="text-gray-400 text-sm">{eligibility.attemptsToday}/{eligibility.maxAttemptsPerDay} attempts used today</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stack selector */}
      <div className="card mb-6">
        <h2 className="section-title">Select Tech Stack</h2>
        <p className="text-sm text-gray-400 mb-4">Choose the technology you want to be interviewed on</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {STACKS.map((s) => (
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
      </div>

      {/* Start button */}
      <div className="card bg-gradient-to-r from-primary-900/40 to-dark-card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-white font-semibold">
              {mode === 'ai_agent' ? '🤖 Ready to talk to the AI Interviewer?' : mode === 'interview_team' ? '👥 Interview Team Mode' : '🚀 Ready to begin?'}
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
              <HiClock />
              {mode === 'ai_agent'
                ? 'AI will ask questions via voice. You reply via voice or code.'
                : mode === 'interview_team'
                ? 'Coming soon — team-based panel interviews.'
                : 'Timer starts once you click start'}
            </p>
          </div>
          <button
            onClick={handleStart}
            disabled={starting || !stack || (mode === 'standard' && !eligibility?.eligible)}
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
              '🔜 Coming Soon'
            ) : (
              '🚀 Start Interview'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
