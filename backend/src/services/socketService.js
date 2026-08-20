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

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
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
