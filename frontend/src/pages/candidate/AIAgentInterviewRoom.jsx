import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import api from '../../services/api';
import {
  HiMicrophone, HiVolumeUp, HiCode, HiCheckCircle, HiXCircle,
  HiClock, HiChartBar, HiStop, HiPlay, HiRefresh, HiVideoCamera, HiShieldExclamation, HiBriefcase,
  HiExclamation, HiAdjustments
} from 'react-icons/hi';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { getSectorById, isSector } from '../../constants/sectors';
import { handlePasteViolation } from '../../utils/proctoring';
import { acquireMediaStream, checkMediaDevices, getMediaErrorMessage } from '../../utils/mediaPermissions';
import MediaDeviceTroubleshootModal from '../../components/interview/MediaDeviceTroubleshootModal';

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
      if (e.error === 'not-allowed') {
        toast.error('Microphone permission blocked. Please allow mic in browser URL bar 🎙️');
      } else if (e.error === 'audio-capture') {
        toast.error('No microphone hardware detected. Check your mic connection 🎙️');
      } else if (e.error !== 'no-speech') {
        toast.error(`Mic error: ${e.error}`);
      }
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
      <div className={`card text-center border-2 ${result.passed ? 'border-accent-500/40 bg-emerald-50/60 dark:bg-emerald-900/10' : 'border-danger-500/40 bg-red-50/60 dark:bg-red-900/10'}`}>
        {result.passed ? <HiCheckCircle className="w-16 h-16 text-emerald-500 dark:text-accent-400 mx-auto mb-3" /> : <HiXCircle className="w-16 h-16 text-red-500 dark:text-danger-400 mx-auto mb-3" />}
        <h1 className={`text-3xl font-bold ${result.passed ? 'text-emerald-600 dark:text-white' : 'text-red-600 dark:text-white'}`}>{result.passed ? '🎉 Interview Passed!' : '❌ Interview Failed'}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">{result.stack} • Level {result.level} • AI Agent Interview</p>
        <div className="mt-6">
          <div className="text-6xl font-black text-gradient">{result.totalScore}%</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overall Score (Pass mark: {result.passMark}%)</p>
        </div>
        {/* Coding vs Concept score breakdown */}
        {(result.codingScore != null || result.conceptScore != null || result.trustScore != null) && (
          <div className="mt-5 grid grid-cols-3 gap-3 max-w-lg mx-auto">
            <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-500/30">
              <p className="text-xs text-violet-700 dark:text-violet-300 mb-1 font-semibold">💻 Coding</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.codingScore ?? '—'}%</p>
            </div>
            <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-500/30">
              <p className="text-xs text-primary-700 dark:text-primary-300 mb-1 font-semibold">🧠 Concepts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.conceptScore ?? '—'}%</p>
            </div>
            <div className={`p-3 rounded-lg border flex flex-col items-center justify-center ${
              result.trustScore < 80 ? 'bg-red-50 dark:bg-danger-900/30 border-red-200 dark:border-danger-500/30' : 'bg-emerald-50 dark:bg-success-900/30 border-emerald-200 dark:border-success-500/30'
            }`}>
              <div className="flex items-center gap-1">
                <p className={`text-xs mb-1 font-semibold ${result.trustScore < 80 ? 'text-red-700 dark:text-danger-300' : 'text-emerald-700 dark:text-success-300'}`}>
                  🛡️ Trust Score
                </p>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.trustScore ?? 100}%</p>
              {(result.cheatCount > 0) && (
                <p className="text-[10px] text-red-600 dark:text-danger-400 font-bold uppercase mt-1">
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
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{result.feedback}</p>
          {result.recommendations && (
            <div className="mt-3 p-3 bg-dark-800 rounded-lg border border-dark-border">
              <p className="text-primary-700 dark:text-primary-300 text-sm"><span className="font-semibold text-gray-900 dark:text-white">Recommendations: </span>{result.recommendations}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.strengths?.length > 0 && (
          <div className="card">
            <h3 className="text-emerald-600 dark:text-accent-400 font-bold mb-3">✅ Strengths</h3>
            <ul className="space-y-2">
              {result.strengths.map((s, i) => <li key={i} className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2"><span className="text-emerald-500 dark:text-accent-400">•</span>{s}</li>)}
            </ul>
          </div>
        )}
        {result.weaknesses?.length > 0 && (
          <div className="card">
            <h3 className="text-red-600 dark:text-danger-400 font-bold mb-3">⚠️ Areas to Improve</h3>
            <ul className="space-y-2">
              {result.weaknesses.map((w, i) => <li key={i} className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2"><span className="text-red-500 dark:text-danger-400">•</span>{w}</li>)}
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
  const streamRef = useRef(null);
  const lookAwayStartRef = useRef(null);
  const currentlyAwayRef = useRef(false);
  const alertUntilRef = useRef(0);

  const [proctorStatus, setProctorStatus] = useState('Initializing AI Proctor...');
  const [mediaError, setMediaError] = useState(null);
  const [showTroubleshootModal, setShowTroubleshootModal] = useState(false);
  const [isReconnectingMedia, setIsReconnectingMedia] = useState(false);
  const [cheatCount, setCheatCount] = useState(0);
  const [lookingAway, setLookingAway] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  const [faceFound, setFaceFound] = useState(true);

  // Stop webcam, face landmarker, and detection loop
  const stopProctoring = useCallback(() => {
    if (reqAFRef.current) {
      cancelAnimationFrame(reqAFRef.current);
      reqAFRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (landmarkerRef.current) {
      landmarkerRef.current.close();
      landmarkerRef.current = null;
    }
  }, []);

  // Frame processing loop
  const detectFrames = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    if (video.readyState < 2) {
      reqAFRef.current = requestAnimationFrame(detectFrames);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    const w = canvas.width;
    const h = canvas.height;

    // Clear previous overlay frame (video is rendered directly in <video>)
    ctx.clearRect(0, 0, w, h);

    // If landmarker model is ready, run facial analysis
    if (landmarkerRef.current) {
      const now = performance.now();
      try {
        const results = landmarkerRef.current.detectForVideo(video, now);
        let found = false;

        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          found = true;
          const landmarks = results.faceLandmarks[0];

          // Draw landmark dots
          ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
          for (const pt of landmarks) {
            ctx.beginPath();
            ctx.arc(w - (pt.x * w), pt.y * h, 1.5, 0, 2 * Math.PI);
            ctx.fill();
          }

          // Multi-face detection check
          if (results.faceLandmarks.length > 1) {
            const msNow = Date.now();
            if (msNow > alertUntilRef.current) {
              setCheatCount((prev) => {
                const next = prev + 10;
                setAlertMsg(`MULTIPLE FACES DETECTED (+10 penalty)`);
                alertUntilRef.current = msNow + 3000;
                return next;
              });
            }
          }

          let yaw = 0, pitch = 0;
          if (results.facialTransformationMatrixes && results.facialTransformationMatrixes.length > 0) {
            const mat = results.facialTransformationMatrixes[0];
            const euler = rotationMatrixToEuler(mat.data);
            yaw = euler.yaw;
            pitch = euler.pitch;
          }

          const gaze = getIrisGaze(landmarks);
          const isYawOff = Math.abs(yaw) > YAW_THRESHOLD;
          const isPitchOff = Math.abs(pitch) > PITCH_THRESHOLD;
          const isGazeOff = Math.abs(gaze.x) > GAZE_THRESHOLD || Math.abs(gaze.y) > GAZE_THRESHOLD;
          const isAway = isYawOff || isPitchOff || isGazeOff;

          const msNow = Date.now();
          if (isAway) {
            if (!lookAwayStartRef.current) {
              lookAwayStartRef.current = msNow;
            } else {
              const elapsed = msNow - lookAwayStartRef.current;
              if (elapsed > LOOK_AWAY_TIME && !currentlyAwayRef.current) {
                currentlyAwayRef.current = true;
                setCheatCount((prev) => {
                  const next = prev + 1;
                  setAlertMsg(`LOOKING AWAY DETECTED (Cheat count: ${next})`);
                  alertUntilRef.current = msNow + 3000;
                  return next;
                });
              }
            }
            setLookingAway(true);
          } else {
            lookAwayStartRef.current = null;
            currentlyAwayRef.current = false;
            setLookingAway(false);
          }
        } else {
          setFaceFound(false);
        }

        if (found) setFaceFound(true);
      } catch (detectErr) {
        console.warn('Frame detection error:', detectErr);
      }
    }

    if (Date.now() > alertUntilRef.current) {
      setAlertMsg('');
    }

    reqAFRef.current = requestAnimationFrame(detectFrames);
  }, []);

  const setupCameraAndProctoring = useCallback(async () => {
    setIsReconnectingMedia(true);
    setProctorStatus('Starting Camera...');
    setMediaError(null);

    try {
      const { stream, videoTrack, audioTrack, errors } = await acquireMediaStream({ video: true, audio: true });

      if (stream && videoTrack) {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch (playErr) {
            console.warn('Video autoplay waiting for metadata:', playErr);
          }
          setProctorStatus('Active');
          reqAFRef.current = requestAnimationFrame(detectFrames);
        }
      } else if (stream && audioTrack) {
        streamRef.current = stream;
        setProctorStatus('Audio Mode (Webcam Offline)');
        toast('Running in Audio Mode. Camera not detected or offline 🎙️', { icon: '🎙️', duration: 4000 });
      } else {
        const lastErr = errors.length > 0 ? errors[errors.length - 1].error : new Error('No media stream available');
        const formattedErr = getMediaErrorMessage(lastErr);
        setMediaError(formattedErr);
        setProctorStatus('Device Offline / Blocked');
        toast.error(formattedErr.title || 'Camera / Microphone unavailable');
      }
    } catch (err) {
      console.error('Camera startup error in AI Agent Room:', err);
      const formattedErr = getMediaErrorMessage(err);
      setMediaError(formattedErr);
      setProctorStatus('Camera Access Error');
      toast.error(formattedErr.title || 'Could not access camera');
    } finally {
      setIsReconnectingMedia(false);
    }
  }, [detectFrames]);

  // Initialize Webcam and MediaPipe
  useEffect(() => {
    let isCancelled = false;

    const initialize = async () => {
      await setupCameraAndProctoring();

      // Load MediaPipe in Background (non-blocking)
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        if (isCancelled) return;

        landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/face_landmarker.task",
            delegate: "GPU",
          },
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: true,
          numFaces: 4,
          runningMode: "VIDEO",
        }).catch(async (gpuErr) => {
          console.warn('MediaPipe GPU delegate failed, trying CPU fallback:', gpuErr);
          return await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "/models/face_landmarker.task",
              delegate: "CPU",
            },
            outputFaceBlendshapes: false,
            outputFacialTransformationMatrixes: true,
            numFaces: 4,
            runningMode: "VIDEO",
          });
        });
      } catch (mpErr) {
        console.warn('MediaPipe Face Landmarker background load warning:', mpErr);
      }
    };

    initialize();

    return () => {
      isCancelled = true;
      stopProctoring();
    };
  }, [stopProctoring, setupCameraAndProctoring]);

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
    stopProctoring();
    try {
      const { data } = await api.post(`/interviews/ai-agent/${interviewIdRef.current}/end`, { cheatCount });
      setResult(data);
    } catch (err) {
      toast.error('Failed to evaluate interview');
    }
  }, [cheatCount, stopSpeech, stopProctoring]);

  const socketRef = useRef(null);

  // Listen for tracker desktop app interview termination
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      auth: { token: localStorage.getItem('token') },
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.emit('tracker:join', { interviewId: id });

    socket.on('tracker:interview_ended', () => {
      toast('Interview terminated from Interview Tracker app 🛑', { icon: '🛑' });
      endInterview();
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [id, endInterview]);

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
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setupCameraAndProctoring()}
              title="Reconnect Camera / Mic"
              disabled={isReconnectingMedia}
              className="p-1 rounded bg-dark-700 hover:bg-violet-600 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <HiRefresh className={`w-3.5 h-3.5 ${isReconnectingMedia ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => setShowTroubleshootModal(true)}
              title="Camera & Mic Settings"
              className="p-1 rounded bg-dark-700 hover:bg-cyan-600 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <HiAdjustments className="w-3.5 h-3.5" />
            </button>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${proctorStatus === 'Active' ? 'bg-success-500/20 text-success-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
              {proctorStatus}
            </span>
          </div>
        </div>
        
        <div className="relative w-full h-[240px] bg-black overflow-hidden">
          {/* Native Hardware-Accelerated Video Feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
          {/* Transparent Canvas Overlay for Facial Landmark Tracking */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
          
          {/* Fallback Overlay when Camera is Offline */}
          {proctorStatus !== 'Active' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-950/90 text-center gap-2 z-10">
              <div className="p-3 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                <HiVideoCamera className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-gray-200">
                {mediaError?.title || proctorStatus}
              </p>
              <p className="text-[10px] text-gray-400 max-w-[240px]">
                {mediaError?.action || 'Check camera permissions or reconnect.'}
              </p>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setupCameraAndProctoring()}
                  disabled={isReconnectingMedia}
                  className="px-3 py-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-violet-900/40"
                >
                  <HiRefresh className={`w-3.5 h-3.5 ${isReconnectingMedia ? 'animate-spin' : ''}`} />
                  Reconnect
                </button>
                <button
                  type="button"
                  onClick={() => setShowTroubleshootModal(true)}
                  className="px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all border border-gray-700"
                >
                  <HiAdjustments className="w-3.5 h-3.5" />
                  Fix Help
                </button>
              </div>
            </div>
          )}

          {/* Overlay UI elements drawn in React instead of Canvas text for sharper rendering */}
          {proctorStatus === 'Active' && (
            <div className="absolute top-2 left-2 text-[10px] font-mono font-bold space-y-1 drop-shadow-md z-10">
              <div className="text-danger-400 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">WARNINGS: {cheatCount}</div>
              <div className={lookingAway ? 'text-danger-400 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm' : 'text-success-400 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm'}>
                {lookingAway ? 'LOOKING AWAY' : 'OK - FOCUSED'}
              </div>
              {!faceFound && <div className="text-danger-400 bg-black/60 px-1.5 py-0.5 rounded animate-pulse backdrop-blur-sm">NO FACE DETECTED!</div>}
            </div>
          )}

          {alertMsg && (
            <div className="absolute inset-0 flex items-center justify-center bg-danger-900/60 backdrop-blur-sm animate-fade-in z-20">
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
            {initData?.interviewMode === 'business' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-800/50 text-amber-300 border border-amber-600/40">
                {getSectorById(initData?.stack)?.icon || '💼'} {initData?.stack}
              </span>
            ) : (
              <span className="text-gray-400 text-sm">{initData?.stack} · Level {initData?.level}</span>
            )}
            <span className="text-gray-400 text-sm">· Level {initData?.level}</span>
          </div>
          <h1 className="text-white font-bold">
            {initData?.interviewMode === 'business' ? 'Professional Domain AI Interview' : 'AI Agent Interview'}
          </h1>
          {initData?.interviewMode === 'business' && (
            <p className="text-amber-400/80 text-xs mt-0.5">🎙️ Scenario-based voice interview — domain-specific assessment</p>
          )}
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

      {/* Code editor panel — appears when isCodingQuestion and NOT a business sector interview */}
      {phase === 'coding' && initData?.interviewMode !== 'business' && (
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
            onPaste={(e) => handlePasteViolation(e, id, 'AI Agent Interview Code Editor', socketRef.current)}
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
              <TextAnswerFallback
                onSubmit={handleVoiceAnswer}
                onPaste={(e) => handlePasteViolation(e, id, 'AI Agent Interview Text Fallback', socketRef.current)}
              />
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

      {/* Media Device Troubleshoot Modal */}
      <MediaDeviceTroubleshootModal
        isOpen={showTroubleshootModal}
        onClose={() => setShowTroubleshootModal(false)}
        onDevicesReady={() => {
          setupCameraAndProctoring();
          setShowTroubleshootModal(false);
        }}
      />
    </div>
  );
}

/* ─── Text fallback for when TTS not usable ─────────────────── */
function TextAnswerFallback({ onSubmit, onPaste }) {
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
          onPaste={onPaste}
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
