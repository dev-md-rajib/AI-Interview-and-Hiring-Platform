import React, { useState, useEffect, useRef } from 'react';
import {
  HiCamera, HiMicrophone, HiX, HiRefresh, HiShieldCheck,
  HiExclamation, HiCheckCircle, HiDesktopComputer, HiInformationCircle,
  HiKey, HiAdjustments
} from 'react-icons/hi';
import { checkMediaDevices, acquireMediaStream, getMediaErrorMessage } from '../../utils/mediaPermissions';
import toast from 'react-hot-toast';

export default function MediaDeviceTroubleshootModal({ isOpen, onClose, onDevicesReady }) {
  const [loading, setLoading] = useState(true);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [testStream, setTestStream] = useState(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [activeTab, setActiveTab] = useState('status'); // 'status' | 'windows' | 'browser'
  const [latestError, setLatestError] = useState(null);

  const videoPreviewRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  const stopPreview = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (testStream) {
      testStream.getTracks().forEach((t) => t.stop());
      setTestStream(null);
    }
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    setAudioLevel(0);
  };

  const runDiagnostics = async (attemptAcquire = true) => {
    setLoading(true);
    setLatestError(null);
    stopPreview();

    try {
      const info = await checkMediaDevices();
      setDeviceInfo(info);

      if (attemptAcquire) {
        try {
          const { stream, videoTrack, audioTrack, errors } = await acquireMediaStream({ video: true, audio: true });
          
          if (stream) {
            setTestStream(stream);
            if (videoPreviewRef.current && videoTrack) {
              videoPreviewRef.current.srcObject = stream;
              videoPreviewRef.current.play().catch(() => {});
            }

            // Set up audio visualizer if audio track exists
            if (audioTrack) {
              try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                const audioCtx = new AudioCtx();
                audioContextRef.current = audioCtx;
                const source = audioCtx.createMediaStreamSource(stream);
                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 256;
                source.connect(analyser);
                analyserRef.current = analyser;

                const dataArray = new Uint8Array(analyser.frequencyBinCount);
                const updateVolume = () => {
                  if (!analyserRef.current) return;
                  analyserRef.current.getByteFrequencyData(dataArray);
                  let sum = 0;
                  for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i];
                  }
                  const avg = sum / dataArray.length;
                  setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
                  animFrameRef.current = requestAnimationFrame(updateVolume);
                };
                updateVolume();
              } catch (audioErr) {
                console.warn('Audio visualization init error:', audioErr);
              }
            }

            // Re-enumerate to capture accurate labels once permission is granted
            const updatedInfo = await checkMediaDevices();
            setDeviceInfo(updatedInfo);
            toast.success('Camera & Microphone are working properly! 🎉');
            if (onDevicesReady) onDevicesReady(stream);
          } else if (errors.length > 0) {
            const lastErr = errors[errors.length - 1].error;
            setLatestError(getMediaErrorMessage(lastErr));
          }
        } catch (acquireErr) {
          setLatestError(getMediaErrorMessage(acquireErr));
        }
      }
    } catch (err) {
      console.error('Diagnostics error:', err);
      setLatestError(getMediaErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runDiagnostics(true);
    } else {
      stopPreview();
    }
    return () => {
      stopPreview();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const hasVideo = Boolean(testStream?.getVideoTracks()?.length);
  const hasAudio = Boolean(testStream?.getAudioTracks()?.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <HiCamera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Camera & Microphone Troubleshooter</h2>
              <p className="text-xs text-gray-400">Diagnostic helper & permission repair</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-800 bg-gray-950/60 px-6 pt-2 gap-2 text-sm font-medium">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'status'
                ? 'border-violet-500 text-violet-400 font-semibold'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <HiShieldCheck className="w-4 h-4" /> Live Hardware Test
          </button>
          <button
            onClick={() => setActiveTab('browser')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'browser'
                ? 'border-violet-500 text-violet-400 font-semibold'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <HiInformationCircle className="w-4 h-4" /> Browser Permissions
          </button>
          <button
            onClick={() => setActiveTab('windows')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'windows'
                ? 'border-violet-500 text-violet-400 font-semibold'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <HiAdjustments className="w-4 h-4" /> Windows Privacy Fix
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'status' && (
            <div className="space-y-5">
              {/* Preview & Audio Meter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Camera Preview */}
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-gray-800 flex items-center justify-center">
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover transform -scale-x-100 ${!hasVideo ? 'hidden' : ''}`}
                  />
                  {!hasVideo && (
                    <div className="flex flex-col items-center gap-2 text-center p-4">
                      <div className="p-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        <HiCamera className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-semibold text-gray-300">Camera Feed Inactive</p>
                      <p className="text-[11px] text-gray-500">Click &quot;Request &amp; Test Permissions&quot; below</p>
                    </div>
                  )}
                  {hasVideo && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-500/80 text-white text-[10px] font-bold tracking-wider uppercase">
                      Camera OK
                    </span>
                  )}
                </div>

                {/* Microphone Activity */}
                <div className="rounded-xl p-4 bg-gray-800/40 border border-gray-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <HiMicrophone className={`w-5 h-5 ${hasAudio ? 'text-emerald-400' : 'text-gray-500'}`} />
                        <span className="text-sm font-semibold text-gray-200">Microphone Level</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${hasAudio ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                        {hasAudio ? 'ACTIVE' : 'OFFLINE'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Speak into your microphone. The meter should jump green when sound is detected.
                    </p>
                  </div>

                  {/* Volume Bar */}
                  <div className="space-y-1.5 my-3">
                    <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700 p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500 rounded-full transition-all duration-75"
                        style={{ width: `${Math.max(4, audioLevel)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                      <span>Mute</span>
                      <span>Level: {audioLevel}%</span>
                      <span>Peak</span>
                    </div>
                  </div>

                  {/* Detected Devices Count */}
                  <div className="text-[11px] text-gray-400 flex items-center justify-between pt-2 border-t border-gray-800">
                    <span>Detected Hardware:</span>
                    <span className="font-semibold text-gray-300">
                      {deviceInfo?.videoDevices?.length ?? 0} Cameras • {deviceInfo?.audioInputDevices?.length ?? 0} Mics
                    </span>
                  </div>
                </div>
              </div>

              {/* Error Callout if any */}
              {latestError && (
                <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-200 text-xs space-y-1 animate-slide-up">
                  <div className="flex items-center gap-2 font-bold text-red-400">
                    <HiExclamation className="w-4 h-4" /> {latestError.title}
                  </div>
                  <p className="text-gray-300">{latestError.details}</p>
                  <p className="text-red-300 font-medium">💡 Fix: {latestError.action}</p>
                </div>
              )}

              {/* Device List & Health Badges */}
              <div className="rounded-xl bg-gray-800/20 border border-gray-800 p-4 space-y-3">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Device Inventory</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                    <div className="flex items-center gap-2 truncate">
                      <HiCamera className="w-4 h-4 text-violet-400 shrink-0" />
                      <span className="text-gray-300 truncate">
                        {deviceInfo?.videoDevices?.[0]?.label || (deviceInfo?.hasCamera ? 'Physical Webcam Detected' : 'No Webcam Detected')}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${hasVideo ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {hasVideo ? 'Connected' : 'Unavailable'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-900/60 border border-gray-800">
                    <div className="flex items-center gap-2 truncate">
                      <HiMicrophone className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-gray-300 truncate">
                        {deviceInfo?.audioInputDevices?.[0]?.label || (deviceInfo?.hasMicrophone ? 'Physical Microphone Detected' : 'No Microphone Detected')}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${hasAudio ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {hasAudio ? 'Connected' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'browser' && (
            <div className="space-y-4 text-xs text-gray-300">
              <div className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/30 space-y-2">
                <h3 className="font-bold text-violet-300 text-sm flex items-center gap-1.5">
                  <HiInformationCircle className="w-4 h-4" /> How to Allow Permissions in Chrome &amp; Edge
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300 pl-1">
                  <li>
                    Look at the left side of your browser URL bar at the top and click the <strong>Tune / Lock icon 🔒</strong>.
                  </li>
                  <li>
                    Find <strong>Camera</strong> and <strong>Microphone</strong> switches and toggle them to <strong>Allow</strong>.
                  </li>
                  <li>
                    If prompted, click <strong>Reload</strong> or click the <em>&quot;Request &amp; Test Permissions&quot;</em> button below.
                  </li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-gray-800/40 border border-gray-800 space-y-2">
                <h4 className="font-bold text-gray-200">Origin Security Note:</h4>
                <p className="text-gray-400 leading-relaxed">
                  WebRTC and media devices require a Secure Context (HTTPS or <code>http://localhost</code>). If you are accessing from a local network IP (like <code>http://192.168.x.x:5173</code>), Chromium blocks media hardware by default. Use <code>http://localhost:5173</code> instead.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'windows' && (
            <div className="space-y-4 text-xs text-gray-300">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                <h3 className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                  <HiDesktopComputer className="w-4 h-4" /> Windows Privacy Settings Fix
                </h3>
                <p className="text-gray-300">
                  If your browser says permissions are granted but no video or audio stream appears, Windows OS Privacy might be blocking desktop apps:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-300 pl-1">
                  <li>
                    Press <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 text-cyan-400 font-mono">Win + I</kbd> to open Windows Settings.
                  </li>
                  <li>
                    Navigate to <strong>Privacy &amp; security</strong> &rarr; <strong>Camera</strong>.
                  </li>
                  <li>
                    Ensure <strong>&quot;Camera access&quot;</strong> and <strong>&quot;Let desktop apps access your camera&quot;</strong> are toggled <strong>ON</strong>.
                  </li>
                  <li>
                    Do the same for <strong>Privacy &amp; security</strong> &rarr; <strong>Microphone</strong>.
                  </li>
                  <li>
                    Check your laptop keyboard for a physical camera key (such as <kbd className="px-1 py-0.5 rounded bg-gray-800 font-mono">Fn + F6</kbd> or <kbd className="px-1 py-0.5 rounded bg-gray-800 font-mono">Fn + F10</kbd>) or a mechanical slider next to the lens.
                  </li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-950/80 border-t border-gray-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => runDiagnostics(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-600/30 disabled:opacity-50 transition-all cursor-pointer"
          >
            <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Testing Devices...' : 'Request & Test Permissions'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
