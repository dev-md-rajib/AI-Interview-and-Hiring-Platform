import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  HiMicrophone, HiVolumeUp, HiCode, HiCheckCircle, HiXCircle,
  HiClock, HiChartBar, HiStop, HiPlay, HiRefresh,
} from 'react-icons/hi';

/* ─── Helpers ─────────────────────────────────────────────── */
function formatTime(s) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function useSpeechSynthesis() {
  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.volume = 1;
    // Prefer a natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => v.lang === 'en-US' && v.name.includes('Google'))
      || voices.find((v) => v.lang === 'en-US')
      || voices[0];
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.speak(utter);
  }, []);
  const stop = useCallback(() => window.speechSynthesis?.cancel(), []);
  return { speak, stop };
}

function useSpeechRecognition({ onResult, onEnd }) {
  const recognitionRef = useRef(null);

  const start = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser. Please use Chrome.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };
    recognition.onend = () => onEnd?.();
    recognition.onerror = (e) => {
      if (e.error !== 'no-speech') toast.error(`Mic error: ${e.error}`);
      onEnd?.();
    };
    recognition.start();
    recognitionRef.current = recognition;
  }, [onResult, onEnd]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  return { start, stop };
}

/* ─── Verdict Component ─────────────────────────────────────── */
function VerdictCard({ result, onRetry }) {
  return (
    <div className="max-w-2xl mx-auto animate-slide-up space-y-6">
      <div className={`card text-center border-2 ${result.passed ? 'border-accent-500/40 bg-emerald-900/10' : 'border-danger-500/40 bg-red-900/10'}`}>
        {result.passed ? <HiCheckCircle className="w-16 h-16 text-accent-400 mx-auto mb-3" /> : <HiXCircle className="w-16 h-16 text-danger-400 mx-auto mb-3" />}
        <h1 className="text-3xl font-bold text-white">{result.passed ? '🎉 Interview Passed!' : '❌ Interview Failed'}</h1>
        <p className="text-gray-400 mt-1">{result.stack} • Level {result.level} • AI Agent Interview</p>
        <div className="mt-6">
          <div className="text-6xl font-black text-gradient">{result.totalScore}%</div>
          <p className="text-gray-400 text-sm mt-1">Overall Score (Pass mark: {result.passMark}%)</p>
        </div>
        {/* Coding vs Concept score breakdown */}
        {(result.codingScore != null || result.conceptScore != null) && (
          <div className="mt-5 grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="p-3 rounded-lg bg-violet-900/30 border border-violet-500/30">
              <p className="text-xs text-violet-300 mb-1">💻 Coding</p>
              <p className="text-2xl font-bold text-white">{result.codingScore ?? '—'}%</p>
            </div>
            <div className="p-3 rounded-lg bg-primary-900/30 border border-primary-500/30">
              <p className="text-xs text-primary-300 mb-1">🧠 Concepts</p>
              <p className="text-2xl font-bold text-white">{result.conceptScore ?? '—'}%</p>
            </div>
          </div>
        )}
      </div>

      {result.feedback && (
        <div className="card">
          <h2 className="section-title">AI Feedback</h2>
          <p className="text-gray-300 leading-relaxed">{result.feedback}</p>
          {result.recommendations && (
            <div className="mt-3 p-3 bg-dark-800 rounded-lg border border-dark-border">
              <p className="text-primary-300 text-sm"><span className="font-semibold">Recommendations: </span>{result.recommendations}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.strengths?.length > 0 && (
          <div className="card">
            <h3 className="text-accent-400 font-semibold mb-3">✅ Strengths</h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-accent-400">•</span>{s}</li>)}
            </ul>
          </div>
        )}
        {result.weaknesses?.length > 0 && (
          <div className="card">
            <h3 className="text-danger-400 font-semibold mb-3">⚠️ Areas to Improve</h3>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-danger-400">•</span>{w}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-4 flex-wrap">
        <button onClick={onRetry} className="btn-primary flex items-center gap-2 flex-1 justify-center">
          <HiRefresh /> Try Again
        </button>
        <a href="/candidate/history" className="btn-secondary flex-1 text-center py-2 flex items-center justify-center gap-2">
          <HiChartBar /> View History
        </a>
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────── */
export default function AIAgentInterviewRoom() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const initData = state?.interview;

  // Interview state
  const [transcript, setTranscript] = useState([]);
  const [currentMsg, setCurrentMsg] = useState(null); // { message, isCodingQuestion, questionNumber, totalQuestions }
  const [phase, setPhase] = useState('loading'); // loading | interviewing | thinking | listening | coding | ending | verdict
  const [result, setResult] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [muted, setMuted] = useState(false);

  // Code editor state
  const [codeAnswer, setCodeAnswer] = useState('');
  const [submittingCode, setSubmittingCode] = useState(false);

  // Voice hooks
  const { speak, stop: stopSpeech } = useSpeechSynthesis();

  const transcriptEndRef = useRef(null);
  const interviewIdRef = useRef(id);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Initialize from state or fetch
  useEffect(() => {
    if (initData) {
      const firstMsg = initData.currentResponse;
      setCurrentMsg(firstMsg);
      setTranscript([{ role: 'interviewer', content: firstMsg.message, isCodingQuestion: firstMsg.isCodingQuestion, isFollowUp: false }]);
      if (firstMsg.isCodingQuestion) {
        setPhase('coding');
      } else {
        setPhase('interviewing');
        if (!muted) speak(firstMsg.message);
      }
    } else {
      navigate('/candidate/interview');
    }
  }, []);

  const addToTranscript = (role, content, isCodingQuestion = false, isFollowUp = false) => {
    setTranscript((prev) => [...prev, { role, content, isCodingQuestion, isFollowUp }]);
  };

  // Handle voice answer received
  const handleVoiceAnswer = useCallback(async (answerText) => {
    if (!answerText.trim()) return;
    setPhase('thinking');
    addToTranscript('candidate', answerText, false, false);
    await sendAnswer(answerText, false);
  }, [currentMsg]);

  // Speech recognition config
  const { start: startListening, stop: stopListening } = useSpeechRecognition({
    onResult: handleVoiceAnswer,
    onEnd: () => {
      setPhase((p) => (p === 'listening' ? 'interviewing' : p));
    },
  });

  // Updated sendAnswer — also captures isFollowUp from API
  const sendAnswer = async (answer, isCodingAnswer = false) => {
    try {
      const { data } = await api.post(`/interviews/ai-agent/${interviewIdRef.current}/respond`, {
        answer,
        isCodingAnswer,
      });

      if (data.done) {
        setPhase('ending');
        const nextMsg = data.currentResponse;
        addToTranscript('interviewer', nextMsg.message, false, false);
        if (!muted) speak(nextMsg.message);
        setTimeout(() => endInterview(), 3000);
      } else {
        const nextMsg = data.currentResponse;
        setCurrentMsg(nextMsg);
        addToTranscript('interviewer', nextMsg.message, nextMsg.isCodingQuestion, nextMsg.isFollowUp);
        if (!muted) speak(nextMsg.message);
        setCodeAnswer('');
        if (nextMsg.isCodingQuestion) {
          setPhase('coding');
        } else {
          setPhase('interviewing');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send answer');
      setPhase('interviewing');
    }
  };

  const endInterview = useCallback(async () => {
    setPhase('verdict');
    stopSpeech();
    try {
      const { data } = await api.post(`/interviews/ai-agent/${interviewIdRef.current}/end`);
      setResult(data);
    } catch (err) {
      toast.error('Failed to evaluate interview');
    }
  }, []);

  const handleStartListening = () => {
    stopSpeech();
    setPhase('listening');
    startListening();
  };

  const handleSubmitCode = async () => {
    if (!codeAnswer.trim()) return toast.error('Please write your code answer first');
    setSubmittingCode(true);
    setPhase('thinking');
    addToTranscript('candidate', codeAnswer, true, false);
    await sendAnswer(codeAnswer, true);
    setSubmittingCode(false);
  };

  // --- Render: Verdict ---
  if (phase === 'verdict' && result) {
    return <VerdictCard result={{ ...result, stack: initData?.stack, level: initData?.level }} onRetry={() => navigate('/candidate/interview')} />;
  }

  // --- Render: Loading/Evaluating ---
  if (phase === 'verdict' && !result) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-gray-300 font-medium">Evaluating your interview...</p>
        <p className="text-gray-500 text-sm">AI is generating your verdict</p>
      </div>
    );
  }

  const questionNum = currentMsg?.questionNumber || 1;
  const totalQ = currentMsg?.totalQuestions || 5;
  const progress = Math.round((questionNum / totalQ) * 100);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in flex flex-col gap-5">
      {/* Header */}
      <div className="card flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-violet-600 text-white animate-pulse">
              🤖 AI LIVE
            </span>
            <span className="text-gray-400 text-sm">{initData?.stack} · Level {initData?.level}</span>
          </div>
          <h1 className="text-white font-bold">AI Agent Interview</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800 font-mono text-sm text-gray-300">
            <HiClock className="text-gray-400" />
            {formatTime(elapsedSeconds)}
          </div>
          <button
            onClick={endInterview}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-danger-900/40 text-danger-400 border border-danger-500/30 text-sm hover:bg-danger-900/70 transition-all"
          >
            <HiStop className="w-3.5 h-3.5" /> End
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Question {questionNum} of {totalQ}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-primary-500 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Transcript */}
      <div className="card max-h-[340px] overflow-y-auto space-y-4 text-sm" style={{ scrollBehavior: 'smooth' }}>
        {transcript.map((entry, i) => (
          <div key={i} className={`flex gap-3 ${entry.role === 'candidate' ? 'justify-end' : 'justify-start'}`}>
            {entry.role === 'interviewer' && (
              <div className="w-7 h-7 rounded-full bg-violet-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">🤖</div>
            )}
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl leading-relaxed ${
              entry.role === 'interviewer'
                ? 'bg-dark-800 text-gray-200 rounded-tl-sm border border-dark-border'
                : 'bg-primary-700/30 text-primary-100 rounded-tr-sm border border-primary-600/30'
            }`}>
              {entry.isFollowUp && entry.role === 'interviewer' && (
                <div className="flex items-center gap-1 text-xs text-amber-400 mb-1.5 font-medium">
                  🔄 Follow-up
                </div>
              )}
              {entry.isCodingQuestion ? (
                <div>
                  <div className="flex items-center gap-1 text-xs text-violet-400 mb-1 font-medium"><HiCode /> Coding Question</div>
                  {entry.content}
                </div>
              ) : entry.role === 'candidate' && entry.content.startsWith('[Code Answer]') ? (
                <div>
                  <div className="flex items-center gap-1 text-xs text-accent-400 mb-2 font-medium"><HiCode /> Code Submitted</div>
                  <pre className="text-xs font-mono bg-dark-900 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap text-gray-200 border border-dark-border">
                    {entry.content.replace('[Code Answer]\n', '')}
                  </pre>
                </div>
              ) : (
                entry.content
              )}
            </div>
            {entry.role === 'candidate' && (
              <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">👤</div>
            )}
          </div>
        ))}

        {/* Thinking indicator */}
        {(phase === 'thinking' || phase === 'ending') && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-full bg-violet-700 flex items-center justify-center text-xs flex-shrink-0">🤖</div>
            <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-dark-800 border border-dark-border flex items-center gap-2 text-gray-400">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-xs">{phase === 'ending' ? 'Wrapping up...' : 'AI is thinking...'}</span>
            </div>
          </div>
        )}

        <div ref={transcriptEndRef} />
      </div>

      {/* Code editor panel — appears when isCodingQuestion */}
      {phase === 'coding' && (
        <div className="card border-2 border-violet-500/40 bg-violet-900/10 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HiCode className="w-5 h-5 text-violet-400" />
              <span className="text-white font-semibold text-sm">Code Editor</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-700/50 text-violet-300">{initData?.stack}</span>
            </div>
            <button
              onClick={() => setCodeAnswer('')}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            className="w-full h-48 bg-dark-900 border border-dark-border rounded-lg p-4 text-gray-100 font-mono text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 resize-none transition-colors placeholder-gray-600"
            placeholder={`// Write your ${initData?.stack || 'code'} solution here...\n// The AI interviewer will review and evaluate your code.`}
            value={codeAnswer}
            onChange={(e) => setCodeAnswer(e.target.value)}
            spellCheck={false}
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-500">{codeAnswer.length} characters</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setPhase('interviewing'); toast('Code editor dismissed. Answer verbally.'); }}
                className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Answer verbally instead
              </button>
              <button
                onClick={handleSubmitCode}
                disabled={!codeAnswer.trim() || submittingCode}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold disabled:opacity-50 transition-all"
              >
                {submittingCode ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                ) : (
                  <><HiCheckCircle className="w-4 h-4" /> Submit Code</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice controls */}
      {(phase === 'interviewing' || phase === 'listening') && (
        <div className="card">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-white font-semibold text-sm">
                {phase === 'listening' ? '🎙️ Listening...' : '💬 Your turn to answer'}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                {phase === 'listening'
                  ? 'Speak clearly. Recording will stop automatically.'
                  : 'Click the mic to speak, or type your answer below.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMuted((m) => !m)}
                className={`p-2.5 rounded-lg border transition-all ${muted ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-dark-800 border-dark-border text-emerald-400'}`}
                title={muted ? 'Unmute AI voice' : 'Mute AI voice'}
              >
                <HiVolumeUp className="w-4 h-4" />
              </button>
              <button
                onClick={phase === 'listening' ? stopListening : handleStartListening}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all ${
                  phase === 'listening'
                    ? 'bg-danger-600 hover:bg-danger-700 text-white animate-pulse'
                    : 'bg-violet-600 hover:bg-violet-700 text-white'
                }`}
              >
                <HiMicrophone className="w-5 h-5" />
                {phase === 'listening' ? 'Stop' : 'Speak'}
              </button>
            </div>
          </div>

          {/* Text fallback */}
          {phase === 'interviewing' && (
            <div className="mt-4 pt-4 border-t border-dark-border">
              <TextAnswerFallback onSubmit={handleVoiceAnswer} />
            </div>
          )}
        </div>
      )}

      {/* End Interview button at bottom */}
      {phase !== 'verdict' && phase !== 'ending' && (
        <div className="text-center">
          <button
            onClick={endInterview}
            className="text-xs text-gray-500 hover:text-danger-400 transition-colors underline underline-offset-2"
          >
            End interview early and get verdict
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Text fallback for when TTS not usable ─────────────────── */
function TextAnswerFallback({ onSubmit }) {
  const [text, setText] = useState('');
  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text.trim());
    setText('');
  };
  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">Or type your answer:</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          placeholder="Type your answer and press Enter..."
          className="flex-1 bg-dark-800 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium disabled:opacity-40 transition-all"
        >
          Send
        </button>
      </div>
    </div>
  );
}
