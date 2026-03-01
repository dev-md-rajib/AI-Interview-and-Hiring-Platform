import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiCheckCircle, HiXCircle, HiPlay, HiPaperAirplane, HiArrowLeft, HiUsers, HiClock } from 'react-icons/hi';

export default function CandidateMultiplayerRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState(null);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [lang, setLang] = useState('python');
  const [code, setCode] = useState('');
  const [runResults, setRunResults] = useState(null);
  
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // Time remaining
  const [timeLeftStr, setTimeLeftStr] = useState('');

  // Polling ref
  const pollInterval = useRef(null);

  const fetchRoomState = async (isInitial = false) => {
    try {
      const { data } = await api.get(`/multiplayer/${id}`);
      
      // Check if problem index changed, if so reset runresults and code
      if (!isInitial && room && data.room.currentProblemIndex !== room.currentProblemIndex) {
        setRunResults(null);
        setCode('');
      }

      setRoom(data.room);
      setQuestion(data.currentProblem);
      
      if (isInitial && data.currentProblem?.allowedLanguages?.length) {
        setLang(data.currentProblem.allowedLanguages.includes('python') ? 'python' : data.currentProblem.allowedLanguages[0]);
      }
    } catch (err) {
      if (isInitial) {
        toast.error('Failed to load multiplayer room');
        navigate('/candidate/practice');
      }
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomState(true);
    
    // Poll every 3 seconds for updates
    pollInterval.current = setInterval(() => {
      fetchRoomState(false);
    }, 3000);

    return () => clearInterval(pollInterval.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!room || room.status !== 'Active') return;
    
    const interval = setInterval(() => {
      const start = new Date(room.startedAt).getTime();
      const end = start + room.timeLimit * 60 * 1000;
      const now = Date.now();
      const remaining = end - now;
      
      if (remaining <= 0) {
        setTimeLeftStr('Time Up');
        // The backend will catch this eventually or when submit happens
      } else {
        const m = Math.floor(remaining / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        setTimeLeftStr(`${m}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [room]);

  const handleRun = async () => {
    if (!code.trim()) return toast.error('Code cannot be empty');
    setRunning(true);
    try {
      const { data } = await api.post(`/multiplayer/${id}/run`, { code, language: lang });
      setRunResults(data.results);
      if (data.allPassed) toast.success('All test cases passed!');
      else toast.error('Wrong Answer');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Run failed');
    } finally {
      setRunning(false);
    }
  };

  const handleSubmitProblem = async () => {
    if (!code.trim()) return toast.error('Code cannot be empty');
    setSubmitting(true);
    try {
      const { data } = await api.post(`/multiplayer/${id}/submit`, { code, language: lang });
      setRunResults(data.results);
      if (data.allPassed) toast.success(`Success!`);
      else toast.error('Submit Failed');
      
      // Refresh room state immediately
      await fetchRoomState();
    } catch (e) { 
      toast.error(e.response?.data?.message || 'Submit failed'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleSkip = async () => {
    setSkipping(true);
    try {
      await api.post(`/multiplayer/${id}/skip`);
      toast.success('Skip intent registered');
      await fetchRoomState();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to skip');
    } finally {
      setSkipping(false);
    }
  };

  const handleLeave = async () => {
    setLeaving(true);
    try {
      await api.post(`/multiplayer/${id}/leave`);
      navigate('/candidate/practice');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to leave');
    } finally {
      setLeaving(false);
    }
  };

  if (loading) return <div className="flex justify-center h-64 items-center"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>;
  if (!room) return null;

  // Render Results Screen if Ended
  if (room.status === 'Ended') {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <HiCheckCircle className="text-success-500" />
          Room Ended - Results
        </h1>
        <div className="card border border-dark-border">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-dark-border bg-dark-800/50">
                <th className="py-3 px-4 text-gray-400 font-medium">Rank</th>
                <th className="py-3 px-4 text-gray-400 font-medium">Player</th>
                <th className="py-3 px-4 text-gray-400 font-medium text-center">Solved</th>
                <th className="py-3 px-4 text-gray-400 font-medium text-right">Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {room.players
                .slice()
                .sort((a, b) => b.solvedCount - a.solvedCount || a.timeTakenTotal - b.timeTakenTotal)
                .map((p, idx) => (
                <tr key={p._id} className="border-b border-dark-border/50">
                  <td className="py-3 px-4 text-white font-bold">{idx + 1}</td>
                  <td className="py-3 px-4 text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center font-bold text-primary-400 shadow-inner">
                      {p.user?.name?.charAt(0) || '?'}
                    </div>
                    {p.user?.name || 'Unknown'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="badge badge-primary">{p.solvedCount} / {room.problems.length}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-400">
                    {p.timeTakenTotal > 0 ? (p.timeTakenTotal / 1000).toFixed(1) + 's' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 flex justify-end">
            <Link to="/candidate/practice" className="btn-primary">Return to Practice</Link>
          </div>
        </div>
      </div>
    );
  }

  // Active or Waiting Room
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-fade-in overflow-hidden">
      {/* Top Header */}
      <div className="bg-dark-card border-b border-dark-border px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={handleLeave} disabled={leaving} className="p-2 -ml-2 text-gray-400 hover:text-danger-400 transition-colors rounded-lg hover:bg-danger-500/10">
            <HiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-white flex items-center gap-3">
            Multiplayer Room
            <span className={`text-xs px-2 py-0.5 rounded-full border ${room.status === 'Active' ? 'bg-success-500/10 text-success-400 border-success-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
              {room.status}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          {room.status === 'Active' && (
            <div className="flex items-center gap-2 text-primary-400 font-mono bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
              <HiClock className="w-4 h-4" /> {timeLeftStr || '00:00'}
            </div>
          )}
          <span className="text-sm font-medium text-gray-400">
            Problem {room.currentProblemIndex + 1} of {room.problems.length}
          </span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Players & Problem */}
        <div className="w-1/3 min-w-[300px] bg-dark-card border-r border-dark-border flex flex-col shrink-0">
          
          {/* Players Sidebar Area */}
          <div className="p-4 border-b border-dark-border bg-dark-800/50">
            <h3 className="text-gray-400 uppercase tracking-wider text-xs font-bold mb-3 flex items-center gap-2">
              <HiUsers /> Players ({room.players.filter(p => p.hasJoined && p.isActive).length})
            </h3>
            <div className="space-y-2">
              {room.players.filter(p => p.hasJoined && p.isActive).map(p => {
                const isMe = p.user._id === room.creator._id; // Replace w/ actual me check if needed
                return (
                  <div key={p._id} className="flex justify-between items-center bg-dark-900 rounded p-2 text-sm border border-dark-border">
                    <span className="text-gray-200 truncate">{p.user?.name}</span>
                    <div className="flex items-center gap-2">
                      {p.wantsToSkip && <span className="text-xs text-yellow-500 bg-yellow-500/10 px-1.5 rounded">Skip</span>}
                      <span className="text-xs text-primary-400 bg-primary-500/10 px-1.5 rounded">{p.solvedCount} Solved</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {question ? (
              <>
                <h2 className="text-xl font-bold text-white mb-4">{question.question}</h2>
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
                          <div className="text-gray-500 select-none text-xs mb-1">Input:</div>
                          <div className="text-gray-300 whitespace-pre-wrap">{tc.input}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-gray-500 select-none text-xs mb-1">Output:</div>
                        <div className="text-primary-300 font-bold whitespace-pre-wrap">{tc.expectedOutput}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
               <div className="text-gray-400 text-center py-10">Loading problem...</div>
            )}
          </div>
        </div>

        {/* Right Pane: Editor */}
        <div className="flex-1 flex flex-col min-w-0 bg-dark-900">
          
          <div className="bg-dark-card border-b border-dark-border px-4 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <select 
                value={lang} 
                onChange={e => setLang(e.target.value)}
                className="bg-dark-800 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                {(question?.allowedLanguages || ['python', 'javascript']).map(l => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSkip} 
                disabled={skipping || room.status !== 'Active'}
                className="btn-secondary text-sm py-1.5 px-4"
              >
                {skipping ? 'Skipping...' : 'Vote to Skip'}
              </button>
              <button 
                onClick={handleRun} 
                disabled={running || submitting || room.status !== 'Active'}
                className="btn-secondary text-sm py-1.5 px-4 flex items-center gap-2"
              >
                <HiPlay className={running ? "animate-pulse" : ""} />
                {running ? 'Running...' : 'Run Code'}
              </button>
              <button 
                onClick={handleSubmitProblem} 
                disabled={running || submitting || room.status !== 'Active'}
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

          <textarea
            className="flex-1 bg-transparent text-gray-100 font-mono text-sm p-4 lg:p-6 resize-none focus:outline-none focus:ring-inset focus:ring-1 focus:ring-primary-500/30 transition-shadow"
            value={code}
            onChange={e => setCode(e.target.value)}
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
