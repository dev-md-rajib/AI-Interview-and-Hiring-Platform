// src/main/browserControl.ts
//
// 1. Closes any existing browser windows.
// 2. Launches a fresh Chrome instance with remote debugging enabled.
// 3. Attaches via Puppeteer and closes any tab that isn't the interview tab.
//
// Requires: npm install puppeteer-core

import { exec } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import { getOpenWindows } from './windowDetection';
import { setAllowedWindowTitle } from './lockdown';
import { screenshotCaptureManager } from './screenshotCapture';

const BROWSER_PROCESS_NAMES = ['chrome', 'msedge', 'firefox', 'brave', 'opera', 'vivaldi'];
const DEBUG_PORT = 9222;

let browser: Browser | null = null;
let interviewPage: Page | null = null;
let onBlockedTab: (url: string) => void = () => {};

export function setBlockedTabHandler(handler: (url: string) => void) {
  onBlockedTab = handler;
}

/** Step 1: close every window belonging to a known browser process. */
export async function closeAllBrowsers(): Promise<void> {
  const windows = await getOpenWindows();
  const browserWindows = windows.filter((w) => BROWSER_PROCESS_NAMES.includes(w.processName));

  await Promise.all(
    browserWindows.map(
      (w) =>
        new Promise<void>((resolve) => {
          exec(`taskkill /PID ${w.pid} /F`, () => resolve());
        })
    )
  );

  // Small buffer so Windows fully releases the process/profile lock
  // before we try to launch a new instance.
  await new Promise((r) => setTimeout(r, 800));
}

function findChromePath(): string {
  const localAppData = process.env.LOCALAPPDATA || '';
  const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
  const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';

  const candidates = [
    path.join(programFiles, 'Google\\Chrome\\Application\\chrome.exe'),
    path.join(programFilesX86, 'Google\\Chrome\\Application\\chrome.exe'),
    path.join(localAppData, 'Google\\Chrome\\Application\\chrome.exe'),
    path.join(programFilesX86, 'Microsoft\\Edge\\Application\\msedge.exe'),
    path.join(programFiles, 'Microsoft\\Edge\\Application\\msedge.exe'),
    path.join(localAppData, 'Microsoft\\Edge\\Application\\msedge.exe'),
    path.join(programFiles, 'BraveSoftware\\Brave-Browser\\Application\\brave.exe'),
    path.join(localAppData, 'BraveSoftware\\Brave-Browser\\Application\\brave.exe')
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[0];
}

/** Step 2 + 3: launch fresh Chrome, attach Puppeteer, lock to one tab. */
export async function launchInterviewBrowser(interviewUrl: string): Promise<void> {
  const chromePath = findChromePath();
  const tempProfileDir = path.join(os.tmpdir(), `tracker-chrome-profile-${Date.now()}`);

  const launchCmd = `"${chromePath}" --remote-debugging-port=${DEBUG_PORT} --user-data-dir="${tempProfileDir}" --new-window --no-first-run --no-default-browser-check "${interviewUrl}"`;

  exec(launchCmd, (err) => {
    if (err) console.error('[browserControl] Failed to launch Chrome:', err.message);
  });

  // Wait for Chrome to boot and expose the debug endpoint. Poll instead of a
  // fixed sleep — more reliable on slower machines.
  const browserURL = `http://127.0.0.1:${DEBUG_PORT}`;
  await waitForDebugPort(browserURL);

  browser = await puppeteer.connect({ browserURL, defaultViewport: null });

  const pages = await browser.pages();
  interviewPage = pages.find((p) => p.url().startsWith(interviewUrl)) || pages[0];

  try {
    const title = await interviewPage.title();
    setAllowedWindowTitle(title); // tells lockdown.ts not to kill this specific chrome window
  } catch {}

  watchTabs();
  watchNavigation(interviewUrl);
}

async function waitForDebugPort(browserURL: string, timeoutMs = 12000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${browserURL}/json/version`);
      if (res.ok) return;
    } catch {
      // not up yet, keep polling
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('[browserControl] Chrome debug port never became available.');
}

/** Closes any new tab/window that isn't the interview tab, the moment it appears. */
function watchTabs() {
  if (!browser) return;
  browser.on('targetcreated', async (target) => {
    if (target.type() !== 'page') return;
    const newPage = await target.page();
    if (!newPage || newPage === interviewPage) return;

    const url = newPage.url();
    console.log('[browserControl] Closing extra tab:', url);
    try {
      await screenshotCaptureManager.captureClosedWindowScreenshot('unauthorized_browser_tab', url);
    } catch {}
    onBlockedTab(url);
    await newPage.close().catch(() => {});
  });
}

/** Prevents navigating the interview tab itself away to another site. */
function watchNavigation(interviewUrl: string) {
  if (!interviewPage) return;
  interviewPage.on('framenavigated', (frame) => {
    if (frame !== interviewPage!.mainFrame()) return;
    if (!frame.url().startsWith(interviewUrl)) {
      onBlockedTab(frame.url());
      interviewPage!.goBack().catch(() => {});
    }
  });
}

/** Call on interview end. */
export async function stopInterviewBrowser(): Promise<void> {
  if (browser) {
    browser.removeAllListeners('targetcreated');
    await browser.close().catch(() => {});
    browser = null;
    interviewPage = null;
  }
}
