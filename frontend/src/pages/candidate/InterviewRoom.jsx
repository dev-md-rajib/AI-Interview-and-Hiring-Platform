import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { HiClock, HiChevronLeft, HiChevronRight, HiCheckCircle } from 'react-icons/hi';

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

  const questions = interview?.questions || [];
  const totalQ = questions.length;

  useEffect(() => {
    if (!interview) { navigate('/candidate/interview'); return; }
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
          <h1 className="text-white font-bold">{interview.stack} — Level {interview.level} Interview</h1>
          <p className="text-gray-400 text-sm">{answeredCount}/{totalQ} answered</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${timeLeft < 300 ? 'bg-danger-900/50 text-danger-400 animate-pulse' : 'bg-dark-800 text-white'}`}>
          <HiClock />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex gap-1.5 flex-wrap">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQ(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${idx === currentQ ? 'bg-primary-600 text-white scale-110' : answers[idx]?.trim() ? 'bg-accent-600/30 text-accent-400 border border-accent-500/40' : 'bg-dark-800 text-gray-400 hover:bg-dark-700'}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="badge-primary">Q{currentQ + 1} / {totalQ}</span>
          <span className="badge-gray">{q?.questionType?.toUpperCase()}</span>
          <span className={`badge ${q?.difficulty === 'hard' ? 'badge-danger' : q?.difficulty === 'medium' ? 'badge-warning' : 'badge-success'}`}>{q?.difficulty}</span>
          <span className="badge bg-blue-900 text-blue-300">{q?.skill}</span>
        </div>

        <h2 className="text-white text-lg font-medium mb-6 leading-relaxed">{q?.questionText}</h2>

        {/* MCQ */}
        {q?.questionType === 'mcq' && (
          <div className="space-y-3">
            {q.options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => setAnswers((a) => ({ ...a, [currentQ]: opt }))}
                className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${answers[currentQ] === opt ? 'border-primary-500 bg-primary-900/30 text-white' : 'border-dark-border text-gray-300 hover:border-primary-700 hover:bg-dark-800'}`}
              >
                <span className={`font-bold mr-3 ${answers[currentQ] === opt ? 'text-primary-400' : 'text-gray-500'}`}>{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Text / Coding / Scenario */}
        {q?.questionType !== 'mcq' && (
          <div>
            <textarea
              className={`w-full h-40 bg-dark-800 border border-dark-border rounded-lg p-4 text-gray-100 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none transition-colors ${q?.questionType === 'coding' ? 'font-mono text-sm' : 'font-sans'}`}
              placeholder={q?.questionType === 'coding' ? '// Write your code here...' : 'Type your answer here...'}
              value={answers[currentQ] || ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [currentQ]: e.target.value }))}
            />
            {answers[currentQ]?.trim() && (
              <p className="text-xs text-accent-400 mt-1 flex items-center gap-1"><HiCheckCircle /> Answer saved</p>
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
