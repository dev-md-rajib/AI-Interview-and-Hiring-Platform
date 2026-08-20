// src/main/windowDetection.ts
//
// Detects all visible top-level windows on Windows using PowerShell.
// No native modules, no build tools required — this avoids the
// node-window-manager / electron-rebuild native-addon problems.

import { exec } from 'child_process';

export interface DetectedWindow {
  pid: number;
  processName: string;   // e.g. "chrome"
  title: string;         // window title text
  path: string;          // full exe path, e.g. C:\Program Files\Google\Chrome\Application\chrome.exe
}

/**
 * Returns every visible window with a non-empty title.
 * Safe to call repeatedly (used by the lockdown poll loop).
 */
export function getOpenWindows(): Promise<DetectedWindow[]> {
  return new Promise((resolve) => {
    const psCommand = `
      Get-Process | Where-Object { $_.MainWindowTitle -ne '' } |
      Select-Object Id, ProcessName, MainWindowTitle, Path |
      ConvertTo-Json -Compress
    `.replace(/\r?\n/g, ' ');

    exec(
      `powershell -NoProfile -Command "${psCommand}"`,
      { windowsHide: true, maxBuffer: 1024 * 1024 * 10 },
      (err, stdout, stderr) => {
        if (err) {
          console.error('[windowDetection] PowerShell error:', err.message, stderr);
          return resolve([]);
        }

        if (!stdout || !stdout.trim()) {
          console.warn('[windowDetection] Empty output — no windows found or PS query failed silently.');
          return resolve([]);
        }

        try {
          const parsed = JSON.parse(stdout);
          // ConvertTo-Json returns a single object (not an array) if there's only one match
          const list = Array.isArray(parsed) ? parsed : [parsed];

          const windows: DetectedWindow[] = list
            .filter((w: any) => w && w.Id && w.MainWindowTitle)
            .map((w: any) => ({
              pid: w.Id,
              processName: (w.ProcessName || '').toLowerCase(),
              title: w.MainWindowTitle,
              path: w.Path || '',
            }));

          resolve(windows);
        } catch (parseErr) {
          console.error('[windowDetection] JSON parse failed. Raw output:', stdout);
          resolve([]);
        }
      }
    );
  });
}

/**
 * Quick manual test
 */
export async function debugPrintWindows() {
  const windows = await getOpenWindows();
  console.log(`[windowDetection] Found ${windows.length} window(s):`);
  windows.forEach((w) =>
    console.log(`  pid=${w.pid} proc=${w.processName} title="${w.title}" path="${w.path}"`)
  );
}
