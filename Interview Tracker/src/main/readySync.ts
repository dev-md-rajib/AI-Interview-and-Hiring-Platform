import { EventEmitter } from 'events';
import { io, Socket } from 'socket.io-client';
import { TrackerStatus } from '../shared/types';
import { apiClient } from '../shared/apiClient';
import { screenshotCaptureManager } from './screenshotCapture';

const SOCKET_SERVER_URL = process.env.VITE_SOCKET_URL || 'http://localhost:5000';

export class ReadySyncManager extends EventEmitter {
  private status: TrackerStatus = 'idle';
  private socket: Socket | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private candidateId: string | null = null;
  private interviewId: string | null = null;

  constructor() {
    super();
  }

  public getStatus(): TrackerStatus {
    return this.status;
  }

  public setStatus(newStatus: TrackerStatus): void {
    const oldStatus = this.status;
    this.status = newStatus;
    console.log(`[ReadySync] Status changed: ${oldStatus} -> ${newStatus}`);
    this.emit('status-change', newStatus);

    if (this.socket && this.socket.connected) {
      this.socket.emit('tracker:status_update', {
        candidateId: this.candidateId,
        interviewId: this.interviewId,
        status: newStatus,
        timestamp: new Date().toISOString()
      });
    }

    if (newStatus === 'active') {
      this.startHeartbeat();
    } else {
      this.stopHeartbeat();
    }
  }

  public connectSocket(candidateId: string, interviewId: string): void {
    this.candidateId = candidateId;
    this.interviewId = interviewId;

    if (this.socket) {
      this.socket.disconnect();
    }

    const token = apiClient.getToken();
    this.socket = io(SOCKET_SERVER_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10
    });

    this.socket.on('connect', () => {
      console.log('[ReadySync] Connected to realtime status channel:', this.socket?.id);
      this.socket?.emit('tracker:join', { candidateId, interviewId: this.interviewId });
    });

    this.socket.on('tracker:set_interview_id', (data: { interviewId?: string }) => {
      if (data?.interviewId) {
        console.log('[ReadySync] Server set active interview ID to:', data.interviewId);
        this.interviewId = data.interviewId;
        screenshotCaptureManager.setInterviewId(data.interviewId);
      }
    });

    let lastViolationCaptureTime = 0;
    this.socket.on('tracker:trigger_violation_capture', async (data: { reason?: string; targetName?: string; interviewId?: string }) => {
      const now = Date.now();
      if (now - lastViolationCaptureTime < 3000) {
        console.log('[ReadySync] Duplicate violation capture trigger ignored within cooldown');
        return;
      }
      lastViolationCaptureTime = now;

      console.warn('[ReadySync] Triggering single violation screenshot capture:', data);
      if (data?.interviewId) {
        this.interviewId = data.interviewId;
        screenshotCaptureManager.setInterviewId(data.interviewId);
      }
      await screenshotCaptureManager.captureClosedWindowScreenshot(
        data?.reason || 'Clipboard Paste Attempt - Pasting text into answer box',
        data?.targetName || 'Candidate Answer Box'
      );
    });

    this.socket.on('tracker:force_terminate', (data: { reason?: string }) => {
      console.warn('[ReadySync] Force termination requested by server:', data?.reason);
      this.setStatus('terminated');
    });

    this.socket.on('disconnect', () => {
      console.warn('[ReadySync] Realtime socket disconnected');
    });
  }

  public disconnectSocket(): void {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.candidateId = null;
    this.interviewId = null;
    this.setStatus('idle');
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.connected) {
        this.socket.emit('tracker:heartbeat', {
          candidateId: this.candidateId,
          interviewId: this.interviewId,
          timestamp: new Date().toISOString()
        });
      }
    }, 5000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
}

export const readySyncManager = new ReadySyncManager();
