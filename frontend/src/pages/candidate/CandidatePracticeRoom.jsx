import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiXCircle, HiPlay, HiPaperAirplane, HiArrowLeft } from 'react-icons/hi';

export default function CandidatePracticeRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState(null);
  const [submissions, setSubmissions] = useState({}); // { lang: { code, status } }
  const [loading, setLoading] = useState(true);
  
  const [lang, setLang] = useState('python');
  const [codes, setCodes] = useState({}); // { lang: codeString }
  const [runResults, setRunResults] = useState(null);
  
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await api.get(`/practice/${id}`);
        setQuestion(data.question);
        
        if (data.submissions && data.submissions.length > 0) {
          const subsMap = {};
          const cMap = {};
          data.submissions.forEach(sub => {
            subsMap[sub.language] = sub;
            cMap[sub.language] = sub.code;
          });
          setSubmissions(subsMap);
          setCodes(cMap);
          
          // Optionally pick the last interacted language if we had a lastUpdated timestamp
          // For now, default to python if allowed, else the first in the list
          if (data.question?.allowedLanguages?.length) {
            setLang(data.question.allowedLanguages.includes('python') ? 'python' : data.question.allowedLanguages[0]);
          }
        } else if (data.question?.allowedLanguages?.length) {
          setLang(data.question.allowedLanguages.includes('python') ? 'python' : data.question.allowedLanguages[0]);
        }
      } catch (err) {
        toast.error('Failed to load practice problem');
        navigate('/candidate/practice');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id, navigate]);

  const handleRun = async () => {
    const currentCode = codes[lang] || '';
    if (!currentCode.trim()) return toast.error('Write some code first');
    setRunning(true);
    try {
      const { data } = await api.post(`/practice/${id}/run`, { code: currentCode, language: lang });
      setRunResults(data.results);
      toast.success('Code executed against visible cases');
    } catch (e) { 
      toast.error(e.response?.data?.message || 'Run failed'); 
    } finally { 
      setRunning(false); 
    }
  };

  const handleSubmitProblem = async () => {
    const currentCode = codes[lang] || '';
    if (!currentCode.trim()) return toast.error('Write some code first');
    setSubmitting(true);
    try {
      const { data } = await api.post(`/practice/${id}/submit`, { code: currentCode, language: lang });
      setRunResults(data.results);
      
      setSubmissions(prev => ({ ...prev, [lang]: data.submission }));
      
      if (data.allPassed) {
        toast.success(`Success! All test cases passed. 🎉`);
      } else {
        const failedCount = data.results.filter(r => !r.passed).length;
        toast.error(`Wrong Answer. ${failedCount} test case(s) failed`);
      }
    } catch (e) { 
      toast.error(e.response?.data?.message || 'Submit failed'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!question) return null;

  const allowedLangs = question.allowedLanguages || ['javascript'];
  const isLanguageSolved = submissions[lang]?.status === 'Solved';

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-fade-in overflow-hidden">
      {/* Top Header */}
      <div className="bg-dark-card border-b border-dark-border px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/candidate/practice" className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-800">
            <HiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold text-white flex items-center gap-3">
            {question.question}
            {isLanguageSolved && <span className="badge bg-success-500/10 text-success-400 border-success-500/20 text-xs py-0.5"><HiCheckCircle className="mr-1 inline" />Solved in {lang}</span>}
          </h1>
        </div>
        <div>
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium uppercase tracking-wider ${
            question.difficulty === 'easy' ? 'text-success-400 bg-success-500/10 border-success-500/20' : 
            question.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 
            'text-danger-400 bg-danger-500/10 border-danger-500/20'
          }`}>
            {question.difficulty || 'medium'}
          </span>
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Question Description */}
        <div className="w-1/3 bg-dark-card border-r border-dark-border overflow-y-auto flex flex-col shrink-0">
          <div className="p-6">
            <div className="prose prose-invert max-w-none text-sm leading-relaxed mb-8">
              <pre className="whitespace-pre-wrap font-sans bg-transparent p-0 m-0 text-gray-300">
                {question.text || "No detailed description provided."}
              </pre>
            </div>

            <h3 className="text-gray-400 uppercase tracking-wider text-xs font-bold mb-4">Sample Test Cases</h3>
            <div className="space-y-4">
              {question.testCases?.filter(tc => !tc.hidden).map((tc, ti) => (
                <div key={ti} className="bg-dark-800 rounded-lg p-4 font-mono text-sm border border-dark-border">
                  <p className="text-gray-500 mb-2 font-sans text-xs">Example {ti + 1}:</p>
                  {tc.input && (
                    <div className="mb-2">
                      <span className="text-gray-500 select-none">Input:</span><br/>
                      <span className="text-gray-300 whitespace-pre-wrap">{tc.input}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500 select-none">Output:</span><br/>
                    <span className="text-emerald-300 whitespace-pre-wrap">{tc.expectedOutput}</span>
                  </div>
                </div>
              ))}
            </div>
            {question.testCases?.some(tc => tc.hidden) && (
              <p className="text-xs text-gray-500 mt-4 italic">Note: More hidden test cases will be run upon submission.</p>
            )}
          </div>
        </div>

        {/* Right Pane: Code Editor and Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden bg-dark-900">
          
          {/* Editor Header */}
          <div className="flex items-center gap-3 px-4 py-2 bg-dark-800/80 border-b border-dark-border">
            <select 
              value={lang} 
              onChange={e => setLang(e.target.value)}
              className="bg-dark-card border border-dark-border rounded-md px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-primary-500 hover:border-gray-600 transition-colors"
            >
              {allowedLangs.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRun} 
                disabled={running || submitting}
                className="btn-secondary text-sm py-1.5 px-4 flex items-center gap-2"
              >
                <HiPlay className={running ? "animate-pulse" : ""} />
                {running ? 'Running...' : 'Run Code'}
              </button>
              <button 
                onClick={handleSubmitProblem} 
                disabled={running || submitting}
                className="btn-primary text-sm py-1.5 px-4 flex items-center gap-2 bg-success-600 hover:bg-success-500 shadow-success-500/20"
              >
                <HiPaperAirplane className={submitting ? "animate-pulse" : ""} />
                {submitting ? 'Submitting...' : 'Submit Solution'}
              </button>
            </div>
          </div>

          <div className="bg-dark-900/50 text-[11px] text-gray-400 px-4 py-1.5 border-b border-dark-border">
            <span className="font-mono text-primary-400/80">Info: </span>
            {lang === 'javascript' && 'Use input() or readline() to read test case inputs line by line.'}
            {lang === 'python' && 'Use input() to read test case inputs line by line.'}
            {lang !== 'javascript' && lang !== 'python' && 'Read from standard input.'}
          </div>

          {/* Code Editor Body */}
          <textarea
            className="flex-1 bg-transparent text-gray-100 font-mono text-sm p-4 lg:p-6 resize-none focus:outline-none focus:ring-inset focus:ring-1 focus:ring-primary-500/30 transition-shadow"
            value={codes[lang] || ''}
            onChange={e => setCodes(c => ({ ...c, [lang]: e.target.value }))}
            spellCheck={false}
          />

          {/* Test Results Terminal */}
          {runResults && (
            <div className="h-1/3 min-h-[200px] border-t border-dark-border bg-dark-800 flex flex-col">
              <div className="bg-dark-card px-4 py-2 border-b border-dark-border flex items-center justify-between text-xs font-semibold text-gray-400 tracking-wide uppercase">
                <span>Test Results</span>
                {runResults.length > 0 && (
                  <span className={runResults.every(r => r.passed) ? 'text-success-400' : 'text-danger-400'}>
                    {runResults.filter(r => r.passed).length} / {runResults.length} Passed
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {runResults.length === 0 ? (
                  <p className="text-gray-500 text-sm font-mono">No output.</p>
                ) : (
                  runResults.map((r, i) => (
                    <div key={i} className={`flex flex-col gap-1 p-3 rounded-lg border ${r.passed ? 'bg-success-900/10 border-success-500/20' : 'bg-danger-900/10 border-danger-500/20'}`}>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {r.passed ? <HiCheckCircle className="text-success-400" /> : <HiXCircle className="text-danger-400" />}
                        <span className={r.passed ? 'text-success-300' : 'text-danger-300'}>Test Case {i + 1}</span>
                        {r.executionTime > 0 && <span className="text-gray-500 text-xs ml-auto">{r.executionTime}ms</span>}
                      </div>
                      <div className="font-mono text-xs mt-2 pl-6 space-y-1">
                        {r.input && r.input !== '(hidden)' && (
                          <p><span className="text-gray-500 select-none">Input:    </span><span className="text-gray-300">{r.input}</span></p>
                        )}
                        <p><span className="text-gray-500 select-none">Expected: </span><span className="text-gray-300">{r.expected !== '(hidden)' ? r.expected : '(hidden)'}</span></p>
                        {r.actual && (
                          <p><span className="text-gray-500 select-none">Output:   </span><span className={r.passed ? "text-success-300" : "text-danger-300"}>{r.actual}</span></p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
