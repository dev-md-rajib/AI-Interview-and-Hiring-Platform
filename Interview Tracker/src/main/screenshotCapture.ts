import { desktopCapturer, app } from 'electron';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import { apiClient } from '../shared/apiClient';

const QUEUE_DIR = path.join(app.getPath('userData'), 'screenshot_queue');

// Fixed interval: every 30 seconds
const FIXED_INTERVAL_MS = 30_000;

// Random interval range: between 15s and 90s
const RANDOM_MIN_MS = 15_000;
const RANDOM_MAX_MS = 90_000;

export class ScreenshotCaptureManager {
  private isRunning: boolean = false;
  private candidateId: string | null = null;
  private interviewId: string | null = null;

  /** Fixed 30-second interval timer */
  private fixedTimer: NodeJS.Timeout | null = null;
  /** Random-interval timer (fires independently of the fixed timer) */
  private randomTimer: NodeJS.Timeout | null = null;

  private captureCount = 0;

  constructor() {
    if (!fs.existsSync(QUEUE_DIR)) {
      fs.mkdirSync(QUEUE_DIR, { recursive: true });
    }
  }

  public startCapture(candidateId: string, interviewId: string): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.candidateId = candidateId;
    this.interviewId = interviewId;
    this.captureCount = 0;

    console.log('[Screenshot] Starting dual-mode screen capture (fixed 30s + random)...');

    // 1. Start fixed 30-second interval captures
    this.fixedTimer = setInterval(() => {
      this.captureAndUpload('fixed-interval');
    }, FIXED_INTERVAL_MS);

    // 2. Start random-interval captures (independent of fixed timer)
    this.scheduleNextRandomCapture();

    // 3. Flush any previously queued screenshots from offline storage
    this.flushQueuedScreenshots();
  }

  public setInterviewId(newInterviewId: string): void {
    if (newInterviewId) {
      console.log(`[Screenshot] Updated active interview ID to: ${newInterviewId}`);
      this.interviewId = newInterviewId;
    }
  }

  public stopCapture(): void {
    this.isRunning = false;

    if (this.fixedTimer) {
      clearInterval(this.fixedTimer);
      this.fixedTimer = null;
    }

    if (this.randomTimer) {
      clearTimeout(this.randomTimer);
      this.randomTimer = null;
    }

    console.log(`[Screenshot] Stopped screen capture monitoring. Total captures: ${this.captureCount}`);
  }

  /**
   * Schedule the next random capture at an unpredictable time.
   * Each call picks a new random delay between RANDOM_MIN_MS and RANDOM_MAX_MS.
   */
  private scheduleNextRandomCapture(): void {
    if (!this.isRunning) return;

    const delay = RANDOM_MIN_MS + Math.floor(Math.random() * (RANDOM_MAX_MS - RANDOM_MIN_MS));

    console.log(`[Screenshot] Next random capture scheduled in ${(delay / 1000).toFixed(1)}s`);

    this.randomTimer = setTimeout(async () => {
      if (!this.isRunning) return;
      await this.captureAndUpload('random');
      this.scheduleNextRandomCapture(); // Schedule the next random one
    }, delay);
  }

  private async captureAndUpload(source: 'fixed-interval' | 'random'): Promise<void> {
    if (!this.isRunning || !this.candidateId || !this.interviewId) return;

    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1920, height: 1080 }
      });

      if (sources.length === 0) return;

      // Grab primary display image as JPEG Buffer
      const primarySource = sources[0];
      const imageBuffer = primarySource.thumbnail.toJPEG(75);
      const timestamp = new Date().toISOString();

      this.captureCount++;
      console.log(`[Screenshot] Capture #${this.captureCount} (${source}) at ${timestamp}`);

      await this.uploadOrQueue(imageBuffer, timestamp, source);
    } catch (err) {
      console.error('[Screenshot] Capture error:', err);
    }
  }

  /**
   * Captures an immediate screenshot right before closing an unauthorized tab or app,
   * saving it to the "Closed Windows" folder under the interview and uploading to the backend.
   */
  public async captureClosedWindowScreenshot(reason: string, targetName: string): Promise<void> {
    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1920, height: 1080 }
      });

      if (sources.length === 0) return;

      const primarySource = sources[0];
      const imageBuffer = primarySource.thumbnail.toJPEG(85);
      const timestamp = new Date().toISOString();
      const cleanTarget = (targetName || 'window').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
      const filename = `closed_window_${Date.now()}_${cleanTarget}.jpg`;

      // 1. Save locally to "Closed Windows" folder under interview
      const currentIntId = this.interviewId || 'active_interview';
      const interviewDir = path.join(app.getPath('userData'), 'interviews', currentIntId, 'Closed Windows');
      if (!fs.existsSync(interviewDir)) {
        fs.mkdirSync(interviewDir, { recursive: true });
      }
      const localFilePath = path.join(interviewDir, filename);
      fs.writeFileSync(localFilePath, imageBuffer);
      console.log(`[Screenshot] Saved Closed Window screenshot to "${interviewDir}/${filename}"`);

      // 2. Upload to backend under Closed Windows
      const formData = new FormData();
      formData.append('image', imageBuffer, { filename, contentType: 'image/jpeg' });
      formData.append('candidateId', this.candidateId || '');
      formData.append('interviewId', this.interviewId || '');
      formData.append('capturedAt', timestamp);
      formData.append('captureSource', 'closed-windows');
      formData.append('category', 'Closed Windows');
      formData.append('targetName', targetName);
      formData.append('reason', reason);

      try {
        await apiClient.uploadScreenshot(formData as any);
        console.log(`[Screenshot] Uploaded Closed Window screenshot to server: ${filename}`);
      } catch (err) {
        console.warn(`[Screenshot] Offline or server error. Saved to retry queue: ${filename}`);
        const queueFilePath = path.join(QUEUE_DIR, `${filename}.meta.json`);
        const dataToSave = {
          candidateId: this.candidateId,
          interviewId: this.interviewId,
          capturedAt: timestamp,
          captureSource: 'closed-windows',
          category: 'Closed Windows',
          targetName,
          reason,
          base64Image: imageBuffer.toString('base64')
        };
        fs.writeFileSync(queueFilePath, JSON.stringify(dataToSave));
      }
    } catch (err) {
      console.error('[Screenshot] Failed to capture closed window screenshot:', err);
    }
  }

  private async uploadOrQueue(buffer: Buffer, timestamp: string, source: string): Promise<void> {
    const filename = `screenshot_${source}_${Date.now()}.jpg`;

    try {
      const formData = new FormData();
      formData.append('image', buffer, { filename, contentType: 'image/jpeg' });
      formData.append('candidateId', this.candidateId || '');
      formData.append('interviewId', this.interviewId || '');
      formData.append('capturedAt', timestamp);
      formData.append('captureSource', source);

      await apiClient.uploadScreenshot(formData as any);
      console.log(`[Screenshot] Uploaded ${source} screenshot: ${filename}`);
    } catch (err) {
      console.warn(`[Screenshot] Network error (${source}). Saving to offline retry queue: ${filename}`);
      const filePath = path.join(QUEUE_DIR, `${filename}.meta.json`);
      const dataToSave = {
        candidateId: this.candidateId,
        interviewId: this.interviewId,
        capturedAt: timestamp,
        captureSource: source,
        base64Image: buffer.toString('base64')
      };
      fs.writeFileSync(filePath, JSON.stringify(dataToSave));
    }
  }

  private async flushQueuedScreenshots(): Promise<void> {
    try {
      const files = fs.readdirSync(QUEUE_DIR);
      for (const file of files) {
        if (!file.endsWith('.meta.json')) continue;
        const filePath = path.join(QUEUE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const meta = JSON.parse(content);

        const buffer = Buffer.from(meta.base64Image, 'base64');
        const formData = new FormData();
        formData.append('image', buffer, { filename: 'queued.jpg', contentType: 'image/jpeg' });
        formData.append('candidateId', meta.candidateId);
        formData.append('interviewId', meta.interviewId);
        formData.append('capturedAt', meta.capturedAt);
        formData.append('captureSource', meta.captureSource || 'queued');

        await apiClient.uploadScreenshot(formData as any);
        fs.unlinkSync(filePath);
        console.log('[Screenshot] Successfully flushed queued screenshot:', file);
      }
    } catch (err) {
      // Offline queue retry silently handles errors
    }
  }
}

export const screenshotCaptureManager = new ScreenshotCaptureManager();

