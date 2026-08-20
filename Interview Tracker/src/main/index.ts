import { app, BrowserWindow, ipcMain, shell, nativeImage } from 'electron';
import path from 'path';
import fs from 'fs';
import { authManager } from './auth';

// Set App User Model ID for Windows Taskbar icon grouping
if (process.platform === 'win32') {
  app.setAppUserModelId('com.interviewplatform.tracker');
}
import { readySyncManager } from './readySync';
import { lockdownManager } from './lockdown';
import { screenshotCaptureManager } from './screenshotCapture';
import { activityLoggerManager } from './activityLogger';
import { killSwitchManager } from './killSwitch';
import { apiClient } from '../shared/apiClient';
import { registerTrackerIpc } from './ipcHandlers';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const icoPath = path.join(__dirname, '../../build/icon.ico');
  const pngPath = path.join(__dirname, '../../build/app-icon.png');
  const appIcon = fs.existsSync(icoPath)
    ? nativeImage.createFromPath(icoPath)
    : nativeImage.createFromPath(pngPath);

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 650,
    frame: false,
    title: 'Interview Tracker App',
    icon: appIcon,
    show: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    }
  });

  if (!appIcon.isEmpty()) {
    mainWindow.setIcon(appIcon);
  }

  lockdownManager.setMainWindow(mainWindow);
  registerTrackerIpc(mainWindow);

  mainWindow.show();
  mainWindow.focus();

  mainWindow.webContents.on('did-fail-load', (_e, code, desc, url) => {
    console.error(`[Electron] Failed to load ${url}: (${code}) ${desc}`);
  });

  // Load dev server or production HTML
  const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5174';
  if (process.env.VITE_DEV_SERVER_URL) {
    console.log('[Electron] Loading dev server:', process.env.VITE_DEV_SERVER_URL);
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    console.log('[Electron] Loading fallback URL:', devServerUrl);
    mainWindow.loadURL(devServerUrl);
  }

  // Handle external links safely
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// System lifecycle events
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  lockdownManager.stopLockdown();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handler Registrations
ipcMain.handle('auth:login', async (_event, credentials) => {
  const result = await authManager.login(credentials);
  if (result.user) {
    // Setup socket connection
    const nextInterview = await apiClient.getNextInterview();
    readySyncManager.connectSocket(result.user.id, nextInterview.interviewId);
  }
  return result;
});

ipcMain.handle('auth:logout', async () => {
  readySyncManager.disconnectSocket();
  lockdownManager.stopLockdown();
  screenshotCaptureManager.stopCapture();
  activityLoggerManager.stopLogging();
  return await authManager.logout();
});

ipcMain.handle('auth:getStoredAuth', async () => {
  const stored = authManager.getStoredAuth();
  if (stored) {
    const nextInterview = await apiClient.getNextInterview();
    readySyncManager.connectSocket(stored.user.id, nextInterview.interviewId);
  }
  return stored;
});

ipcMain.handle('candidate:getNextInterview', async () => {
  return await apiClient.getNextInterview();
});

ipcMain.handle('tracker:consent', async (_event, payload) => {
  return await apiClient.sendConsent(payload);
});

ipcMain.handle('tracker:ready', async (_event, payload) => {
  const success = await apiClient.sendReady(payload);
  if (success) {
    readySyncManager.setStatus('ready');
  }
  return success;
});

ipcMain.handle('tracker:getOpenWindows', async () => {
  return await lockdownManager.getOpenWindows();
});

ipcMain.handle('tracker:startLockdown', async (_event, interviewId: string, allowedPids: number[], allowedTitle?: string) => {
  const currentUser = authManager.getCurrentUser();
  if (!currentUser) return false;

  await lockdownManager.startLockdown(allowedPids || [], allowedTitle);
  screenshotCaptureManager.startCapture(currentUser.id, interviewId);
  activityLoggerManager.startLogging(currentUser.id, interviewId);
  readySyncManager.setStatus('active');

  return true;
});

ipcMain.handle('tracker:stopLockdown', async () => {
  lockdownManager.stopLockdown();
  screenshotCaptureManager.stopCapture();
  activityLoggerManager.stopLogging();
  readySyncManager.setStatus('idle');
  return true;
});

ipcMain.handle('window:minimize', async () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.minimize();
  }
  return true;
});

ipcMain.handle('window:close', async () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close();
  }
  return true;
});

ipcMain.handle('tracker:setWindowHeight', async (_event, height: number) => {
  lockdownManager.setWindowHeight(height);
  return true;
});

ipcMain.handle('tracker:endInterview', async (_event, payload) => {
  return await killSwitchManager.executeTermination(payload);
});

// Forward status changes to renderer UI
readySyncManager.on('status-change', (status) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('tracker:status-change', status);
  }
});
