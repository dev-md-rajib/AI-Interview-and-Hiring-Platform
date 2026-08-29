import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import {
  HiMicrophone, HiCamera, HiDesktopComputer, HiChatAlt2, HiCode,
  HiArrowLeft, HiArrowsExpand, HiInformationCircle, HiShieldCheck,
  HiX, HiPaperAirplane, HiRefresh, HiExclamationCircle, HiAdjustments,
} from 'react-icons/hi';
import {
  HiMicrophone as HiMicOff,
  HiVideoCamera as HiCamOff,
} from 'react-icons/hi2';
import { acquireMediaStream, getMediaErrorMessage } from '../../utils/mediaPermissions';
import MediaDeviceTroubleshootModal from './MediaDeviceTroubleshootModal';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
};

const LANGUAGES = [
  'javascript', 'python', 'java', 'cpp', 'csharp', 'go', 'sql', 'typescript', 'html',
];

const getSocketUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined' && window.location.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
};

export default function LiveWebRTCInterviewRoom({ interview, user, onLeave }) {
  const normalizedInterviewId = String(interview?._id || interview?.id || '').trim();

  // Media & WebRTC states
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);
  const [remoteMediaState, setRemoteMediaState] = useState({ isMuted: false, isVideoOff: false, isScreenSharing: false });
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mediaWarning, setMediaWarning] = useState(null);
  const [showTroubleshootModal, setShowTroubleshootModal] = useState(false);

  // Tab & Tools states
  const [activeTab, setActiveTab] = useState('none'); // 'chat' | 'code' | 'info' | 'none'
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [code, setCode] = useState('// Live Collaborative Code Pad\n// Start typing code here...\n\nfunction solution() {\n  \n}\n');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [callDuration, setCallDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting' | 'connected' | 'waiting'
  const [partnerTyping, setPartnerTyping] = useState(false);

  // Stable references across renders
  const userRef = useRef(user);
  userRef.current = user;

  const onLeaveRef = useRef(onLeave);
  onLeaveRef.current = onLeave;

  const codeLanguageRef = useRef(codeLanguage);
  codeLanguageRef.current = codeLanguage;

  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  const isVideoOffRef = useRef(isVideoOff);
  isVideoOffRef.current = isVideoOff;

  const isScreenSharingRef = useRef(isScreenSharing);
  isScreenSharingRef.current = isScreenSharing;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const screenTrackRef = useRef(null);
  const cameraTrackRef = useRef(null);
  const remoteSocketIdRef = useRef(null);
  const iceCandidatesQueueRef = useRef([]);
  const containerRef = useRef(null);
  const chatEndRef = useRef(null);
  const typingTimerRef = useRef(null);

  // Call duration counter
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const h = Math.floor(m / 60);
    if (h > 0) {
      return `${h}:${String(m % 60).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Scroll chat to bottom
  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  // Bind local video DOM element safely
  useEffect(() => {
    if (localVideoRef.current) {
      if (localStream && !isVideoOff) {
        if (localVideoRef.current.srcObject !== localStream) {
          localVideoRef.current.srcObject = localStream;
        }
        localVideoRef.current.play().catch(() => {});
      } else {
        localVideoRef.current.srcObject = null;
      }
    }
  }, [localStream, isVideoOff, isScreenSharing]);

  // Bind remote video DOM element safely
  useEffect(() => {
    if (remoteVideoRef.current) {
      if (remoteStream && !remoteMediaState.isVideoOff) {
        if (remoteVideoRef.current.srcObject !== remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        remoteVideoRef.current.play().catch(() => {});
      } else {
        remoteVideoRef.current.srcObject = null;
      }
    }
  }, [remoteStream, remoteMediaState.isVideoOff]);

  // Helper to drain queued ICE Candidates
  const drainIceCandidates = async (pc) => {
    if (!pc || !pc.remoteDescription || !pc.remoteDescription.type) return;
    while (iceCandidatesQueueRef.current.length > 0) {
      const candidate = iceCandidatesQueueRef.current.shift();
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn('Error applying queued ICE candidate:', err);
      }
    }
  };

  // Main Effect: Initialize Real Media & Socket once per normalizedInterviewId
  useEffect(() => {
    if (!normalizedInterviewId) return;

    let isCancelled = false;
    let localMediaStream = null;

    const createPeerConnectionInternal = (targetSocketId, activeSocket) => {
      if (pcRef.current) {
        try {
          pcRef.current.close();
        } catch (e) {}
      }

      iceCandidatesQueueRef.current = [];
      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcRef.current = pc;
      remoteSocketIdRef.current = targetSocketId;

      pc.onicecandidate = (event) => {
        if (event.candidate && targetSocketId && activeSocket) {
          activeSocket.emit('webrtc:ice_candidate', {
            targetSocketId,
            candidate: event.candidate,
            interviewId: normalizedInterviewId,
          });
        }
      };

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
          remoteStreamRef.current = event.streams[0];
        } else if (event.track) {
          let cur = remoteStreamRef.current;
          if (!cur) {
            cur = new MediaStream();
            remoteStreamRef.current = cur;
            setRemoteStream(cur);
          }
          cur.addTrack(event.track);
        }
        setConnectionStatus('connected');
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setConnectionStatus('connected');
        } else if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
          setConnectionStatus('waiting');
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
          setConnectionStatus('connected');
        } else if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
          setConnectionStatus('waiting');
        }
      };

      // Add active physical tracks to peer connection
      const activeLocal = localStreamRef.current;
      if (activeLocal) {
        activeLocal.getTracks().forEach((track) => {
          try {
            pc.addTrack(track, activeLocal);
          } catch (err) {
            console.warn('Error adding track to PC:', err);
          }
        });
      }

      return pc;
    };

    const initMediaAndSocket = async () => {
      // Check for Insecure Context (Non-HTTPS and Non-localhost HTTP)
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!window.isSecureContext && !isLocal) {
        setMediaWarning(
          'Browser Security Warning: Browsers block camera & mic on non-localhost HTTP origins (http://...). Please access via http://localhost:5173, enable HTTPS, or set chrome://flags/#unsafely-treat-insecure-origin-as-secure.'
        );
      }

      // 1. Acquire Real Physical Camera & Microphone with multi-tier fallback
      try {
        const { stream, videoTrack, audioTrack, errors } = await acquireMediaStream({ video: true, audio: true });

        if (isCancelled) {
          if (stream) stream.getTracks().forEach((t) => t.stop());
          return;
        }

        if (stream) {
          localMediaStream = stream;
          localStreamRef.current = stream;
          setLocalStream(stream);
          cameraTrackRef.current = videoTrack;
          setIsVideoOff(!videoTrack);
          setIsMuted(!audioTrack);
        } else {
          setIsVideoOff(true);
          setIsMuted(true);
          if (errors.length > 0) {
            const errInfo = getMediaErrorMessage(errors[errors.length - 1].error);
            toast.error(errInfo.title || 'Could not access camera or microphone.');
          }
        }
      } catch (mediaErr) {
        setIsVideoOff(true);
        setIsMuted(true);
        const errInfo = getMediaErrorMessage(mediaErr);
        toast.error(errInfo.title || 'Could not access camera or microphone.');
      }

      if (isCancelled) return;

      // 2. Initialize Socket Connection
      const socketUrl = getSocketUrl();
      const socket = io(socketUrl, {
        auth: { token: localStorage.getItem('token') },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('[WebRTC Socket] Connected:', socket.id);
        socket.emit('tracker:join', { interviewId: normalizedInterviewId });

        socket.emit('webrtc:join', {
          interviewId: normalizedInterviewId,
          user: {
            _id: userRef.current?._id || userRef.current?.id,
            name: userRef.current?.name || 'Participant',
            role: userRef.current?.role || 'CANDIDATE',
          },
          mediaState: {
            isMuted: isMutedRef.current,
            isVideoOff: isVideoOffRef.current || !localMediaStream || localMediaStream.getVideoTracks().length === 0,
            isScreenSharing: isScreenSharingRef.current,
          },
        });
      });

      socket.on('connect_error', (err) => {
        console.error('[WebRTC Socket] Connection error:', err.message);
      });

      // Initial Room State (cached code, language, and full chat history)
      socket.on('webrtc:room_state', ({ code: initCode, language: initLang, messages: initMessages }) => {
        if (initCode !== undefined) setCode(initCode);
        if (initLang) setCodeLanguage(initLang);
        if (initMessages && Array.isArray(initMessages)) {
          setChatMessages(initMessages);
        }
      });

      // Existing peers in room (caller role)
      socket.on('webrtc:existing_users', async (existingUsers) => {
        if (existingUsers && existingUsers.length > 0) {
          const peer = existingUsers[0];
          setRemoteUser(peer.user);
          if (peer.mediaState) setRemoteMediaState(peer.mediaState);

          const pc = createPeerConnectionInternal(peer.socketId, socket);

          try {
            const offer = await pc.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            });
            await pc.setLocalDescription(offer);
            socket.emit('webrtc:offer', {
              targetSocketId: peer.socketId,
              sdp: offer,
              senderUser: {
                _id: userRef.current?._id || userRef.current?.id,
                name: userRef.current?.name || 'Participant',
                role: userRef.current?.role || 'CANDIDATE',
              },
            });
          } catch (offerErr) {
            console.error('Error creating WebRTC offer:', offerErr);
          }
        } else {
          setConnectionStatus('waiting');
        }
      });

      // New peer joined notification
      socket.on('webrtc:user_joined', ({ socketId: newPeerSocketId, user: joinedUser, mediaState }) => {
        setRemoteUser(joinedUser);
        if (mediaState) setRemoteMediaState(mediaState);
        toast.success(`${joinedUser?.name || 'Participant'} joined the interview call! 🎉`);
      });

      // Handle WebRTC Offer (callee role)
      socket.on('webrtc:offer', async ({ senderSocketId, sdp, senderUser }) => {
        setRemoteUser(senderUser);
        const pc = createPeerConnectionInternal(senderSocketId, socket);

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          await drainIceCandidates(pc);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('webrtc:answer', {
            targetSocketId: senderSocketId,
            sdp: answer,
          });
        } catch (ansErr) {
          console.error('Error handling WebRTC offer:', ansErr);
        }
      });

      // Handle WebRTC Answer
      socket.on('webrtc:answer', async ({ sdp }) => {
        if (pcRef.current) {
          try {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
            await drainIceCandidates(pcRef.current);
          } catch (err) {
            console.error('Error setting remote description from answer:', err);
          }
        }
      });

      // Handle ICE Candidate
      socket.on('webrtc:ice_candidate', async ({ candidate }) => {
        if (pcRef.current && pcRef.current.remoteDescription && pcRef.current.remoteDescription.type) {
          try {
            await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error('Error adding ICE candidate:', err);
          }
        } else {
          iceCandidatesQueueRef.current.push(candidate);
        }
      });

      // Handle Partner Media State (Mute/Camera Off)
      socket.on('webrtc:peer_media_state', ({ isMuted: peerMuted, isVideoOff: peerVideoOff, isScreenSharing: peerScreen }) => {
        setRemoteMediaState({
          isMuted: peerMuted,
          isVideoOff: peerVideoOff,
          isScreenSharing: peerScreen,
        });
      });

      // Handle Live Chat Messages
      socket.on('webrtc:chat_message', (msg) => {
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      });

      // Handle Live Code Editor Updates
      socket.on('webrtc:code_change', ({ code: updatedCode, language: updatedLang }) => {
        if (updatedCode !== undefined) {
          setCode(updatedCode);
          setPartnerTyping(true);
          clearTimeout(typingTimerRef.current);
          typingTimerRef.current = setTimeout(() => setPartnerTyping(false), 1500);
        }
        if (updatedLang) setCodeLanguage(updatedLang);
      });

      // Handle Peer left
      socket.on('webrtc:user_left', () => {
        setRemoteStream(null);
        remoteStreamRef.current = null;
        setRemoteUser(null);
        setConnectionStatus('waiting');
        toast('Participant disconnected or left the call', { icon: 'ℹ️' });
      });

      // Listen for tracker desktop app termination
      socket.on('tracker:interview_ended', () => {
        toast('Interview session ended from Interview Tracker app 🛑', { icon: '🛑' });
        onLeaveRef.current?.();
      });
    };

    initMediaAndSocket();

    return () => {
      isCancelled = true;
      if (localMediaStream) {
        localMediaStream.getTracks().forEach((track) => track.stop());
      }
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
      }
      if (pcRef.current) {
        try {
          pcRef.current.close();
        } catch (e) {}
      }
      if (socketRef.current) {
        socketRef.current.emit('webrtc:leave', { interviewId: normalizedInterviewId });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [normalizedInterviewId]);

  // Toggle Microphone (Hardware Audio Track Mute / Unmute / Acquire)
  const toggleMute = async () => {
    const stream = localStreamRef.current;
    const existingAudioTrack = stream?.getAudioTracks()[0];

    if (existingAudioTrack) {
      const nextState = !existingAudioTrack.enabled;
      existingAudioTrack.enabled = nextState;
      const muted = !nextState;
      setIsMuted(muted);

      if (socketRef.current) {
        socketRef.current.emit('webrtc:media_state', {
          interviewId: normalizedInterviewId,
          isMuted: muted,
          isVideoOff,
          isScreenSharing,
        });
      }
      toast(muted ? 'Microphone muted 🔇' : 'Microphone unmuted 🎙️', { icon: muted ? '🔇' : '🎙️' });
    } else {
      // Audio track missing - acquire hardware audio with fallback
      try {
        const { audioTrack: newAudioTrack, errors } = await acquireMediaStream({ video: false, audio: true });
        if (newAudioTrack) {
          let activeStream = stream;
          if (!activeStream) {
            activeStream = new MediaStream();
            localStreamRef.current = activeStream;
            setLocalStream(activeStream);
          }
          activeStream.addTrack(newAudioTrack);
          setIsMuted(false);

          if (pcRef.current) {
            const senders = pcRef.current.getSenders();
            const audioSender = senders.find((s) => s.track && s.track.kind === 'audio');
            if (audioSender) {
              audioSender.replaceTrack(newAudioTrack);
            } else {
              pcRef.current.addTrack(newAudioTrack, activeStream);
            }
          }

          if (socketRef.current) {
            socketRef.current.emit('webrtc:media_state', {
              interviewId: normalizedInterviewId,
              isMuted: false,
              isVideoOff,
              isScreenSharing,
            });
          }
          toast.success('Microphone enabled 🎙️');
        } else {
          const lastErr = errors.length > 0 ? errors[errors.length - 1].error : new Error('Microphone unavailable');
          const errInfo = getMediaErrorMessage(lastErr);
          toast.error(errInfo.title || 'Could not access microphone.');
        }
      } catch (err) {
        console.error('Failed to enable microphone:', err);
        const errInfo = getMediaErrorMessage(err);
        toast.error(errInfo.title || 'Could not access microphone.');
      }
    }
  };

  // Toggle Camera (Hardware Video Track On / Off / Acquire)
  const toggleVideo = async () => {
    const stream = localStreamRef.current;
    const existingVideoTrack = stream?.getVideoTracks()[0];

    if (existingVideoTrack) {
      const nextState = !existingVideoTrack.enabled;
      existingVideoTrack.enabled = nextState;
      const videoOff = !nextState;
      setIsVideoOff(videoOff);

      if (socketRef.current) {
        socketRef.current.emit('webrtc:media_state', {
          interviewId: normalizedInterviewId,
          isVideoOff: videoOff,
          isMuted,
          isScreenSharing,
        });
      }
      toast(videoOff ? 'Camera turned off 📷' : 'Camera turned on 🎥', { icon: videoOff ? '🚫' : '🎥' });
    } else {
      // Video track missing - acquire hardware camera with fallback
      try {
        const { videoTrack: newVideoTrack, errors } = await acquireMediaStream({ video: true, audio: false });
        if (newVideoTrack) {
          cameraTrackRef.current = newVideoTrack;
          let activeStream = stream;
          if (!activeStream) {
            activeStream = new MediaStream();
            localStreamRef.current = activeStream;
            setLocalStream(activeStream);
          }
          activeStream.addTrack(newVideoTrack);
          setIsVideoOff(false);

          if (pcRef.current) {
            const senders = pcRef.current.getSenders();
            const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
            if (videoSender) {
              videoSender.replaceTrack(newVideoTrack);
            } else {
              pcRef.current.addTrack(newVideoTrack, activeStream);
            }
          }

          if (socketRef.current) {
            socketRef.current.emit('webrtc:media_state', {
              interviewId: normalizedInterviewId,
              isVideoOff: false,
              isMuted,
              isScreenSharing,
            });
          }
          toast.success('Camera enabled 🎥');
        } else {
          const lastErr = errors.length > 0 ? errors[errors.length - 1].error : new Error('Camera unavailable');
          const errInfo = getMediaErrorMessage(lastErr);
          toast.error(errInfo.title || 'Could not access camera.');
        }
      } catch (err) {
        console.error('Failed to enable camera:', err);
        const errInfo = getMediaErrorMessage(err);
        toast.error(errInfo.title || 'Could not access camera.');
      }
    }
  };

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
      const camTrack = cameraTrackRef.current || localStreamRef.current?.getVideoTracks()[0];
      if (camTrack && pcRef.current) {
        const senders = pcRef.current.getSenders();
        const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
        if (videoSender) {
          videoSender.replaceTrack(camTrack);
        }
      }
      setIsScreenSharing(false);

      if (socketRef.current) {
        socketRef.current.emit('webrtc:media_state', {
          interviewId: normalizedInterviewId,
          isVideoOff,
          isMuted,
          isScreenSharing: false,
        });
      }
      toast.success('Stopped sharing screen');
    } else {
      try {
        if (!navigator?.mediaDevices?.getDisplayMedia) {
          return toast.error('Screen sharing is not supported on this origin or browser.');
        }
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;

        if (pcRef.current) {
          const senders = pcRef.current.getSenders();
          const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
          if (videoSender) {
            videoSender.replaceTrack(screenTrack);
          } else if (localStreamRef.current) {
            pcRef.current.addTrack(screenTrack, localStreamRef.current);
          }
        }

        screenTrack.onended = () => {
          toggleScreenShare();
        };

        setIsScreenSharing(true);

        if (socketRef.current) {
          socketRef.current.emit('webrtc:media_state', {
            interviewId: normalizedInterviewId,
            isVideoOff: false,
            isMuted,
            isScreenSharing: true,
          });
        }
        toast.success('Sharing your screen 🖥️');
      } catch (err) {
        console.warn('Screen share canceled or failed:', err);
      }
    }
  };

  // Send Chat Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    const textToSend = newMessage.trim();
    if (!textToSend || !socketRef.current) return;

    socketRef.current.emit('webrtc:chat_message', {
      interviewId: normalizedInterviewId,
      text: textToSend,
      sender: {
        _id: userRef.current?._id || userRef.current?.id,
        name: userRef.current?.name || 'Me',
        role: userRef.current?.role || 'CANDIDATE',
      },
    });

    setNewMessage('');
  };

  // Send Code change with Live Sync
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socketRef.current) {
      socketRef.current.emit('webrtc:code_change', {
        interviewId: normalizedInterviewId,
        code: newCode,
        language: codeLanguage,
      });
    }
  };

  const handleLanguageChange = (newLang) => {
    setCodeLanguage(newLang);
    if (socketRef.current) {
      socketRef.current.emit('webrtc:code_change', {
        interviewId: normalizedInterviewId,
        code,
        language: newLang,
      });
    }
  };

  // Toggle Browser Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const isCandidate = user?.role === 'CANDIDATE';
  const partnerRole = isCandidate ? 'Interviewer' : 'Candidate';
  const partnerName = remoteUser?.name || (isCandidate ? interview?.interviewer?.name : interview?.candidate?.name) || partnerRole;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] w-screen h-screen bg-slate-950 flex flex-col overflow-hidden text-white select-none animate-fade-in"
    >
      {/* ── Top Warning Banner (Insecure Context / HTTP Alert) ── */}
      {mediaWarning && (
        <div className="bg-amber-900/90 text-amber-100 text-xs px-4 py-2 flex items-center justify-between gap-3 border-b border-amber-500/50 z-30">
          <div className="flex items-center gap-2">
            <HiExclamationCircle className="w-5 h-5 text-amber-300 flex-shrink-0" />
            <span>{mediaWarning}</span>
          </div>
          <button
            onClick={() => setMediaWarning(null)}
            className="text-amber-200 hover:text-white p-1"
          >
            <HiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Top Header Navigation Bar ── */}
      <header className="h-14 px-4 bg-dark-900/95 backdrop-blur-md border-b border-dark-border/80 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onLeaveRef.current?.()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-800 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold transition-all shadow-sm active:scale-95"
            title="Leave Call and return"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Leave Call</span>
          </button>

          <div className="h-4 w-[1px] bg-dark-border hidden sm:block" />

          {/* Subject & Level info */}
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${connectionStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-white font-bold text-xs sm:text-sm tracking-wide truncate">
              {interview?.stack} · Level {interview?.level}
            </span>
          </div>

          {/* Connected Partner Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-300 bg-dark-800 px-2.5 py-1 rounded-full border border-dark-border">
            <span className="text-gray-400">{partnerRole}:</span>
            <strong className="text-cyan-300 font-semibold">{partnerName}</strong>
            {connectionStatus === 'connected' ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Waiting..." />
            )}
          </div>
        </div>

        {/* Right Info: Timer, Status & Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Call Duration */}
          <div className="flex items-center gap-1.5 bg-dark-800/80 px-2.5 py-1 rounded-lg border border-dark-border font-mono text-xs text-cyan-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>{formatTime(callDuration)}</span>
          </div>

          {/* Anti-Cheat Shield indicator */}
          {isCandidate && (
            <div className="hidden lg:flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-medium">
              <HiShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Proctoring Active</span>
            </div>
          )}

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 border border-dark-border text-gray-300 hover:text-white transition-all text-xs"
            title="Toggle Fullscreen"
          >
            <HiArrowsExpand className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── Main Layout: Video Stage + Side Drawer ── */}
      <div className="flex-1 flex overflow-hidden relative bg-black">
        {/* Video Stage Viewport */}
        <div className="flex-1 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden">
          {/* Dual Video Grid */}
          <div className="w-full h-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center relative">
            
            {/* Remote Peer Video Container */}
            <div className="relative w-full h-full min-h-[260px] bg-dark-900/90 rounded-2xl border border-dark-border/80 overflow-hidden flex items-center justify-center shadow-2xl">
              {remoteStream && !remoteMediaState.isVideoOff ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-dark-800 border-2 border-cyan-500/30 flex items-center justify-center relative">
                    <span className="text-2xl font-bold text-cyan-300">{partnerName?.[0]?.toUpperCase()}</span>
                    <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                      {connectionStatus === 'connected' ? (
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-dark-900"></span>
                      ) : (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-dark-900"></span>
                        </>
                      )}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{partnerName}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {remoteMediaState.isVideoOff && connectionStatus === 'connected'
                        ? 'Camera turned off by participant'
                        : connectionStatus === 'connected'
                        ? 'Physical camera feed connected'
                        : `Waiting for ${partnerRole.toLowerCase()} to join...`}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-dark-800/80 rounded-full text-[11px] text-gray-400 border border-dark-border flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                    <span>{connectionStatus === 'connected' ? 'Hardware P2P Feed Active' : 'Waiting for direct connection'}</span>
                  </div>
                </div>
              )}

              {/* Remote Name & Status Overlay */}
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-dark-950/80 backdrop-blur-md border border-dark-border text-xs font-semibold flex items-center gap-2 text-white shadow-md">
                <span>{partnerName} ({partnerRole})</span>
                {remoteMediaState.isMuted && <span className="text-red-400 text-[11px] font-mono">(Muted)</span>}
                {remoteMediaState.isScreenSharing && <span className="text-cyan-300 text-[11px] font-mono">(Screen)</span>}
                {remoteStream && !remoteMediaState.isVideoOff && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
              </div>
            </div>

            {/* Local Video Container (Self View) */}
            <div className="relative w-full h-full min-h-[260px] bg-dark-900/90 rounded-2xl border border-dark-border/80 overflow-hidden flex items-center justify-center shadow-2xl">
              {isVideoOff ? (
                <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-dark-800 border border-dark-border flex items-center justify-center text-xl font-bold text-gray-400">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <p className="text-xs text-gray-400">Camera is turned off</p>
                  <button
                    onClick={toggleVideo}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600/40 hover:bg-cyan-600/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all mt-1 flex items-center gap-1.5 shadow-sm"
                  >
                    <HiCamera className="w-4 h-4" />
                    <span>Turn Camera On</span>
                  </button>
                </div>
              ) : (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover rounded-2xl ${isScreenSharing ? '' : '-scale-x-100'}`}
                />
              )}

              {/* Local Name & Status Overlay */}
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-dark-950/80 backdrop-blur-md border border-dark-border text-xs font-semibold flex items-center gap-2 text-white shadow-md">
                <span>You ({isCandidate ? 'Candidate' : 'Interviewer'})</span>
                {isMuted && <span className="text-red-400 text-[11px] font-mono">(Muted)</span>}
                {isScreenSharing && <span className="text-cyan-300 text-[11px] font-mono">(Sharing Screen)</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ── Side Drawer Panel (Chat, Code Editor, Info) ── */}
        {activeTab !== 'none' && (
          <aside className="w-80 sm:w-96 bg-dark-900/95 border-l border-dark-border flex flex-col h-full z-20 animate-fade-in shadow-2xl">
            {/* Drawer Header */}
            <div className="h-12 px-4 border-b border-dark-border flex items-center justify-between bg-dark-800/60">
              <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                {activeTab === 'chat' && <><HiChatAlt2 className="w-4 h-4 text-cyan-400" /> Meeting Chat</>}
                {activeTab === 'code' && <><HiCode className="w-4 h-4 text-primary-400" /> Collaborative Code Pad</>}
                {activeTab === 'info' && <><HiInformationCircle className="w-4 h-4 text-amber-400" /> Interview Details</>}
              </div>
              <button
                onClick={() => setActiveTab('none')}
                className="p-1 rounded-lg hover:bg-dark-700 text-gray-400 hover:text-white transition-colors"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>

            {/* Tab: Chat */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 text-xs py-10">
                      <HiChatAlt2 className="w-8 h-8 mb-2 opacity-40" />
                      <span>No messages yet. Send a message to your {partnerRole.toLowerCase()}!</span>
                    </div>
                  ) : (
                    chatMessages.map((msg) => {
                      const isMe = (msg.sender?._id || msg.sender?.id) === (userRef.current?._id || userRef.current?.id);
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <span className="text-[10px] text-gray-400 mb-0.5 px-1">{isMe ? 'You' : msg.sender?.name}</span>
                          <div className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${isMe ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-dark-800 text-gray-200 border border-dark-border rounded-bl-none'}`}>
                            {msg.text}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-dark-border bg-dark-800/40 flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 bg-dark-800 border border-dark-border rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white transition-all shadow-sm"
                  >
                    <HiPaperAirplane className="w-4 h-4 rotate-90" />
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Code Editor */}
            {activeTab === 'code' && (
              <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <select
                    value={codeLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-dark-800 border border-dark-border text-gray-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-primary-500 font-mono"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    {partnerTyping ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-bold animate-pulse">
                        <HiRefresh className="w-3 h-3 animate-spin" /> {partnerRole} is typing...
                      </span>
                    ) : (
                      <span className="text-cyan-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> Live Sync Active
                      </span>
                    )}
                  </div>
                </div>

                <textarea
                  value={code}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="Paste or write interview code here (synced in real-time)..."
                  spellCheck={false}
                  className="flex-1 w-full p-3 bg-dark-950 border border-dark-border rounded-xl font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed transition-colors selection:bg-cyan-900/50"
                />
              </div>
            )}

            {/* Tab: Info */}
            {activeTab === 'info' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-dark-800/80 border border-dark-border space-y-2">
                  <p className="font-bold text-white text-sm">{interview?.stack}</p>
                  <p className="text-gray-400">Level {interview?.level} Human Interview</p>
                  <p className="text-cyan-400 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Session: In Progress</span>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-dark-800/80 border border-dark-border space-y-2">
                  <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Candidate Details</p>
                  <p className="text-white font-bold">{interview?.candidate?.name || (isCandidate ? user?.name : 'Candidate')}</p>
                  <p className="text-gray-400">{interview?.candidate?.email || '—'}</p>
                </div>

                {interview?.interviewer && (
                  <div className="p-3.5 rounded-xl bg-dark-800/80 border border-dark-border space-y-2">
                    <p className="text-gray-400 font-semibold uppercase text-[10px] tracking-wider">Interviewer Details</p>
                    <p className="text-white font-bold">{interview.interviewer?.name || (!isCandidate ? user?.name : 'Interviewer')}</p>
                    <p className="text-gray-400">{interview.interviewer?.email || '—'}</p>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                  <p className="text-emerald-300 font-bold flex items-center gap-1.5">
                    <HiShieldCheck className="w-4 h-4" /> Built-In Encrypted WebRTC
                  </p>
                  <p className="text-gray-400 leading-relaxed text-[11px]">
                    Direct peer-to-peer connection with audio/video encryption, native inside your browser without 3rd party apps.
                  </p>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* ── Bottom Floating Meeting Controls Dock ── */}
      <footer className="h-20 bg-dark-900/95 backdrop-blur-md border-t border-dark-border flex items-center justify-center px-4 z-20 flex-shrink-0">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`p-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center active:scale-95 ${
              isMuted
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                : 'bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-border'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <HiMicOff className="w-5 h-5" /> : <HiMicrophone className="w-5 h-5 text-cyan-400" />}
          </button>

          {/* Camera Button */}
          <button
            onClick={toggleVideo}
            className={`p-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center active:scale-95 ${
              isVideoOff
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                : 'bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-border'
            }`}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoOff ? <HiCamOff className="w-5 h-5" /> : <HiCamera className="w-5 h-5 text-cyan-400" />}
          </button>

          {/* Screen Share Button */}
          <button
            onClick={toggleScreenShare}
            className={`p-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center active:scale-95 ${
              isScreenSharing
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white ring-2 ring-cyan-400/50 shadow-cyan-600/30'
                : 'bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-border'
            }`}
            title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
          >
            <HiDesktopComputer className="w-5 h-5 text-gray-300" />
          </button>

          <div className="h-6 w-[1px] bg-dark-border mx-1" />

          {/* Code Pad Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'code' ? 'none' : 'code')}
            className={`p-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center relative active:scale-95 ${
              activeTab === 'code'
                ? 'bg-primary-600 text-white ring-2 ring-primary-400/50'
                : 'bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-border'
            }`}
            title="Collaborative Code Pad"
          >
            <HiCode className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'chat' ? 'none' : 'chat')}
            className={`p-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center relative active:scale-95 ${
              activeTab === 'chat'
                ? 'bg-cyan-600 text-white ring-2 ring-cyan-400/50'
                : 'bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-border'
            }`}
            title="Meeting Chat"
          >
            <HiChatAlt2 className="w-5 h-5" />
          </button>

          {/* Info Toggle */}
          <button
            onClick={() => setActiveTab(activeTab === 'info' ? 'none' : 'info')}
            className={`p-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center active:scale-95 ${
              activeTab === 'info'
                ? 'bg-amber-600 text-white ring-2 ring-amber-400/50'
                : 'bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-border'
            }`}
            title="Interview Details"
          >
            <HiInformationCircle className="w-5 h-5" />
          </button>

          {/* Camera & Mic Troubleshooter */}
          <button
            onClick={() => setShowTroubleshootModal(true)}
            className="p-3.5 rounded-2xl bg-dark-800 hover:bg-dark-700 text-gray-200 border border-dark-border transition-all shadow-md flex items-center justify-center active:scale-95"
            title="Camera & Microphone Diagnostics"
          >
            <HiAdjustments className="w-5 h-5 text-violet-400" />
          </button>

          <div className="h-6 w-[1px] bg-dark-border mx-1" />

          {/* Leave / End Call Button */}
          <button
            onClick={() => onLeaveRef.current?.()}
            className="px-5 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95"
            title="Leave Meeting"
          >
            <span>End Call</span>
          </button>
        </div>
      </footer>

      {/* Camera & Microphone Troubleshoot Modal */}
      <MediaDeviceTroubleshootModal
        isOpen={showTroubleshootModal}
        onClose={() => setShowTroubleshootModal(false)}
        onDevicesReady={(newStream) => {
          if (newStream) {
            const vTrack = newStream.getVideoTracks()[0] || null;
            const aTrack = newStream.getAudioTracks()[0] || null;
            localStreamRef.current = newStream;
            setLocalStream(newStream);
            cameraTrackRef.current = vTrack;
            setIsVideoOff(!vTrack);
            setIsMuted(!aTrack);

            if (pcRef.current) {
              const senders = pcRef.current.getSenders();
              if (vTrack) {
                const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
                if (videoSender) videoSender.replaceTrack(vTrack);
                else pcRef.current.addTrack(vTrack, newStream);
              }
              if (aTrack) {
                const audioSender = senders.find((s) => s.track && s.track.kind === 'audio');
                if (audioSender) audioSender.replaceTrack(aTrack);
                else pcRef.current.addTrack(aTrack, newStream);
              }
            }
          }
          setShowTroubleshootModal(false);
        }}
      />
    </div>
  );
}
