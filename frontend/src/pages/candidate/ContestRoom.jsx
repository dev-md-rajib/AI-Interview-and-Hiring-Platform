import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiClock, HiCheckCircle, HiXCircle, HiPlay, HiPaperAirplane, HiExclamationCircle } from 'react-icons/hi';

// ─── Timer ────────────────────────────────────────────────────────────────────
function useCountdown(limitMinutes, startedAt) {
  const [remaining, setRemaining] = useState(null);
  useEffect(() => {
    if (!startedAt || !limitMinutes) return;
    const deadline = new Date(startedAt).getTime() + limitMinutes * 60 * 1000;
    const tick = () => setRemaining(Math.max(0, Math.floor((deadline - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [limitMinutes, startedAt]);
  return remaining;
}

function Timer({ seconds, label }) {
  const m = Math.floor((seconds ?? 0) / 60), s = (seconds ?? 0) % 60;
  const urgent = seconds !== null && seconds < 300;
  return (
    <div className={`flex items-center gap-1.5 text-sm font-mono font-bold ${urgent ? 'text-danger-400 animate-pulse' : 'text-primary-300'}`}>
      <HiClock className="w-4 h-4" />
      {label && <span className="text-gray-400 font-normal font-sans mr-1">{label}</span>}
      {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
    </div>
  );
}

// ─── MCQ Phase ────────────────────────────────────────────────────────────────
function McqPhase({ contest, submission, onDone }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const countdown = useCountdown(contest.mcqRound?.timeLimitMinutes, submission?.mcqStartedAt);
  const questions = contest.mcqRound?.questions || [];

  // Auto-submit when time runs out
  useEffect(() => { if (countdown === 0) handleSubmit(); }, [countdown]);

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload = questions.map((_, i) => ({ questionIndex: i, selectedOption: answers[i] || null }));
      const { data } = await api.post(`/contests/${contest._id}/submit-mcq`, { answers: payload });
      if (data.passed) { toast.success(`MCQ Passed! (${data.mcqPct}%) — Unlocking Coding Round`); }
      else { toast.error(`MCQ Failed (${data.mcqPct}% < ${contest.mcqRound.passThreshold}% required)`); }
      onDone(data);
    } catch (e) { toast.error(e.response?.data?.message || 'Submit failed'); setSubmitting(false); }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="card mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">{contest.title} — MCQ Round</h2>
          <p className="text-gray-400 text-sm">{questions.length} questions · Pass threshold: {contest.mcqRound?.passThreshold}%</p>
        </div>
        {countdown !== null && <Timer seconds={countdown} label="Time left" />}
      </div>

      <div className="space-y-4 mb-6">
        {questions.map((q, i) => (
          <div key={i} className="card">
            <div className="flex items-start gap-3 mb-3">
              <span className="badge-primary mt-0.5">Q{i + 1}</span>
              <p className="text-white leading-relaxed flex-1">{q.text}</p>
              <span className="text-gray-500 text-xs whitespace-nowrap">{q.marks} pt{q.marks !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                opt ? (
                  <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${answers[i] === opt ? 'border-primary-500 bg-primary-900/30' : 'border-dark-border hover:border-gray-500'}`}>
                    <input type="radio" name={`q${i}`} value={opt} checked={answers[i] === opt} onChange={() => setAnswers(a => ({ ...a, [i]: opt }))} className="accent-primary-500" />
                    <span className="text-gray-200 text-sm">{String.fromCharCode(65 + oi)}. {opt}</span>
                  </label>
                ) : null
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
        <HiPaperAirplane />{submitting ? 'Submitting...' : 'Submit MCQ Answers'}
      </button>
    </div>
  );
}

// ─── Coding Phase ─────────────────────────────────────────────────────────────
function CodingPhase({ contest, submission, setSubmission }) {
  const navigate = useNavigate();
  const questions = contest.codingRound?.questions || [];
  const [selectedQ, setSelectedQ] = useState(0);
  const [codes, setCodes] = useState({});
  const [langs, setLangs] = useState({});
  const [runResults, setRunResults] = useState({});
  const [running, setRunning] = useState(false);
  const [submittingQ, setSubmittingQ] = useState(false);
  const [finalSubmitting, setFinalSubmitting] = useState(false);
  const [solved, setSolved] = useState({});
  const countdown = useCountdown(contest.codingRound?.timeLimitMinutes, submission?.codingStartedAt);

  // Restore submission state
  useEffect(() => {
    if (submission?.codingAnswers) {
      const s = {};
      submission.codingAnswers.forEach(a => { if (a.solved) s[a.questionIndex] = true; });
      setSolved(s);
    }
  }, []);

  // Auto final-submit when time is up
  useEffect(() => { if (countdown === 0) handleFinalSubmit(); }, [countdown]);

  const q = questions[selectedQ];
  const allowedLangs = q?.allowedLanguages || ['javascript'];
  const lang = langs[selectedQ] || allowedLangs[0] || 'javascript';
  const code = codes[selectedQ] || '';

  const handleRun = async () => {
    if (!code.trim()) return toast.error('Write some code first');
    setRunning(true);
    try {
      const { data } = await api.post(`/contests/${contest._id}/run-code`, { questionIndex: selectedQ, code, language: lang });
      setRunResults(r => ({ ...r, [selectedQ]: data.results }));
    } catch (e) { toast.error(e.response?.data?.message || 'Run failed'); }
    finally { setRunning(false); }
  };

  const handleSubmitProblem = async () => {
    if (!code.trim()) return toast.error('Write some code first');
    setSubmittingQ(true);
    try {
      const { data } = await api.post(`/contests/${contest._id}/submit-coding`, { questionIndex: selectedQ, code, language: lang });
      setRunResults(r => ({ ...r, [selectedQ]: data.results }));
      if (data.allPassed) {
        setSolved(s => ({ ...s, [selectedQ]: true }));
        toast.success(`Problem ${selectedQ + 1} Accepted! +${data.marksGained} pts`);
      } else {
        toast.error(`Wrong Answer — ${data.results.filter(r => !r.passed).length} test case(s) failed`);
      }
      setSubmission(data.submission);
    } catch (e) { toast.error(e.response?.data?.message || 'Submit failed'); }
    finally { setSubmittingQ(false); }
  };

  const handleFinalSubmit = async () => {
    if (finalSubmitting) return;
    setFinalSubmitting(true);
    try {
      await api.post(`/contests/${contest._id}/final-submit`);
      toast.success('Contest submitted successfully!');
      navigate('/candidate/contests');
    } catch (e) { toast.error(e.response?.data?.message || 'Submit failed'); setFinalSubmitting(false); }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] gap-0 animate-fade-in overflow-hidden">
      {/* Left sidebar — problem list */}
      <div className="w-48 bg-dark-card border-r border-dark-border flex flex-col shrink-0">
        <div className="p-3 border-b border-dark-border">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Problems</p>
          {countdown !== null && <Timer seconds={countdown} />}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {questions.map((q, i) => (
            <button key={i} onClick={() => setSelectedQ(i)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${selectedQ === i ? 'bg-primary-700 text-white' : 'text-gray-400 hover:bg-dark-800 hover:text-white'}`}>
              <span>P{i + 1} <span className="text-xs opacity-70">({q.marks || 1}pt)</span></span>
              {solved[i] ? <HiCheckCircle className="w-4 h-4 text-emerald-400" /> : null}
            </button>
          ))}
        </div>
        <div className="p-2 border-t border-dark-border">
          <button onClick={() => { if (window.confirm('Submit all and end the contest?')) handleFinalSubmit(); }}
            disabled={finalSubmitting} className="btn-primary w-full text-xs py-2">
            {finalSubmitting ? 'Submitting...' : 'Final Submit'}
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Problem statement */}
        <div className="border-b border-dark-border bg-dark-card overflow-y-auto" style={{ maxHeight: '35%' }}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold">Problem {selectedQ + 1}</h3>
              <span className="badge-primary">{q?.marks || 1} pt{(q?.marks || 1) !== 1 ? 's' : ''}</span>
            </div>
            <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans leading-relaxed">{q?.text}</pre>

            {/* Visible test cases */}
            {q?.testCases?.filter(tc => !tc.hidden).map((tc, ti) => (
              <div key={ti} className="mt-3 bg-dark-800 rounded-lg p-3 text-xs font-mono">
                <p className="text-gray-500 mb-1">Sample {ti + 1}:</p>
                {tc.input && <p className="text-gray-300"><span className="text-gray-500">Input: </span>{tc.input}</p>}
                <p className="text-gray-300"><span className="text-gray-500">Output: </span>{tc.expectedOutput}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Code editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-2 border-b border-dark-border bg-dark-800">
            <select value={lang} onChange={e => setLangs(l => ({ ...l, [selectedQ]: e.target.value }))}
              className="bg-dark-card border border-dark-border rounded px-2 py-1 text-sm text-gray-200 focus:outline-none focus:border-primary-500">
              {allowedLangs.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <div className="flex-1" />
            {solved[selectedQ] && <span className="text-emerald-400 text-sm flex items-center gap-1"><HiCheckCircle />Accepted</span>}
            <button onClick={handleRun} disabled={running}
              className="btn-secondary text-sm py-1 px-3 flex items-center gap-1">
              <HiPlay className="w-3.5 h-3.5" />{running ? 'Running...' : 'Run'}
            </button>
            <button onClick={handleSubmitProblem} disabled={submittingQ || solved[selectedQ]}
              className="btn-primary text-sm py-1 px-3 flex items-center gap-1">
              <HiPaperAirplane className="w-3.5 h-3.5" />{submittingQ ? 'Checking...' : solved[selectedQ] ? 'Solved ✓' : 'Submit'}
            </button>
          </div>

          <textarea
            className="flex-1 bg-dark-900 text-gray-100 font-mono text-sm p-4 resize-none focus:outline-none border-b border-dark-border"
            placeholder={lang === 'javascript' ? '// Write your JavaScript solution here\n// Use readline() to read input\nconsole.log("Hello, World!");' : '# Write your Python solution here\n# Use input() to read input\nprint("Hello, World!")'}
            value={code}
            onChange={e => setCodes(c => ({ ...c, [selectedQ]: e.target.value }))}
            spellCheck={false}
          />

          {/* Test results */}
          {runResults[selectedQ] && (
            <div className="border-t border-dark-border bg-dark-800 p-3 max-h-40 overflow-y-auto">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Test Results</p>
              <div className="space-y-1.5">
                {runResults[selectedQ].map((r, i) => (
                  <div key={i} className={`flex items-start gap-2 text-xs rounded p-2 ${r.passed ? 'bg-emerald-900/30' : 'bg-red-900/30'}`}>
                    {r.passed ? <HiCheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" /> : <HiXCircle className="w-4 h-4 text-danger-400 mt-0.5 shrink-0" />}
                    <div className="font-mono flex-1 min-w-0">
                      {r.input && r.input !== '(hidden)' && <span className="text-gray-400">In: {r.input} </span>}
                      <span className="text-gray-300">Expected: <span className="text-emerald-300">{r.expected !== '(hidden)' ? r.expected : '(hidden)'}</span></span>
                      {!r.passed && r.actual && <span className="text-danger-300"> Got: {r.actual}</span>}
                      {r.executionTime > 0 && <span className="text-gray-600 ml-2">{r.executionTime}ms</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main ContestRoom ─────────────────────────────────────────────────────────
export default function ContestRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState(null); // mcq | coding | done | failed_mcq

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { contest: c } } = await api.get(`/contests/${id}`);
        setContest(c);
        if (c.status !== 'active') { toast.error('Contest is not active'); navigate('/candidate/contests'); return; }

        // Join (idempotent)
        const { data: { submission: sub } } = await api.post(`/contests/${id}/join`);
        setSubmission(sub);

        if (sub.verdict === 'failed_mcq') { setPhase('failed_mcq'); }
        else if (sub.verdict === 'passed') { setPhase('done'); }
        else if (sub.currentRound === 'coding') { setPhase('coding'); }
        else { setPhase(c.mcqRound?.enabled ? 'mcq' : 'coding'); }
      } catch (e) { toast.error(e.response?.data?.message || 'Failed to load contest'); navigate('/candidate/contests'); }
      finally { setLoading(false); }
    };
    init();
  }, [id]);

  const handleMcqDone = (data) => {
    setSubmission(data.submission);
    if (data.passed) { setPhase('coding'); }
    else { setPhase('failed_mcq'); }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;

  if (phase === 'failed_mcq') return (
    <div className="max-w-md mx-auto mt-20 card text-center animate-fade-in">
      <HiExclamationCircle className="w-16 h-16 text-danger-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">MCQ Round Failed</h2>
      <p className="text-gray-400 mb-2">You scored {submission?.mcqPct}% — required {contest?.mcqRound?.passThreshold}% to proceed.</p>
      <p className="text-gray-500 text-sm mb-6">You did not qualify for the Coding Round.</p>
      <button onClick={() => navigate('/candidate/contests')} className="btn-secondary">Back to Contests</button>
    </div>
  );

  if (phase === 'done') return (
    <div className="max-w-md mx-auto mt-20 card text-center animate-fade-in">
      <HiCheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Already Submitted</h2>
      <p className="text-gray-400 mb-6">You have already submitted your contest answers.</p>
      <button onClick={() => navigate('/candidate/contests')} className="btn-secondary">Back to Contests</button>
    </div>
  );

  if (!contest || !submission) return null;

  return (
    <div>
      {phase === 'mcq' && <McqPhase contest={contest} submission={submission} onDone={handleMcqDone} />}
      {phase === 'coding' && <CodingPhase contest={contest} submission={submission} setSubmission={setSubmission} />}
    </div>
  );
}
