import { contextBridge, ipcRenderer, shell } from 'electron';
import {
  LoginCredentials,
  ConsentPayload,
  ReadyPayload,
  EndInterviewPayload,
  TrackerStatus
} from '../shared/types';

contextBridge.exposeInMainWorld('electronAPI', {
  login: (credentials: LoginCredentials) => ipcRenderer.invoke('auth:login', credentials),
  logout: () => ipcRenderer.invoke('auth:logout'),
  getStoredAuth: () => ipcRenderer.invoke('auth:getStoredAuth'),
  getNextInterview: () => ipcRenderer.invoke('candidate:getNextInterview'),
  sendConsent: (payload: ConsentPayload) => ipcRenderer.invoke('tracker:consent', payload),
  sendReady: (payload: ReadyPayload) => ipcRenderer.invoke('tracker:ready', payload),
  getOpenWindows: () => ipcRenderer.invoke('tracker:getOpenWindows'),
  startLockdown: (interviewId: string, allowedPids: number[], allowedTitle?: string) =>
    ipcRenderer.invoke('tracker:startLockdown', interviewId, allowedPids, allowedTitle),
  stopLockdown: () => ipcRenderer.invoke('tracker:stopLockdown'),
  setWindowHeight: (height: number) => ipcRenderer.invoke('tracker:setWindowHeight', height),
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  closeWindow: () => ipcRenderer.invoke('window:close'),
  endInterview: (payload: EndInterviewPayload) => ipcRenderer.invoke('tracker:endInterview', payload),
  onStatusChange: (callback: (status: TrackerStatus) => void) => {
    ipcRenderer.on('tracker:status-change', (_event, status) => callback(status));
  },
  openExternal: (url: string) => shell.openExternal(url)
});

contextBridge.exposeInMainWorld('trackerAPI', {
  listWindows: () => ipcRenderer.invoke('tracker:list-windows'),
  debugWindows: () => ipcRenderer.invoke('tracker:debug-windows'),
  startActive: (interviewUrl: string) => ipcRenderer.invoke('tracker:start-active', interviewUrl),
  stopActive: () => ipcRenderer.invoke('tracker:stop-active'),
  onTrackerEvent: (callback: (event: { type: string; detail: string; timestamp: string }) => void) => {
    ipcRenderer.on('tracker:event', (_e, data) => callback(data));
  }
});
