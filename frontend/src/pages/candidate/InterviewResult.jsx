import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../../services/api';
import { HiCheckCircle, HiXCircle, HiArrowRight, HiChartBar } from 'react-icons/hi';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

export default function InterviewResult() {
  const { id } = useParams();
  const { state } = useLocation();
  const [result, setResult] = useState(state?.result || null);
  const [loading, setLoading] = useState(!result);

  useEffect(() => {
    if (!result) {
      api.get(`/interviews/${id}/result`).then(({ data }) => {
        const iv = data.interview;
        setResult({
          totalScore: iv.totalScore,
          passed: iv.passed,
          skillScores: Object.fromEntries(iv.skillScores || []),
          strengths: iv.strengths,
          weaknesses: iv.weaknesses,
          feedback: iv.feedback,
          nextLevelEligible: iv.nextLevelEligible,
          level: iv.level,
          stack: iv.stack,
        });
      }).finally(() => setLoading(false));
    }
  }, [id, result]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;
  if (!result) return <div className="text-center text-gray-400 py-16">Result not found</div>;

  const skillData = Object.entries(result.skillScores || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="max-w-2xl mx-auto animate-slide-up space-y-6">
      {/* Verdict */}
      <div className={`card text-center border-2 ${result.passed ? 'border-accent-500/40 bg-emerald-900/10' : 'border-danger-500/40 bg-red-900/10'}`}>
        {result.passed
          ? <HiCheckCircle className="w-16 h-16 text-accent-400 mx-auto mb-3" />
          : <HiXCircle className="w-16 h-16 text-danger-400 mx-auto mb-3" />}
        <h1 className="text-3xl font-bold text-white">{result.passed ? '🎉 Passed!' : '❌ Failed'}</h1>
        <p className="text-gray-400 mt-1">{result.stack} • Level {result.level}</p>
        <div className="mt-6">
          <div className="text-6xl font-black text-gradient">{result.totalScore}%</div>
          <p className="text-gray-400 text-sm mt-1">Overall Score</p>
        </div>

        {result.nextLevelEligible && (
          <div className="mt-4 p-3 bg-emerald-900/20 border border-accent-500/30 rounded-lg">
            <p className="text-accent-300 font-medium">🚀 You're now eligible for Level {result.level + 1}!</p>
          </div>
        )}
      </div>

      {/* Feedback */}
      {result.feedback && (
        <div className="card">
          <h2 className="section-title">AI Feedback</h2>
          <p className="text-gray-300 leading-relaxed">{result.feedback}</p>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.strengths?.length > 0 && (
          <div className="card">
            <h3 className="text-white font-semibold mb-3 text-accent-400">✅ Strengths</h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-accent-400 mt-0.5">•</span>{s}</li>)}
            </ul>
          </div>
        )}
        {result.weaknesses?.length > 0 && (
          <div className="card">
            <h3 className="text-white font-semibold mb-3 text-danger-400">⚠️ Areas to Improve</h3>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => <li key={i} className="text-gray-300 text-sm flex items-start gap-2"><span className="text-danger-400 mt-0.5">•</span>{w}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Skill scores */}
      {skillData.length > 0 && (
        <div className="card">
          <h2 className="section-title flex items-center gap-2"><HiChartBar />Skill Breakdown</h2>
          <div className="space-y-3 mb-6">
            {skillData.map(({ name, value }) => (
              <div key={name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{name}</span>
                  <span className={`font-bold ${value >= 70 ? 'text-accent-400' : value >= 50 ? 'text-yellow-400' : 'text-danger-400'}`}>{value}%</span>
                </div>
                <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${value >= 70 ? 'bg-accent-500' : value >= 50 ? 'bg-yellow-500' : 'bg-danger-500'}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {skillData.length >= 3 && (
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="#2d2d42" />
                <PolarAngleAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #2d2d42', color: '#f1f5f9' }} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 flex-wrap">
        <Link to="/candidate/interview" className="btn-primary flex items-center gap-2 flex-1 justify-center">
          {result.passed ? `Take Level ${result.level + 1}` : 'Retry Interview'} <HiArrowRight />
        </Link>
        <Link to="/candidate/history" className="btn-secondary flex-1 text-center py-2">View History</Link>
      </div>
    </div>
  );
}
