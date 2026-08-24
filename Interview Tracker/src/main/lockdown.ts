// src/main/lockdown.ts
//
// Enforces the allowlist: closes any window/process that isn't your
// Tracker app or an OS-critical process. Call startEnforcement() when
// the candidate goes Active, stopEnforcement() when the interview ends.

import { exec, spawn } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { BrowserWindow } from 'electron';
import { getOpenWindows, DetectedWindow } from './windowDetection';
import { activityLoggerManager } from './activityLogger';
import { screenshotCaptureManager } from './screenshotCapture';

const SYSTEM_IGNORED_PROCESSES = new Set([
  'textinputhost',
  'ctfmon',
  'tabtip',
  'inputpersonalizations',
  'explorer',
  'shellexperiencehost',
  'startmenuexperiencehost',
  'searchhost',
  'searchui',
  'searchapp',
  'applicationframehost',
  'systemsettings',
  'lockapp',
  'taskmgr',
  'dwm',
  'csrss',
  'winlogon',
  'services',
  'lsass',
  'svchost',
  'smss',
  'fontdrvhost',
  'sihost',
  'securityhealthservice',
  'securityhealthsystray',
  'runtimebroker',
  'smartscreen',
  'electron',
  'tracker-app',
  'interviewtracker',
  'interview tracker',
  'antigravity',
  'antigravity-ide',
  'gemini',
  'node',
  'cmd',
  'powershell',
  'pwsh',
  'conhost',
  'windowsterminal',
  'code',
  'nvcontainer',
  'nvdisplay.container',
  'amdrsserv',
  'igfxhk',
  'audiodg',
  'system',
]);

const SYSTEM_IGNORED_TITLES = [
  'windows input experience',
  'microsoft text input application',
  'program manager',
  'default ime',
  'msctfime ui',
  'task switching',
  'desktop window manager',
  'settings',
  'snap assist',
];

const KNOWN_BROWSERS = new Set(['chrome', 'msedge', 'brave', 'firefox', 'opera', 'vivaldi']);

export type LockdownEventType = 'blocked_attempt';
export type LockdownEventHandler = (type: LockdownEventType, detail: string) => void;

let pollTimer: NodeJS.Timeout | null = null;
let onEvent: LockdownEventHandler = () => {};
let allowedTitleSubstring: string | null = null; // set to the interview window's title once launched
let userAllowedPids: Set<number> = new Set();
const recentlyClosedPids = new Map<number, number>();

export function setEventHandler(handler: LockdownEventHandler) {
  onEvent = handler;
}

export function setAllowedPids(pids: number[]) {
  userAllowedPids = new Set(pids);
}

/**
 * Call this once you know the exact title (or a stable substring of it)
 * of the interview browser window you launched, so it isn't closed as
 * "just another chrome.exe window".
 */
export function setAllowedWindowTitle(titleSubstring: string) {
  allowedTitleSubstring = titleSubstring;
}

let isEnforcingActive = false;

function dispatchCloseTab(pid: number, title: string): Promise<boolean> {
  return new Promise((resolve) => {
    const cleanTitle = (title || '').replace(/[\r\n]/g, ' ').replace(/"/g, '""').trim();
    const tempFile = path.join(os.tmpdir(), `close_tab_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.vbs`);

    const vbs = `
Set ws = CreateObject("WScript.Shell")
act = False
If "${cleanTitle}" <> "" Then
  act = ws.AppActivate("${cleanTitle}")
End If
If Not act And ${pid || 0} > 0 Then
  act = ws.AppActivate(${pid || 0})
End If
If act Then
  WScript.Sleep 40
  ws.SendKeys "^w"
End If
WScript.Quit(0)
`;

    try {
      fs.writeFileSync(tempFile, vbs, 'utf8');
      const child = spawn('cscript.exe', ['//nologo', tempFile], { windowsHide: true });
      child.on('close', () => {
        try { fs.unlinkSync(tempFile); } catch {}
        resolve(true);
      });
      child.on('error', () => {
        try { fs.unlinkSync(tempFile); } catch {}
        resolve(false);
      });
    } catch (err) {
      resolve(false);
    }
  });
}

async function closeActiveTab(win: DetectedWindow) {
  if (!isEnforcingActive) return;

  const now = Date.now();
  const lastAttempt = recentlyClosedPids.get(win.pid) || 0;
  if (now - lastAttempt < 600) {
    return;
  }
  recentlyClosedPids.set(win.pid, now);

  // 1. Capture evidence screenshot asynchronously in background (do NOT block tab close)
  screenshotCaptureManager
    .captureClosedWindowScreenshot('unauthorized_tab', `${win.processName}: ${win.title}`)
    .catch((err) => console.error('[lockdown] Screenshot before tab close failed:', err));

  // 2. Dispatch event and logger
  console.log(`[lockdown] Closing unauthorized tab in chosen app pid=${win.pid} (${win.processName}): "${win.title}"`);
  onEvent('blocked_attempt', `Closed tab: ${win.title}`);
  try {
    activityLoggerManager.logEvent({
      type: 'blocked_attempt',
      detail: `Closed unauthorized tab in chosen app: ${win.title}`,
      timestamp: new Date().toISOString()
    });
  } catch {}

  // 3. Immediately dispatch Ctrl+W keystroke to close the unauthorized tab
  await dispatchCloseTab(win.pid, win.title);
}

async function closeWindow(win: DetectedWindow) {
  if (!isEnforcingActive) return;

  const now = Date.now();
  const lastAttempt = recentlyClosedPids.get(win.pid) || 0;
  if (now - lastAttempt < 4000) {
    return;
  }
  recentlyClosedPids.set(win.pid, now);

  // 1. Capture evidence screenshot asynchronously in background
  screenshotCaptureManager
    .captureClosedWindowScreenshot('unauthorized_app', `${win.processName}: ${win.title}`)
    .catch((err) => console.error('[lockdown] Screenshot before app termination failed:', err));

  // 2. Terminate the unauthorized application
  exec(`taskkill /PID ${win.pid} /F`, (err, _stdout, stderr) => {
    if (err) {
      console.error(`[lockdown] Failed to close pid=${win.pid} (${win.processName}):`, stderr || err.message);
      return;
    }
    console.log(`[lockdown] Closed pid=${win.pid} proc=${win.processName} title="${win.title}"`);
    onEvent('blocked_attempt', `${win.processName}: ${win.title}`);
    try {
      activityLoggerManager.logEvent({
        type: 'blocked_attempt',
        detail: `Closed unauthorized application: ${win.processName} (${win.title})`,
        timestamp: new Date().toISOString()
      });
    } catch {}
  });
}

async function enforceOnce() {
  if (!isEnforcingActive) return;
  const windows = await getOpenWindows();
  if (!isEnforcingActive) return;

  for (const win of windows) {
    if (!isEnforcingActive) return;
    const pName = (win.processName || '').toLowerCase().trim();
    const titleLower = (win.title || '').toLowerCase().trim();

    // 1. Skip system input, IME, Windows shell, IDE, or ignored processes
    if (
      SYSTEM_IGNORED_PROCESSES.has(pName) ||
      pName.includes('electron') ||
      pName.includes('antigravity') ||
      pName.includes('gemini') ||
      pName.includes('input') ||
      pName.includes('tracker')
    ) {
      continue;
    }

    // 2. Skip system / overlay window titles (e.g. Windows Input Experience when clicking a text box)
    if (!titleLower || SYSTEM_IGNORED_TITLES.some((t) => titleLower.includes(t))) {
      continue;
    }

    // 3. Is this the chosen browser or user-allowed application?
    const isBrowser = KNOWN_BROWSERS.has(pName);
    const isChosenApp = userAllowedPids.has(win.pid) || isBrowser;

    if (isChosenApp) {
      // Check if candidate is currently on the chosen allowed tab
      if (allowedTitleSubstring && allowedTitleSubstring.trim()) {
        const isMatch =
          titleLower.includes(allowedTitleSubstring.toLowerCase()) ||
          allowedTitleSubstring.toLowerCase().includes(titleLower);

        if (!isMatch) {
          // Changed to another tab or opened a new tab in the chosen app -> CLOSE ONLY THE TAB!
          closeActiveTab(win);
        }
      }
      continue;
    }

    // 4. Any OTHER unauthorized application -> CLOSE THE ENTIRE APP!
    closeWindow(win);
  }
}

export function startEnforcement(intervalMs = 800) {
  if (pollTimer || isEnforcingActive) return;
  isEnforcingActive = true;
  console.log('[lockdown] Enforcement started.');
  enforceOnce();
  pollTimer = setInterval(enforceOnce, intervalMs);
}

export function stopEnforcement() {
  isEnforcingActive = false;
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
    console.log('[lockdown] Enforcement stopped.');
  }
  setTimeout(() => {
    if (!isEnforcingActive) {
      allowedTitleSubstring = null;
      userAllowedPids.clear();
    }
  }, 1000);
}

/**
 * Compatible LockdownManager wrapper for overlay window management
 */
export class LockdownManager {
  private mainWindow: BrowserWindow | null = null;
  private originalBounds: Electron.Rectangle | null = null;

  public setMainWindow(window: BrowserWindow): void {
    this.mainWindow = window;
  }

  public async getOpenWindows() {
    const list = await getOpenWindows();
    return list.map((w, idx) => ({
      id: `${w.pid}-${idx}`,
      pid: w.pid,
      processName: w.processName,
      windowTitle: w.title,
      tabTitle: w.title,
      isTab: ['chrome', 'msedge', 'brave', 'firefox'].includes(w.processName)
    }));
  }

  public async startLockdown(allowedPids: number[] = [], allowedTitle?: string, interviewUrl?: string): Promise<boolean> {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.originalBounds = this.mainWindow.getBounds();
      const { screen } = require('electron');
      const primaryDisplay = screen.getPrimaryDisplay();
      const { width: screenWidth } = primaryDisplay.workAreaSize;

      this.mainWindow.setKiosk(false);
      this.mainWindow.setFullScreen(false);
      this.mainWindow.setMinimumSize(0, 0);
      this.mainWindow.setMaximumSize(screenWidth, 56);
      this.mainWindow.setBounds({ x: 0, y: 0, width: screenWidth, height: 56 });
      this.mainWindow.setAlwaysOnTop(true, 'screen-saver');
      this.mainWindow.setMovable(false);
      this.mainWindow.setResizable(false);
      this.mainWindow.setClosable(false);
      this.mainWindow.setSkipTaskbar(true);
    }

    if (allowedPids && allowedPids.length > 0) {
      setAllowedPids(allowedPids);
    }

    if (allowedTitle) {
      setAllowedWindowTitle(allowedTitle);
    }

    startEnforcement();
    return true;
  }

  public setWindowHeight(height: number): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      const { screen } = require('electron');
      const primaryDisplay = screen.getPrimaryDisplay();
      const { width: screenWidth } = primaryDisplay.workAreaSize;
      this.mainWindow.setMaximumSize(screenWidth, height);
      this.mainWindow.setBounds({ x: 0, y: 0, width: screenWidth, height });
    }
  }

  public async stopLockdown(): Promise<boolean> {
    stopEnforcement();

    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.setAlwaysOnTop(false);
      this.mainWindow.setMovable(true);
      this.mainWindow.setResizable(true);
      this.mainWindow.setClosable(true);
      this.mainWindow.setSkipTaskbar(false);
      this.mainWindow.setMaximumSize(10000, 10000);
      this.mainWindow.setMinimumSize(900, 650);

      if (this.originalBounds) {
        this.mainWindow.setBounds(this.originalBounds);
        this.originalBounds = null;
      } else {
        this.mainWindow.setSize(1200, 800);
        this.mainWindow.center();
      }
    }

    return true;
  }
}

export const lockdownManager = new LockdownManager();
