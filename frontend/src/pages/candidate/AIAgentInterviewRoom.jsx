import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import {
  HiMicrophone, HiVolumeUp, HiCode, HiCheckCircle, HiXCircle,
  HiClock, HiChartBar, HiStop, HiPlay, HiRefresh, HiVideoCamera, HiShieldExclamation
} from 'react-icons/hi';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';

/* ─── Proctoring Config & Math ────────────────────────────── */
const YAW_THRESHOLD = 10;
const PITCH_THRESHOLD = 10;
const GAZE_THRESHOLD = 0.1;
const LOOK_AWAY_TIME = 2500; // ms

function rotationMatrixToEuler(R) {
  const sy = Math.sqrt(R[0] * R[0] + R[4] * R[4]);
  const singular = sy < 1e-6;
  let pitch, yaw, roll;
  if (!singular) {
    pitch = Math.atan2(R[6], R[10]);
    yaw = Math.atan2(-R[2], sy);
    roll = Math.atan2(R[4], R[0]);
  } else {
    pitch = Math.atan2(-R[9], R[5]);
    yaw = Math.atan2(-R[2], sy);
    roll = 0;
  }
  return { 
    yaw: yaw * (180 / Math.PI), 
    pitch: pitch * (180 / Math.PI), 
    roll: roll * (180 / Math.PI) 
  };
}

function getIrisGaze(landmarks) {
  // Left eye corners: 33 (L), 133 (R)
  // Left iris center: 468
  const lx_left = landmarks[33].x;
  const lx_right = landmarks[133].x;
  const ly_top = landmarks[159].y;
  const ly_bot = landmarks[145].y;
  const l_iris_x = landmarks[468].x;
  const l_iris_y = landmarks[468].y;

  const l_eye_w = lx_right - lx_left;
  const l_eye_h = ly_bot - ly_top;

  if (l_eye_w < 0.001 || l_eye_h < 0.001) return { x: 0, y: 0 };

  const gaze_x = (l_iris_x - lx_left) / l_eye_w - 0.5;
  const gaze_y = (l_iris_y - ly_top) / l_eye_h - 0.5;

  return { x: gaze_x, y: gaze_y };
}

/* ─── Helpers ─────────────────────────────────────────────── */
function formatTime(s) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef(null);
  const abortControllerRef = useRef(null);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text) => {
    try {
      stop(); // Clean up any currently playing audio or pending fetches
      
      abortControllerRef.current = new AbortController();
      setIsSpeaking(true);
      
      // Fetch audio from Gemini backend
      const { data } = await api.post('/interviews/ai-agent/tts', { text }, {
        signal: abortControllerRef.current.signal
      });
      
      if (data.success && data.audioBase64) {
        const audio = new Audio("data:audio/mp3;base64," + data.audioBase64);
        audioRef.current = audio;
        
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        
        await audio.play();
      } else {
        setIsSpeaking(false);
      }
    } catch (err) {
      if (err.name !== 'CanceledError') {
        console.error('TTS execution error:', err);
        setIsSpeaking(false);
      }
    }
  }, [stop]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => stop();
  }, [stop]);
  
  return { speak, stop, isSpeaking };
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
        {(result.codingScore != null || result.conceptScore != null || result.trustScore != null) && (
          <div className="mt-5 grid grid-cols-3 gap-3 max-w-lg mx-auto">
            <div className="p-3 rounded-lg bg-violet-900/30 border border-violet-500/30">
              <p className="text-xs text-violet-300 mb-1">💻 Coding</p>
              <p className="text-2xl font-bold text-white">{result.codingScore ?? '—'}%</p>
            </div>
            <div className="p-3 rounded-lg bg-primary-900/30 border border-primary-500/30">
              <p className="text-xs text-primary-300 mb-1">🧠 Concepts</p>
              <p className="text-2xl font-bold text-white">{result.conceptScore ?? '—'}%</p>
            </div>
            <div className={`p-3 rounded-lg border flex flex-col items-center justify-center ${
              result.trustScore < 80 ? 'bg-danger-900/30 border-danger-500/30' : 'bg-success-900/30 border-success-500/30'
            }`}>
              <div className="flex items-center gap-1">
                <p className={`text-xs mb-1 ${result.trustScore < 80 ? 'text-danger-300' : 'text-success-300'}`}>
                  🛡️ Trust Score
                </p>
              </div>
              <p className="text-2xl font-bold text-white">{result.trustScore ?? 100}%</p>
              {(result.cheatCount > 0) && (
                <p className="text-[10px] text-danger-400 font-bold uppercase mt-1">
                  {result.cheatCount} Violations
                </p>
              )}
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
  const { speak, stop: stopSpeech, isSpeaking } = useSpeechSynthesis();

  const transcriptEndRef = useRef(null);
  const interviewIdRef = useRef(id);

  // Proctoring refs & state
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const landmarkerRef = useRef(null);
  const reqAFRef = useRef(null);
  const lookAwayStartRef = useRef(null);
  const currentlyAwayRef = useRef(false);
  const alertUntilRef = useRef(0);

  const [proctorStatus, setProctorStatus] = useState('Initializing AI Proctor...');
  const [cheatCount, setCheatCount] = useState(0);
  const [lookingAway, setLookingAway] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [faceFound, setFaceFound] = useState(true);

  // Initialize MediaPipe and Webcam
  useEffect(() => {
    let stream = null;

    const setupProctoring = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: true,
          numFaces: 4, // Allow detecting multiple faces for proctoring
          runningMode: "VIDEO"
        });

        // Get Webcam
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setProctorStatus('Active');
            reqAFRef.current = requestAnimationFrame(detectFrames);
          };
        }
      } catch (err) {
        console.error("Proctoring setup error:", err);
        setProctorStatus('Failed to start webcam/proctor');
      }
    };
    setupProctoring();

    return () => {
      if (reqAFRef.current) cancelAnimationFrame(reqAFRef.current);
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (landmarkerRef.current) landmarkerRef.current.close();
    };
  }, []);

  // Frame processing loop
  const detectFrames = () => {
    if (!videoRef.current || !canvasRef.current || !landmarkerRef.current) return;
    
    const video = videoRef.current;
    if (video.readyState < 2) {
      reqAFRef.current = requestAnimationFrame(detectFrames);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const w = canvas.width;
    const h = canvas.height;

    // Draw video (mirrored)
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-w, 0);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();

    const now = performance.now();
    const results = landmarkerRef.current.detectForVideo(video, now);

    let isAway = false;
    let found = false;

    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      found = true;
      const landmarks = results.faceLandmarks[0];

      // Draw landmarks
      ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
      for (const pt of landmarks) {
        ctx.beginPath();
        ctx.arc(w - (pt.x * w), pt.y * h, 1, 0, 2 * Math.PI); // Mirrored X
        ctx.fill();
      }

      let yaw = 0, pitch = 0;
      
      // Multi-face check
      if (results.faceLandmarks.length > 1) {
        const msNow = Date.now();
        if (msNow > alertUntilRef.current) {
          setCheatCount(prev => {
            const next = prev + 10;
            setAlertMsg(`MULTIPLE FACES DETECTED (+10 penalty)`);
            alertUntilRef.current = msNow + 3000;
            return next;
          });
        }
      }

      if (results.facialTransformationMatrixes && results.facialTransformationMatrixes.length > 0) {
        const mat = results.facialTransformationMatrixes[0];
        const angles = rotationMatrixToEuler(mat);
        yaw = angles.yaw;
        pitch = angles.pitch;
      }

      let gazeP = { x: 0, y: 0 };
      try {
        gazeP = getIrisGaze(landmarks);
      } catch (e) { }

      const headDbg = Math.abs(yaw) > YAW_THRESHOLD || Math.abs(pitch) > PITCH_THRESHOLD;
      const gazeDbg = Math.abs(gazeP.x) > GAZE_THRESHOLD || Math.abs(gazeP.y) > GAZE_THRESHOLD;
      
      isAway = headDbg || gazeDbg;
    } else {
      isAway = true;
    }

    setFaceFound(found);
    setLookingAway(isAway);

    // Cheat logic
    const msNow = Date.now();
    if (isAway) {
      if (!lookAwayStartRef.current) {
        lookAwayStartRef.current = msNow;
      } else if ((msNow - lookAwayStartRef.current) >= LOOK_AWAY_TIME && !currentlyAwayRef.current) {
        // Detected a cheat!
        setCheatCount(prev => {
          const next = prev + 1;
          setAlertMsg(`Unusual Activity #${next} Detected!`);
          alertUntilRef.current = msNow + 2000;
          return next;
        });
        currentlyAwayRef.current = true;
      }
    } else {
      lookAwayStartRef.current = null;
      currentlyAwayRef.current = false;
    }

    // Clear alert message after time
    if (msNow > alertUntilRef.current) {
      setAlertMsg('');
    }

    reqAFRef.current = requestAnimationFrame(detectFrames);
  };

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
    let timeoutId = null;

    if (initData) {
      const firstMsg = initData.currentResponse;
      setCurrentMsg(firstMsg);
      setTranscript([{ role: 'interviewer', content: firstMsg.message, isCodingQuestion: firstMsg.isCodingQuestion, isFollowUp: false }]);
      if (!muted) {
        // Small delay ensures voices are loaded and bypasses some autoplay restrictions
        timeoutId = setTimeout(() => speak(firstMsg.message), 500);
      }

      if (firstMsg.isCodingQuestion) {
        setPhase('coding');
      } else {
        setPhase('interviewing');
      }
    } else {
      navigate('/candidate/interview');
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
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
      const { data } = await api.post(`/interviews/ai-agent/${interviewIdRef.current}/end`, { cheatCount });
      setResult(data);
    } catch (err) {
      toast.error('Failed to evaluate interview');
    }
  }, [cheatCount, stopSpeech]);

  const handleStartListening = () => {
    if (isSpeaking) {
      stopSpeech(); // Stop AI if it's currently talking
    }
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
    <div className="max-w-4xl mx-auto animate-fade-in flex flex-col gap-5">
      
      {/* ─── WebCam Proctoring Overlay ─── */}
      <div className="fixed bottom-6 right-6 z-40 bg-dark-900 border-2 border-dark-border rounded-xl shadow-2xl overflow-hidden w-[320px]">
        <div className="bg-dark-800 px-3 py-2 flex items-center justify-between border-b border-dark-border">
          <div className="flex items-center gap-2">
            <HiShieldExclamation className={lookingAway ? 'text-danger-500 animate-pulse' : 'text-success-500'} />
            <span className="text-xs font-semibold text-gray-200">AI Proctor</span>
          </div>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${proctorStatus === 'Active' ? 'bg-success-500/20 text-success-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
            {proctorStatus}
          </span>
        </div>
        
        <div className="relative w-full h-[240px] bg-black">
          <video ref={videoRef} playsInline muted className="hidden" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
          
          {/* Overlay UI elements drawn in React instead of Canvas text for sharper rendering */}
          <div className="absolute top-2 left-2 text-[10px] font-mono font-bold space-y-1 drop-shadow-md">
            <div className="text-danger-400 bg-black/50 px-1 rounded">WARNINGS: {cheatCount}</div>
            <div className={lookingAway ? 'text-danger-400 bg-black/50 px-1 rounded' : 'text-success-400 bg-black/50 px-1 rounded'}>
              {lookingAway ? 'LOOKING AWAY' : 'OK - FOCUSED'}
            </div>
            {!faceFound && <div className="text-danger-400 bg-black/50 px-1 rounded animate-pulse">NO FACE DETECTED!</div>}
          </div>

          {alertMsg && (
            <div className="absolute inset-0 flex items-center justify-center bg-danger-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-danger-600 text-white text-sm font-bold py-2 px-4 rounded shadow-xl uppercase border border-red-400">
                {alertMsg}
              </div>
            </div>
          )}
        </div>
      </div>

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

      {/* AI Voice Visualizer (Only visible when AI is speaking) */}
      {isSpeaking && (
        <div className="card border-2 border-violet-500/30 bg-violet-900/10 flex flex-col items-center justify-center py-8 animate-fade-in shadow-[0_0_30px_rgba(139,92,246,0.15)]">
          <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(139,92,246,0.6)] mb-6 animate-pulse">
            🤖
          </div>
          <div className="flex items-end justify-center gap-2 h-16">
            {[0.3, 0.7, 0.4, 0.9, 0.5, 0.8, 0.4, 0.6, 0.3].map((delay, i) => (
              <div 
                key={i} 
                className="w-3 bg-gradient-to-t from-violet-600 to-primary-400 rounded-full animate-soundwave"
                style={{ 
                  animationDelay: `${delay}s`,
                  height: '20%' // Base height, CSS animation will scale it
                }}
              />
            ))}
          </div>
          <p className="text-violet-300 font-medium text-sm mt-4 tracking-wider animate-pulse">AI IS SPEAKING...</p>
        </div>
      )}

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
            <p className="text-xs text-gray-500 w-24">{codeAnswer.length} characters</p>
            <div className="flex gap-3 justify-center flex-1">
              <button
                onClick={() => { setPhase('interviewing'); toast('Code editor dismissed. Answer verbally.'); }}
                className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5"
              >
                Answer verbally instead
              </button>
              <button
                onClick={handleSubmitCode}
                disabled={!codeAnswer.trim() || submittingCode}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold disabled:opacity-50 transition-all"
              >
                {submittingCode ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                ) : (
                  <><HiCheckCircle className="w-4 h-4" /> Submit Code</>
                )}
              </button>
            </div>
            <div className="w-24"></div> {/* Spacer for perfect centering */}
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
    <div className="w-full">
      <p className="text-xs text-gray-500 mb-3 text-center">Or type your answer below:</p>
      <div className="flex flex-col gap-4 items-center w-full max-w-2xl mx-auto">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())}
          placeholder="Type your conceptual answer here... (Press Shift+Enter for new line)"
          className="w-full bg-dark-800 border border-dark-border rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500 transition-colors resize-none h-24 shadow-inner"
        />
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="flex items-center justify-center gap-2 px-8 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold disabled:opacity-50 transition-all shadow-lg shadow-violet-900/40 w-56"
        >
          <HiCheckCircle className="w-5 h-5" /> Submit Answer
        </button>
      </div>
    </div>
  );
}
