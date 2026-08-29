const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const TrackerSession = require('../models/TrackerSession');
const logger = require('../config/logger');

let io = null;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
      credentials: true,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ai_hiring_platform_super_secret_jwt_key_2025');
        socket.user = decoded;
      } catch (err) {
        logger.warn(`Socket auth token verification failed: ${err.message}`);
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (User: ${socket.user?.id || 'anonymous'})`);

    // Join candidate room automatically if authenticated
    if (socket.user?.id) {
      socket.join(`candidate_${socket.user.id}`);
    }

    // Tracker app explicitly joins candidate and interview channels
    socket.on('tracker:join', async ({ candidateId, interviewId }) => {
      const candId = candidateId || socket.user?.id;
      if (candId) {
        socket.join(`candidate_${candId}`);
        logger.info(`Socket ${socket.id} joined candidate_${candId}`);
      }
      if (interviewId) {
        socket.join(`interview_${interviewId}`);
        logger.info(`Socket ${socket.id} joined interview_${interviewId}`);
      }
    });

    // Tracker status updates (e.g. ready, active, completed, terminated)
    socket.on('tracker:status_update', async (data) => {
      try {
        const candId = data.candidateId || socket.user?.id;
        const interviewId = data.interviewId || '';
        const status = data.status || 'idle';

        if (candId) {
          // Update DB tracker session
          await TrackerSession.findOneAndUpdate(
            { candidate: candId, status: { $in: ['ready', 'active', 'idle'] } },
            {
              status,
              interviewId,
              lastHeartbeat: new Date(),
              ...(status === 'active' ? { startedAt: new Date() } : {}),
              ...(status === 'completed' || status === 'terminated' ? { endedAt: new Date(), endedBy: 'candidate' } : {}),
            },
            { upsert: true, new: true }
          );

          // Broadcast status change to website client in real time
          io.to(`candidate_${candId}`).emit('tracker:status_change', {
            candidateId: candId,
            interviewId,
            status,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (err) {
        logger.error(`Error in tracker:status_update: ${err.message}`);
      }
    });

    // Heartbeat from tracker app
    socket.on('tracker:heartbeat', async (data) => {
      try {
        const candId = data.candidateId || socket.user?.id;
        if (candId) {
          await TrackerSession.findOneAndUpdate(
            { candidate: candId, status: 'active' },
            { lastHeartbeat: new Date() }
          );
        }
      } catch (err) {
        // silent
      }
    });

    // Violation attempt from website (e.g. paste attempt)
    socket.on('tracker:violation_attempt', (data) => {
      try {
        const candId = data?.candidateId || socket.user?.id;
        const interviewId = data?.interviewId;
        const reason = data?.reason || 'Clipboard Paste Attempt - Pasting text into answer box';
        const targetName = data?.targetName || 'Candidate Answer Box';

        logger.warn(`Proctoring violation event received for candidate ${candId}: ${reason}`);

        if (candId) {
          emitToCandidate(candId, 'tracker:trigger_violation_capture', {
            candidateId: candId,
            interviewId,
            reason,
            targetName,
          });
        }
      } catch (err) {
        logger.error(`Error in tracker:violation_attempt: ${err.message}`);
      }
    });

    // ──────────────────────────────────────────────
    // 🎥 IN-APP WEBRTC VIDEO CALL SIGNALING
    // ──────────────────────────────────────────────
    const activeVideoRooms = global.activeVideoRooms || new Map();
    global.activeVideoRooms = activeVideoRooms;

    socket.on('webrtc:join', ({ interviewId, user, mediaState }) => {
      const normId = String(interviewId || '').trim();
      if (!normId) return;

      const room = `interview_video_${normId}`;
      socket.join(room);
      socket.interviewVideoRoom = room;
      socket.interviewId = normId;
      socket.userData = user || socket.user || { name: 'Participant' };
      socket.mediaState = mediaState || { isMuted: false, isVideoOff: false, isScreenSharing: false };

      if (!activeVideoRooms.has(normId)) {
        activeVideoRooms.set(normId, {
          code: '// Live Collaborative Code Pad\n// Start typing code here...\n\nfunction solution() {\n  \n}\n',
          language: 'javascript',
          messages: [],
          users: new Map(),
        });
      }

      const roomData = activeVideoRooms.get(normId);
      roomData.users.set(socket.id, {
        socketId: socket.id,
        user: socket.userData,
        mediaState: socket.mediaState,
      });

      // Get all other sockets currently in the room
      const otherUsers = [];
      for (const [sId, uData] of roomData.users.entries()) {
        if (sId !== socket.id) {
          otherUsers.push(uData);
        }
      }

      logger.info(`[WebRTC] User joined room ${room}: ${socket.id} (${socket.userData?.name || 'Anonymous'}), total in room: ${roomData.users.size}`);

      // Send initial room state (cached code, language, chat history)
      socket.emit('webrtc:room_state', {
        code: roomData.code,
        language: roomData.language,
        messages: roomData.messages || [],
      });

      // Send existing peers to newly joined user
      socket.emit('webrtc:existing_users', otherUsers);

      // Notify others that this user joined
      socket.to(room).emit('webrtc:user_joined', {
        socketId: socket.id,
        user: socket.userData,
        mediaState: socket.mediaState,
      });
    });

    socket.on('webrtc:offer', ({ targetSocketId, sdp, senderUser }) => {
      io.to(targetSocketId).emit('webrtc:offer', {
        senderSocketId: socket.id,
        sdp,
        senderUser: senderUser || socket.userData || socket.user,
      });
    });

    socket.on('webrtc:answer', ({ targetSocketId, sdp }) => {
      io.to(targetSocketId).emit('webrtc:answer', {
        senderSocketId: socket.id,
        sdp,
      });
    });

    socket.on('webrtc:ice_candidate', ({ targetSocketId, candidate }) => {
      io.to(targetSocketId).emit('webrtc:ice_candidate', {
        senderSocketId: socket.id,
        candidate,
      });
    });

    socket.on('webrtc:media_state', ({ interviewId, isMuted, isVideoOff, isScreenSharing }) => {
      const normId = String(interviewId || socket.interviewId || '').trim();
      const room = `interview_video_${normId}`;
      socket.mediaState = { isMuted, isVideoOff, isScreenSharing };

      const roomData = activeVideoRooms.get(normId);
      if (roomData && roomData.users.has(socket.id)) {
        const u = roomData.users.get(socket.id);
        u.mediaState = socket.mediaState;
      }

      socket.to(room).emit('webrtc:peer_media_state', {
        socketId: socket.id,
        isMuted,
        isVideoOff,
        isScreenSharing,
      });
    });

    socket.on('webrtc:chat_message', ({ interviewId, text, sender }) => {
      const normId = String(interviewId || socket.interviewId || '').trim();
      if (!normId || !text) return;

      const room = `interview_video_${normId}`;
      const chatMsg = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        text: String(text).trim(),
        sender: sender || socket.userData || { name: 'User' },
        timestamp: new Date().toISOString(),
      };

      const roomData = activeVideoRooms.get(normId);
      if (roomData) {
        if (!roomData.messages) roomData.messages = [];
        roomData.messages.push(chatMsg);
        if (roomData.messages.length > 200) roomData.messages.shift();
      }

      logger.info(`[WebRTC Chat] Message in ${room} from ${chatMsg.sender?.name}: ${chatMsg.text}`);
      io.to(room).emit('webrtc:chat_message', chatMsg);
    });

    socket.on('webrtc:code_change', ({ interviewId, code, language }) => {
      const normId = String(interviewId || socket.interviewId || '').trim();
      if (!normId) return;

      const room = `interview_video_${normId}`;
      const roomData = activeVideoRooms.get(normId);
      if (roomData) {
        if (code !== undefined) roomData.code = code;
        if (language) roomData.language = language;
      }
      socket.to(room).emit('webrtc:code_change', { code, language });
    });

    socket.on('webrtc:leave', ({ interviewId }) => {
      const normId = String(interviewId || socket.interviewId || '').trim();
      const room = `interview_video_${normId}`;
      socket.leave(room);

      const roomData = activeVideoRooms.get(normId);
      if (roomData) {
        roomData.users.delete(socket.id);
      }

      socket.to(room).emit('webrtc:user_left', { socketId: socket.id });
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      if (socket.interviewVideoRoom) {
        const normId = socket.interviewId;
        if (normId && activeVideoRooms.has(normId)) {
          const roomData = activeVideoRooms.get(normId);
          roomData.users.delete(socket.id);
        }
        socket.to(socket.interviewVideoRoom).emit('webrtc:user_left', { socketId: socket.id });
      }
    });
  });

  return io;
}

function getIO() {
  return io;
}

function emitToCandidate(candidateId, event, data) {
  if (io && candidateId) {
    io.to(`candidate_${candidateId}`).emit(event, data);
  }
}

function emitToInterview(interviewId, event, data) {
  if (io && interviewId) {
    io.to(`interview_${interviewId}`).emit(event, data);
  }
}

module.exports = { initSocket, getIO, emitToCandidate, emitToInterview };
