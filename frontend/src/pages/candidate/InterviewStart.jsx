import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { HiAcademicCap, HiClock, HiCheckCircle } from 'react-icons/hi';

const STACKS = ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'PHP', 'SQL', 'MongoDB', 'Docker', 'AWS', 'Go', 'C#'];

export default function InterviewStart() {
  const navigate = useNavigate();
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
    if (level) {
      setEligibility(null);
      api.get(`/interviews/eligibility/${level}`).then(({ data }) => setEligibility(data)).catch(() => {});
    }
  }, [level]);

  const handleStart = async () => {
    if (!stack) return toast.error('Please select a tech stack');
    if (!eligibility?.eligible) return toast.error(eligibility?.reason || 'Not eligible');
    setStarting(true);
    try {
      const { data } = await api.post('/interviews/start', { level, stack });
      toast.success('Interview started! Good luck 🚀');
      navigate(`/candidate/interview/${data.interviewId}`, { state: { interview: data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setStarting(false);
    }
  };

  const levelConfig = levels.find((l) => l.level === level);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Start AI Interview</h1>
        <p className="text-gray-400 mt-1">Select your level and preferred tech stack to begin</p>
      </div>

      {/* Level selector */}
      <div className="card mb-6">
        <h2 className="section-title">Select Interview Level</h2>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${level === lvl ? 'border-primary-500 bg-primary-900/30' : 'border-dark-border hover:border-primary-700'}`}
            >
              <HiAcademicCap className={`w-6 h-6 mx-auto mb-2 ${level === lvl ? 'text-primary-400' : 'text-gray-400'}`} />
              <div className={`font-bold ${level === lvl ? 'text-white' : 'text-gray-300'}`}>Level {lvl}</div>
              <div className="text-xs text-gray-500 mt-1">{lvl === 1 ? 'Junior' : lvl === 2 ? 'Mid' : 'Senior'}</div>
            </button>
          ))}
        </div>

        {/* Level info */}
        {levelConfig && (
          <div className="mt-4 p-4 bg-dark-800 rounded-lg border border-dark-border">
            <div className="grid grid-cols-3 gap-4 text-sm text-center">
              <div><p className="text-gray-400">Duration</p><p className="text-white font-medium">{levelConfig.durationMinutes} min</p></div>
              <div><p className="text-gray-400">Questions</p><p className="text-white font-medium">{levelConfig.questionCount}</p></div>
              <div><p className="text-gray-400">Pass Score</p><p className="text-white font-medium">{levelConfig.minimumPassScore}%</p></div>
            </div>
          </div>
        )}
      </div>

      {/* Eligibility check */}
      {eligibility && (
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
              {eligibility.eligible && <p className="text-gray-400 text-sm">{eligibility.attemptsToday}/{eligibility.maxAttemptsPerDay} attempts used today</p>}
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
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${stack === s ? 'border-primary-500 bg-primary-900/40 text-primary-300' : 'border-dark-border text-gray-400 hover:border-primary-700 hover:text-white'}`}
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
            <p className="text-white font-semibold">Ready to begin?</p>
            <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
              <HiClock /> Timer starts once you click start
            </p>
          </div>
          <button
            onClick={handleStart}
            disabled={starting || !stack || !eligibility?.eligible}
            className="btn-primary px-8 py-3 text-base disabled:opacity-50"
          >
            {starting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Preparing...
              </span>
            ) : '🚀 Start Interview'}
          </button>
        </div>
      </div>
    </div>
  );
}
