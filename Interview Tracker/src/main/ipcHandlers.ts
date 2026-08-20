// src/main/ipcHandlers.ts
//
// Registers all IPC channels the renderer needs. Call registerTrackerIpc()
// once from your main/index.ts, after the main BrowserWindow is created.

import { ipcMain, BrowserWindow } from 'electron';
import { getOpenWindows, debugPrintWindows } from './windowDetection';
import { startEnforcement, stopEnforcement, setEventHandler, lockdownManager } from './lockdown';
import { closeAllBrowsers, launchInterviewBrowser, stopInterviewBrowser, setBlockedTabHandler } from './browserControl';
import { activityLoggerManager } from './activityLogger';

export function registerTrackerIpc(mainWindow: BrowserWindow) {
  // Forward lockdown/browser events to the renderer so ActiveLockdown.tsx
  // can show a live flag count / activity feed if you want.
  setEventHandler((type, detail) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('tracker:event', { type, detail, timestamp: new Date().toISOString() });
    }
    try {
      activityLoggerManager.logEvent({
        type: 'blocked_attempt',
        detail,
        timestamp: new Date().toISOString()
      });
    } catch {}
  });

  setBlockedTabHandler((url) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('tracker:event', {
        type: 'blocked_attempt',
        detail: url,
        timestamp: new Date().toISOString(),
      });
    }
    try {
      activityLoggerManager.logEvent({
        type: 'blocked_attempt',
        detail: `Blocked tab/navigation: ${url}`,
        timestamp: new Date().toISOString()
      });
    } catch {}
  });

  // Used by WindowPicker.tsx to list currently open windows.
  ipcMain.handle('tracker:list-windows', async () => {
    const wins = await getOpenWindows();
    return wins.map((w, idx) => ({
      id: `${w.pid}-${idx}`,
      pid: w.pid,
      processName: w.processName,
      windowTitle: w.title,
      tabTitle: w.title,
      isTab: ['chrome', 'msedge', 'brave', 'firefox'].includes(w.processName)
    }));
  });

  // Debug helper — call from devtools console via
  // window.electronAPI.debugWindows() to sanity-check detection.
  ipcMain.handle('tracker:debug-windows', async () => {
    await debugPrintWindows();
    return true;
  });

  // Full "go active" sequence, called when ActiveLockdown.tsx mounts /
  // candidate clicks Ready.
  ipcMain.handle('tracker:start-active', async (_event, interviewUrl: string) => {
    try {
      await closeAllBrowsers();
      await lockdownManager.startLockdown([], '', interviewUrl);
      startEnforcement();
      if (interviewUrl) {
        await launchInterviewBrowser(interviewUrl);
      }
      return { ok: true };
    } catch (err: any) {
      console.error('[ipcHandlers] start-active failed:', err);
      return { ok: false, error: err.message };
    }
  });

  // Called on End Interview / onEndComplete.
  ipcMain.handle('tracker:stop-active', async () => {
    try {
      await stopInterviewBrowser();
      stopEnforcement();
      await lockdownManager.stopLockdown();
      return { ok: true };
    } catch (err: any) {
      console.error('[ipcHandlers] stop-active failed:', err);
      return { ok: false, error: err.message };
    }
  });
}
