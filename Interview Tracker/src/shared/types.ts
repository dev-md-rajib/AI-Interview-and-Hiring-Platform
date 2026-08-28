export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  profileImage?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface NextInterviewResponse {
  interviewId: string;
  jobTitle: string;
  stack: string;
  level: string;
  scheduledAt?: string;
  interviewUrl: string;
  candidateId: string;
}

export interface ConsentPayload {
  candidateId: string;
  interviewId: string;
  consentedAt: string;
  consentVersion: string;
}

export interface ReadyPayload {
  candidateId: string;
  interviewId: string;
}

export interface EndInterviewPayload {
  candidateId: string;
  interviewId: string;
  endedBy: 'candidate' | 'system-timeout' | 'admin';
  endedAt: string;
}

export interface ActivityEvent {
  type: 'app_switch' | 'url_navigation' | 'blocked_attempt' | 'window_focus';
  detail: string;
  timestamp: string;
}

export interface ActivityLogPayload {
  candidateId: string;
  interviewId: string;
  events: ActivityEvent[];
}

export interface OpenWindowInfo {
  id?: string;
  pid: number;
  processName: string;
  windowTitle: string;
  tabTitle?: string;
  isTab?: boolean;
}

export type TrackerStatus = 'idle' | 'ready' | 'active' | 'terminated' | 'completed';

export interface IElectronAPI {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  getStoredAuth: () => Promise<{ token: string; user: User } | null>;
  getNextInterview: () => Promise<NextInterviewResponse>;
  sendConsent: (payload: ConsentPayload) => Promise<boolean>;
  sendReady: (payload: ReadyPayload) => Promise<boolean>;
  getOpenWindows: () => Promise<OpenWindowInfo[]>;
  startLockdown: (interviewId: string, allowedPids: number[], allowedTitle?: string) => Promise<boolean>;
  stopLockdown: () => Promise<boolean>;
  setWindowHeight: (height: number) => Promise<boolean>;
  minimizeWindow: () => Promise<boolean>;
  closeWindow: () => Promise<boolean>;
  endInterview: (payload: EndInterviewPayload) => Promise<boolean>;
  onStatusChange: (callback: (status: TrackerStatus) => void) => void;
  openExternal: (url: string) => Promise<void>;
}

export interface ITrackerAPI {
  listWindows: () => Promise<OpenWindowInfo[]>;
  debugWindows: () => Promise<boolean>;
  startActive: (interviewUrl: string) => Promise<{ ok: boolean; error?: string }>;
  stopActive: () => Promise<{ ok: boolean }>;
  onTrackerEvent: (callback: (event: { type: string; detail: string; timestamp: string }) => void) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
    trackerAPI: ITrackerAPI;
  }
}
