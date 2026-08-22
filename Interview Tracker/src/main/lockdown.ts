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

const TAB_CLOSER_CS = `
using System;
using System.Runtime.InteropServices;

public class TabCloserHelper {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc lpfn, IntPtr lParam);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);
    [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();
    [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);

    public const byte VK_CONTROL = 0x11;
    public const byte VK_W = 0x57;
    public const uint KEYEVENTF_KEYUP = 0x0002;

    public static bool ForceForeground(IntPtr hWnd) {
        IntPtr foreHwnd = GetForegroundWindow();
        if (foreHwnd == hWnd) return true;

        uint discardPid;
        uint foreThread = 0;
        if (foreHwnd != IntPtr.Zero) {
            foreThread = GetWindowThreadProcessId(foreHwnd, out discardPid);
        }
        uint targetThread = GetWindowThreadProcessId(hWnd, out discardPid);
        uint curThread = GetCurrentThreadId();

        if (foreThread != 0 && foreThread != curThread) {
            AttachThreadInput(curThread, foreThread, true);
        }
        if (targetThread != 0 && targetThread != curThread) {
            AttachThreadInput(curThread, targetThread, true);
        }

        ShowWindow(hWnd, 5); // SW_SHOW
        BringWindowToTop(hWnd);
        bool res = SetForegroundWindow(hWnd);

        if (foreThread != 0 && foreThread != curThread) {
            AttachThreadInput(curThread, foreThread, false);
        }
        if (targetThread != 0 && targetThread != curThread) {
            AttachThreadInput(curThread, targetThread, false);
        }
        return res;
    }

    public static void SendCtrlW(IntPtr hWnd) {
        ForceForeground(hWnd);
        System.Threading.Thread.Sleep(50);
        keybd_event(VK_CONTROL, 0, 0, UIntPtr.Zero);
        keybd_event(VK_W, 0, 0, UIntPtr.Zero);
        System.Threading.Thread.Sleep(25);
        keybd_event(VK_W, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
        keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, UIntPtr.Zero);
    }

    public static bool CloseActiveTabForPid(uint targetPid) {
        bool closed = false;
        EnumWindows((hWnd, lParam) => {
            if (IsWindowVisible(hWnd)) {
                uint pid;
                GetWindowThreadProcessId(hWnd, out pid);
                if (pid == targetPid) {
                    SendCtrlW(hWnd);
                    closed = true;
                    return false;
                }
            }
            return true;
        }, IntPtr.Zero);
        return closed;
    }
}
`;

let isEnforcingActive = false;

async function closeActiveTab(win: DetectedWindow) {
  if (!isEnforcingActive) return;

  const now = Date.now();
  const lastAttempt = recentlyClosedPids.get(win.pid) || 0;
  if (now - lastAttempt < 4000) {
    return;
  }
  recentlyClosedPids.set(win.pid, now);

  // 1. Capture evidence screenshot BEFORE closing the tab
  try {
    await screenshotCaptureManager.captureClosedWindowScreenshot('unauthorized_tab', `${win.processName}: ${win.title}`);
  } catch (err) {
    console.error('[lockdown] Screenshot before tab close failed:', err);
  }

  if (!isEnforcingActive) return;

  // 2. Dispatch Ctrl+W to close only that tab
  const ps = `
$WarningPreference = 'SilentlyContinue'
Add-Type -TypeDefinition @'
${TAB_CLOSER_CS}
'@ -ErrorAction SilentlyContinue
[TabCloserHelper]::CloseActiveTabForPid(${win.pid})
`;

  const tempFile = path.join(os.tmpdir(), `close_tab_${Date.now()}_${Math.random().toString(36).slice(2)}.ps1`);
  try {
    fs.writeFileSync(tempFile, ps, 'utf8');
    const child = spawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', tempFile], {
      windowsHide: true
    });
    child.on('close', () => {
      try { fs.unlinkSync(tempFile); } catch {}
      console.log(`[lockdown] Closed unauthorized tab in chosen app pid=${win.pid} (${win.processName}): "${win.title}"`);
      onEvent('blocked_attempt', `Closed tab: ${win.title}`);
      try {
        activityLoggerManager.logEvent({
          type: 'blocked_attempt',
          detail: `Closed unauthorized tab in chosen app: ${win.title}`,
          timestamp: new Date().toISOString()
        });
      } catch {}
    });
  } catch (err) {
    console.error('[lockdown] closeActiveTab error:', err);
  }
}

async function closeWindow(win: DetectedWindow) {
  if (!isEnforcingActive) return;

  const now = Date.now();
  const lastAttempt = recentlyClosedPids.get(win.pid) || 0;
  if (now - lastAttempt < 5000) {
    return;
  }
  recentlyClosedPids.set(win.pid, now);

  // 1. Capture evidence screenshot BEFORE terminating the application
  try {
    await screenshotCaptureManager.captureClosedWindowScreenshot('unauthorized_app', `${win.processName}: ${win.title}`);
  } catch (err) {
    console.error('[lockdown] Screenshot before app termination failed:', err);
  }

  if (!isEnforcingActive) return;

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

export function startEnforcement(intervalMs = 1500) {
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
