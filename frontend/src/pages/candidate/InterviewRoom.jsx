import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { HiClock, HiChevronLeft, HiChevronRight, HiCheckCircle } from 'react-icons/hi';
import { handlePasteViolation } from '../../utils/proctoring';

export default function InterviewRoom() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [interview] = useState(state?.interview);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((interview?.durationMinutes || 60) * 60);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const socketRef = useRef(null);

  const questions = interview?.questions || [];
  const totalQ = questions.length;

  useEffect(() => {
    if (!interview) { navigate('/candidate/interview'); return; }

    const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      auth: { token: localStorage.getItem('token') },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.emit('tracker:join', { interviewId: id });

    socket.on('tracker:interview_ended', () => {
      toast('Interview terminated from Interview Tracker app 🛑', { icon: '🛑' });
      handleSubmit();
    });

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [id, interview, navigate]);

  const handleSubmit = useCallback(async () => {
    if (submitted || submitting) return;
    setSubmitting(true);
    try {
      const answersArray = questions.map((_, idx) => ({
        questionIndex: idx,
        answer: answers[idx] || '',
      }));
      const { data } = await api.post(`/interviews/${id}/submit`, { answers: answersArray });
      setSubmitted(true);
      toast.success('Interview submitted! Calculating results...');
      navigate(`/candidate/interview/${id}/result`, { state: { result: data } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }, [answers, id, questions, submitted, submitting]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  if (!interview) return null;

  const q = questions[currentQ];
  const answeredCount = Object.values(answers).filter((a) => a && a.trim()).length;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="card mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-gray-900 dark:text-white font-bold text-lg">{interview.stack} — Level {interview.level} Interview</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{answeredCount}/{totalQ} answered</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm border transition-colors ${
          timeLeft < 300 
            ? 'bg-danger-50 dark:bg-danger-950/40 text-danger-600 dark:text-danger-400 border-danger-200 dark:border-danger-500/30 animate-pulse' 
            : 'bg-primary-50 dark:bg-dark-800 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-dark-border'
        }`}>
          <HiClock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex gap-1.5 flex-wrap">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQ(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                idx === currentQ 
                  ? 'bg-primary-600 text-white scale-110 shadow-sm' 
                  : answers[idx]?.trim() 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30' 
                  : 'bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-dark-800 border border-dark-border'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="badge-primary">Q{currentQ + 1} / {totalQ}</span>
          <span className="badge bg-slate-100 dark:bg-dark-800 text-gray-700 dark:text-gray-300 border border-dark-border">{q?.questionType?.toUpperCase()}</span>
          <span className={`badge ${q?.difficulty === 'hard' ? 'badge-danger' : q?.difficulty === 'medium' ? 'badge-warning' : 'badge-success'}`}>{q?.difficulty}</span>
          <span className="badge bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">{q?.skill}</span>
        </div>

        <h2 className="text-gray-900 dark:text-white text-lg font-semibold mb-6 leading-relaxed">{q?.questionText}</h2>

        {/* MCQ */}
        {q?.questionType === 'mcq' && (
          <div className="space-y-3">
            {q.options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => setAnswers((a) => ({ ...a, [currentQ]: opt }))}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                  answers[currentQ] === opt 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-gray-900 dark:text-white font-medium' 
                    : 'border-dark-border text-gray-700 dark:text-gray-300 hover:border-primary-500/50 hover:bg-dark-800/40'
                }`}
              >
                <span className={`font-bold mr-3 ${answers[currentQ] === opt ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500'}`}>{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Text / Coding / Scenario */}
        {q?.questionType !== 'mcq' && (
          <div>
            <textarea
              className={`input w-full h-40 resize-none ${q?.questionType === 'coding' ? 'font-mono text-sm' : 'font-sans'}`}
              placeholder={q?.questionType === 'coding' ? '// Write your code here...' : 'Type your answer here...'}
              value={answers[currentQ] || ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [currentQ]: e.target.value }))}
              onPaste={(e) => handlePasteViolation(e, id, `Standard Interview Q${currentQ + 1} Editor`, socketRef.current)}
            />
            {answers[currentQ]?.trim() && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1 font-medium"><HiCheckCircle /> Answer saved</p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => setCurrentQ((q) => Math.max(0, q - 1))} disabled={currentQ === 0} className="btn-secondary flex items-center gap-2 disabled:opacity-40">
          <HiChevronLeft /> Previous
        </button>

        {currentQ < totalQ - 1 ? (
          <button onClick={() => setCurrentQ((q) => q + 1)} className="btn-primary flex items-center gap-2">
            Next <HiChevronRight />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary bg-accent-500 hover:bg-accent-600 flex items-center gap-2 px-6"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : <><HiCheckCircle /> Submit Interview</>}
          </button>
        )}
      </div>

      <p className="text-center text-xs text-gray-500 mt-4">
        Answered {answeredCount}/{totalQ} questions. You can submit anytime, even with unanswered questions.
      </p>
    </div>
  );
}
